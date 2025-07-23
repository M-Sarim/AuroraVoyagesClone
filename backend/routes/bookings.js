import express from "express";
import Booking from "../models/Booking.js";
import VacationPackage from "../models/VacationPackage.js";
import User from "../models/User.js";
import { auth, adminAuth, tourGuideAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all bookings (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vacationPackage", "name price")
      .populate("destination", "name country")
      .populate("transport", "type name departureTime");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user bookings
router.get("/user", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("vacationPackage", "name price images")
      .populate("destination", "name country images")
      .populate("transport", "type name departureTime arrivalTime");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get booking by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vacationPackage", "name price duration activities schedule")
      .populate("destination", "name country description images")
      .populate(
        "transport",
        "type name departureTime arrivalTime origin destination"
      );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to view this booking
    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      // If user is a tour guide, check if the booking is for their package
      if (req.user.role === "tourGuide" && booking.vacationPackage) {
        // Get the tour guide ID
        const tourGuideId = req.user.tourGuideProfile;

        if (!tourGuideId) {
          return res.status(403).json({ message: "Not authorized" });
        }

        // Get the package to check if it belongs to this tour guide
        const vacationPackage = await VacationPackage.findById(booking.vacationPackage);

        if (!vacationPackage || vacationPackage.tourGuide.toString() !== tourGuideId) {
          return res.status(403).json({ message: "Not authorized" });
        }
      } else {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create booking
router.post("/", auth, async (req, res) => {
  try {
    const {
      vacationPackage,
      destination,
      transport,
      startDate,
      endDate,
      totalPrice,
      travelerInfo,
    } = req.body;

    // Create new booking
    const booking = new Booking({
      user: req.user.id,
      vacationPackage,
      destination,
      transport,
      startDate,
      endDate,
      totalPrice,
      travelerInfo,
      status: "pending",
      paymentStatus: "pending",
      tourGuideApproval: {
        status: "pending",
        reason: "",
        date: null
      }
    });

    await booking.save();

    // Import the createNotification function
    const { createNotification } = await import("../routes/notifications.js");

    // If it's a vacation package booking, notify the tour guide
    if (vacationPackage) {
      // Get the vacation package details
      const packageDetails = await VacationPackage.findById(vacationPackage)
        .populate("tourGuide");

      if (packageDetails && packageDetails.tourGuide) {
        // Find the user associated with the tour guide
        const tourGuideUser = await User.findOne({ tourGuideProfile: packageDetails.tourGuide._id });

        if (tourGuideUser) {
          // Send notification to the tour guide
          await createNotification(
            req.io,
            tourGuideUser._id,
            req.user.id,
            "booking_created",
            "New Booking Request",
            `You have a new booking request for "${packageDetails.name}". Please review and approve or reject it.`,
            {
              bookingId: booking._id,
              packageId: packageDetails._id,
              packageName: packageDetails.name
            }
          );
        }
      }
    }

    // Notify all admins about the new booking
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification(
        req.io,
        admin._id,
        req.user.id,
        "booking_created",
        "New Booking Created",
        `A new booking has been created by ${req.user.name || 'a user'}.`,
        { bookingId: booking._id }
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status (admin only)
router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update payment status (admin only)
router.put("/:id/payment", adminAuth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["pending", "paid", "refunded"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel booking (user can cancel their own booking)
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    if (!cancellationReason) {
      return res.status(400).json({ message: "Cancellation reason is required" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if booking can be cancelled
    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed booking" });
    }

    // Update booking status and add cancellation reason
    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason;

    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get bookings for tour guide's packages
router.get("/tour-guide/packages", tourGuideAuth, async (req, res) => {
  try {
    // Get the tour guide ID from the authenticated user
    const tourGuideId = req.user.tourGuideProfile;

    if (!tourGuideId) {
      return res.status(400).json({
        message: "You must have a tour guide profile to view package bookings"
      });
    }

    // First, find all vacation packages created by this tour guide
    const tourGuidePackages = await VacationPackage.find({
      tourGuide: tourGuideId,
      status: "approved" // Only consider approved packages
    }).select('_id name');

    if (!tourGuidePackages || tourGuidePackages.length === 0) {
      return res.status(200).json([]);
    }

    // Get the package IDs
    const packageIds = tourGuidePackages.map(pkg => pkg._id);

    // Find all bookings for these packages
    const bookings = await Booking.find({
      vacationPackage: { $in: packageIds },
      status: { $in: ["pending", "confirmed"] } // Only show active bookings
    })
      .populate("user", "name email picture")
      .populate("vacationPackage", "name price duration images")
      .populate("destination", "name country")
      .populate("transport", "type name departureTime arrivalTime")
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get tour guide package bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Tour guide approves or rejects a booking
router.put("/:id/tour-guide-approval", tourGuideAuth, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const bookingId = req.params.id;

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    // If rejecting, reason is required
    if (status === "rejected" && !reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    // Get the tour guide ID from the authenticated user
    const tourGuideId = req.user.tourGuideProfile;

    if (!tourGuideId) {
      return res.status(400).json({
        message: "You must have a tour guide profile to approve/reject bookings"
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate("vacationPackage");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking is for a package owned by this tour guide
    if (!booking.vacationPackage) {
      return res.status(400).json({ message: "This booking is not for a vacation package" });
    }

    // Get the package details to verify ownership
    const vacationPackage = await VacationPackage.findById(booking.vacationPackage._id);

    if (!vacationPackage) {
      return res.status(404).json({ message: "Vacation package not found" });
    }

    // Verify the tour guide owns this package
    if (vacationPackage.tourGuide.toString() !== tourGuideId) {
      return res.status(403).json({ message: "Not authorized. This package doesn't belong to you" });
    }

    // Update the booking with tour guide approval
    booking.tourGuideApproval = {
      status: status,
      reason: status === "rejected" ? reason : "",
      date: new Date()
    };

    // If tour guide rejects, update the booking status to cancelled
    if (status === "rejected") {
      booking.status = "cancelled";
      booking.cancellationReason = `Rejected by tour guide: ${reason}`;
    }

    // If tour guide approves, update the booking status to confirmed (if payment is complete)
    if (status === "approved" && booking.paymentStatus === "paid") {
      booking.status = "confirmed";
    }

    await booking.save();

    // Import the createNotification function
    const { createNotification } = await import("../routes/notifications.js");

    // Send notification to the user who made the booking
    await createNotification(
      req.io,
      booking.user,
      req.user.id,
      status === "approved" ? "booking_approved" : "booking_rejected",
      status === "approved" ? "Booking Approved" : "Booking Rejected",
      status === "approved"
        ? `Your booking for "${vacationPackage.name}" has been approved by the tour guide.`
        : `Your booking for "${vacationPackage.name}" has been rejected by the tour guide. Reason: ${reason}`,
      {
        bookingId: booking._id,
        packageId: vacationPackage._id,
        packageName: vacationPackage.name,
        status: status,
        reason: status === "rejected" ? reason : null
      }
    );

    // Notify all admins about the booking status change
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification(
        req.io,
        admin._id,
        req.user.id,
        status === "approved" ? "booking_approved" : "booking_rejected",
        status === "approved" ? "Booking Approved" : "Booking Rejected",
        status === "approved"
          ? `A booking for "${vacationPackage.name}" has been approved by the tour guide.`
          : `A booking for "${vacationPackage.name}" has been rejected by the tour guide. Reason: ${reason}`,
        {
          bookingId: booking._id,
          packageId: vacationPackage._id,
          packageName: vacationPackage.name,
          status: status,
          reason: status === "rejected" ? reason : null
        }
      );
    }

    res.status(200).json({
      message: `Booking ${status === "approved" ? "approved" : "rejected"} successfully`,
      booking
    });
  } catch (error) {
    console.error("Tour guide booking approval error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
