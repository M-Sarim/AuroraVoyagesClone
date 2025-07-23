import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Itinerary from '../models/Itinerary.js';
import { sendNotificationToUser } from '../socket.js';

/**
 * Create a notification for a specific user
 * @param {Object} data - Notification data
 * @param {Object} data.io - Socket.IO instance
 * @param {String} data.userId - User ID to send notification to
 * @param {String} data.type - Notification type
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {Object} data.data - Additional data for the notification
 * @returns {Promise<Object>} - Created notification
 */
export const createUserNotification = async (data) => {
  try {
    const notification = new Notification({
      recipient: data.userId,
      sender: null, // No sender for system notifications
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      read: false
    });

    await notification.save();

    // Send real-time notification if socket is available
    if (data.io) {
      sendNotificationToUser(data.io, data.userId, {
        id: notification._id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        createdAt: notification.createdAt,
        read: false
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create notifications for users who have booked trips to a specific destination
 * @param {Object} data - Notification data
 * @param {Object} data.io - Socket.IO instance
 * @param {String} data.destinationId - Destination ID
 * @param {String} data.type - Notification type
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {Object} data.data - Additional data for the notification
 * @returns {Promise<Array>} - Created notifications
 */
export const notifyUsersWithDestinationBookings = async (data) => {
  try {
    // Find bookings for the destination
    const bookings = await Booking.find({
      'vacationPackage.destination': data.destinationId,
      status: { $in: ['confirmed', 'pending'] }
    }).distinct('user');

    console.log(`Found ${bookings.length} users with bookings for destination ${data.destinationId}`);

    // Create notifications for each user
    const notifications = [];
    for (const userId of bookings) {
      const notification = await createUserNotification({
        io: data.io,
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: {
          ...data.data,
          destinationId: data.destinationId
        }
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error notifying users with destination bookings:', error);
    throw error;
  }
};

/**
 * Create notifications for users who have the destination in their itinerary
 * @param {Object} data - Notification data
 * @param {Object} data.io - Socket.IO instance
 * @param {String} data.destinationId - Destination ID
 * @param {String} data.type - Notification type
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {Object} data.data - Additional data for the notification
 * @returns {Promise<Array>} - Created notifications
 */
export const notifyUsersWithDestinationInItinerary = async (data) => {
  try {
    // Find itineraries that include the destination
    const itineraries = await Itinerary.find({
      'items.destination': data.destinationId
    }).distinct('user');

    console.log(`Found ${itineraries.length} users with itineraries for destination ${data.destinationId}`);

    // Create notifications for each user
    const notifications = [];
    for (const userId of itineraries) {
      const notification = await createUserNotification({
        io: data.io,
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: {
          ...data.data,
          destinationId: data.destinationId
        }
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error notifying users with destination in itinerary:', error);
    throw error;
  }
};

/**
 * Create notifications for all users with a specific role
 * @param {Object} data - Notification data
 * @param {Object} data.io - Socket.IO instance
 * @param {String} data.role - User role (e.g., 'user', 'admin', 'tourguide')
 * @param {String} data.type - Notification type
 * @param {String} data.title - Notification title
 * @param {String} data.message - Notification message
 * @param {Object} data.data - Additional data for the notification
 * @returns {Promise<Array>} - Created notifications
 */
export const notifyUsersByRole = async (data) => {
  try {
    // Find users with the specified role
    const users = await User.find({ role: data.role }).select('_id');

    console.log(`Found ${users.length} users with role ${data.role}`);

    // Create notifications for each user
    const notifications = [];
    for (const user of users) {
      const notification = await createUserNotification({
        io: data.io,
        userId: user._id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {}
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error notifying users by role:', error);
    throw error;
  }
};

/**
 * Create a notification for cultural information updates
 * @param {Object} io - Socket.IO instance
 * @param {Object} culturalInfo - The cultural information object
 * @param {String} action - The action performed (created, updated)
 * @returns {Promise<Array>} - Created notifications
 */
export const notifyCulturalInfoUpdate = async (io, culturalInfo, action) => {
  try {
    const destinationId = culturalInfo.destination._id || culturalInfo.destination;
    const isEssential = culturalInfo.importance === 'essential';

    // Determine notification type and message based on action and importance
    const type = 'cultural_info_added';
    const title = isEssential
      ? `Essential Cultural Information for Your Trip`
      : `New Cultural Information Available`;

    const message = isEssential
      ? `Important cultural information about ${culturalInfo.title} has been ${action} for your upcoming destination.`
      : `New cultural information about ${culturalInfo.title} has been ${action} for your upcoming destination.`;

    console.log(`Sending cultural info notifications for destination ${destinationId}`);

    // Notify users with bookings to this destination
    const bookingNotifications = await notifyUsersWithDestinationBookings({
      io,
      destinationId,
      type,
      title,
      message,
      data: {
        culturalInfoId: culturalInfo._id,
        category: culturalInfo.category
      }
    });

    // If essential, also notify users with this destination in their itinerary
    let itineraryNotifications = [];
    if (isEssential) {
      itineraryNotifications = await notifyUsersWithDestinationInItinerary({
        io,
        destinationId,
        type,
        title,
        message,
        data: {
          culturalInfoId: culturalInfo._id,
          category: culturalInfo.category
        }
      });
    }

    // Also notify all regular users about new cultural information
    const userNotifications = await notifyUsersByRole({
      io,
      role: 'user',
      type,
      title,
      message,
      data: {
        culturalInfoId: culturalInfo._id,
        category: culturalInfo.category,
        destinationId
      }
    });

    return [...bookingNotifications, ...itineraryNotifications, ...userNotifications];
  } catch (error) {
    console.error('Error creating cultural info notifications:', error);
    throw error;
  }
};

/**
 * Create a notification for travel requirement updates
 * @param {Object} io - Socket.IO instance
 * @param {Object} requirement - The travel requirement object
 * @param {String} action - The action performed (created, updated)
 * @returns {Promise<Array>} - Created notifications
 */
export const notifyTravelRequirementUpdate = async (io, requirement, action) => {
  try {
    const destinationId = requirement.destination._id || requirement.destination;
    const isRequired = requirement.isRequired;

    // Determine notification type and message based on action and requirement status
    const type = 'requirement_update';
    const title = isRequired
      ? `Important Travel Requirement Update`
      : `Travel Requirement Information Update`;

    const message = isRequired
      ? `A required travel document (${requirement.name}) has been ${action} for your upcoming destination.`
      : `Travel requirement information for ${requirement.name} has been ${action} for your upcoming destination.`;

    console.log(`Sending travel requirement notifications for destination ${destinationId}`);

    // Notify users with bookings to this destination
    const bookingNotifications = await notifyUsersWithDestinationBookings({
      io,
      destinationId,
      type,
      title,
      message,
      data: {
        requirementId: requirement._id,
        type: requirement.type
      }
    });

    // If required, also notify users with this destination in their itinerary
    let itineraryNotifications = [];
    if (isRequired) {
      itineraryNotifications = await notifyUsersWithDestinationInItinerary({
        io,
        destinationId,
        type,
        title,
        message,
        data: {
          requirementId: requirement._id,
          type: requirement.type
        }
      });
    }

    // Also notify all regular users about important travel requirements
    let userNotifications = [];
    if (isRequired) {
      userNotifications = await notifyUsersByRole({
        io,
        role: 'user',
        type,
        title,
        message,
        data: {
          requirementId: requirement._id,
          type: requirement.type,
          destinationId
        }
      });
    }

    return [...bookingNotifications, ...itineraryNotifications, ...userNotifications];
  } catch (error) {
    console.error('Error creating travel requirement notifications:', error);
    throw error;
  }
};

export default {
  createUserNotification,
  notifyUsersWithDestinationBookings,
  notifyUsersWithDestinationInItinerary,
  notifyUsersByRole,
  notifyCulturalInfoUpdate,
  notifyTravelRequirementUpdate
};
