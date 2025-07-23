import React, { useState, useEffect, createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';

// Create notification context
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setLoading(true);
        const response = await api.get('/notifications');
        setNotifications(response.data);
        setUnreadCount(response.data.filter(notification => !notification.read).length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, user]);

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Create socket connection
      const newSocket = io(process.env.REACT_APP_API_URL.replace('/api', ''), {
        query: { userId: user.id }
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Listen for notifications
  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Toast Component
export const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade-out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-elevated p-5 max-w-md transition-all duration-300 animate-slide-up ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {notification.type === 'booking' && (
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          {notification.type === 'tour_guide' && (
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          {notification.type === 'package' && (
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>
        <div className="ml-4 w-0 flex-1">
          <p className="text-sm font-medium text-neutral-800">{notification.message}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {new Date(notification.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="rounded-full p-1 inline-flex text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 transition-colors duration-200"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    // Booking related
    if (type.includes('booking_')) {
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }

    // Payment related
    if (type.includes('payment_') || type.includes('refund_')) {
      return (
        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    // Tour guide related
    if (type.includes('tour_guide_')) {
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }

    // Package related
    if (type.includes('package_')) {
      return (
        <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    }

    // Travel requirements related
    if (type.includes('requirement_') || type.includes('visa_') || type.includes('permit_')) {
      return (
        <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }

    // Cultural info related
    if (type.includes('cultural_')) {
      return (
        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    // Forum related
    if (type.includes('forum_')) {
      return (
        <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      );
    }

    // Itinerary related
    if (type.includes('itinerary_') || type.includes('trip_')) {
      return (
        <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    }

    // Weather related
    if (type.includes('weather_')) {
      return (
        <svg className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    }

    // Default for system and other types
    return (
      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  // Get notification link based on type and data
  const getNotificationLink = (notification) => {
    const { type, data } = notification;

    // Booking related
    if (type.includes('booking_')) {
      return data?.bookingId ? `/bookings/${data.bookingId}` : '/dashboard';
    }

    // Payment related
    if (type.includes('payment_') || type.includes('refund_')) {
      return data?.bookingId ? `/bookings/${data.bookingId}` : '/dashboard';
    }

    // Tour guide related
    if (type.includes('tour_guide_')) {
      return '/tour-guide/dashboard';
    }

    // Package related
    if (type.startsWith('package_')) {
      if (type === 'package_submitted' || type === 'package_approved' || type === 'package_rejected') {
        return data?.packageId ? `/vacations/${data.packageId}` : '/tour-guide/my-submissions';
      }
      return data?.packageId ? `/vacations/${data.packageId}` : '/vacations';
    }

    // Travel requirements related
    if (type.includes('requirement_') || type.includes('visa_') || type.includes('permit_')) {
      return data?.destinationId
        ? `/regulations-culture/${data.destinationId}`
        : '/regulations-culture';
    }

    // Cultural info related
    if (type.includes('cultural_')) {
      return data?.destinationId
        ? `/regulations-culture/${data.destinationId}`
        : '/regulations-culture';
    }

    // Forum related
    if (type.includes('forum_')) {
      return data?.postId ? `/forum/posts/${data.postId}` : '/forum';
    }

    // Itinerary related
    if (type.includes('itinerary_')) {
      return data?.itineraryId ? `/itineraries/${data.itineraryId}` : '/itineraries';
    }

    if (type === 'trip_upcoming') {
      return '/dashboard';
    }

    // Weather related
    if (type === 'weather_alert') {
      return data?.destinationId ? `/destinations/${data.destinationId}` : '/destinations';
    }

    // Default
    return '/dashboard';
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full text-neutral-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-accent-500 text-white text-xs font-medium flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-2xl shadow-elevated bg-white/95 backdrop-blur-md focus:outline-none z-50 overflow-hidden animate-fade-in">
          <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-5 py-4 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-neutral-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
                    onClick={() => {
                      markAllAsRead();
                      setIsOpen(false);
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[28rem] overflow-y-auto">
              {loading ? (
                <div className="px-5 py-8 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-3 text-sm text-neutral-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                    <BellIcon className="h-8 w-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500 font-medium">No notifications</p>
                  <p className="text-sm text-neutral-400 mt-1">We'll notify you when something arrives</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <Link
                    key={notification._id}
                    to={getNotificationLink(notification)}
                    className={`block px-5 py-4 hover:bg-neutral-50 transition-colors duration-150 ${!notification.read ? 'bg-primary-50' : ''}`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full ${
                          !notification.read ? 'bg-primary-100' : 'bg-neutral-100'
                        } flex items-center justify-center`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-neutral-800">{notification.title}</p>
                        <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-neutral-500 mt-1.5">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary-500"></div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationProvider;
