import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: [
      // Booking related
      "booking_created",
      "booking_updated",
      "booking_cancelled",
      "booking_approved",
      "booking_rejected",

      // Payment related
      "payment_received",
      "payment_failed",
      "refund_requested",
      "refund_processed",

      // Tour guide related
      "tour_guide_application",
      "tour_guide_approved",
      "tour_guide_rejected",

      // Package related
      "package_submitted",
      "package_approved",
      "package_rejected",
      "new_package_available",

      // Travel requirements related
      "requirement_update",
      "permit_expiring",
      "visa_reminder",

      // Cultural info related
      "cultural_info_added",
      "cultural_tip_reminder",

      // Forum related
      "forum_post_reply",
      "forum_post_liked",

      // Itinerary related
      "itinerary_updated",
      "itinerary_shared",
      "trip_upcoming",

      // Weather related
      "weather_alert",

      // System
      "system",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  data: {
    // For storing additional data related to the notification
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
