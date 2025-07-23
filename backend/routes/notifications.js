import express from "express";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";
import { sendNotificationToUser } from "../socket.js";

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get unread notification count
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all notifications as read
router.patch("/mark-all-read", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a notification
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to create and send a notification
export const createNotification = async (
  io,
  recipientId,
  senderId,
  type,
  title,
  message,
  data = {}
) => {
  try {
    // Create notification in database
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      data,
    });

    await notification.save();

    // Send real-time notification if socket is available
    if (io) {
      sendNotificationToUser(io, recipientId, {
        id: notification._id,
        type,
        title,
        message,
        data,
        createdAt: notification.createdAt,
        read: false,
      });
    }

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

export default router;
