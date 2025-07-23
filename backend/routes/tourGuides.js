import express from "express";
import TourGuide from "../models/TourGuide.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import { adminAuth, auth, tourGuideAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all tour guides
router.get("/", async (req, res) => {
  try {
    const { company, language, specialty, available, status } = req.query;

    // Build filter object
    const filter = {};
    if (company) filter.company = company;
    if (language) filter.languages = language;
    if (specialty) filter.specialties = specialty;
    if (available !== undefined) filter.availability = available === "true";
    if (status) filter.status = status;

    const tourGuides = await TourGuide.find(filter)
      .populate("company", "name logo")
      .populate("vacationPackages", "name price duration");

    res.status(200).json(tourGuides);
  } catch (error) {
    console.error("Get tour guides error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending tour guide applications (admin only)
router.get("/pending", adminAuth, async (req, res) => {
  try {
    const pendingGuides = await TourGuide.find({ status: "pending" })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingGuides);
  } catch (error) {
    console.error("Get pending tour guides error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get tour guide by ID
router.get("/:id", async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id)
      .populate("company", "name logo website")
      .populate("vacationPackages", "name price duration destinations");

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error("Get tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create tour guide (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      languages,
      specialties,
      experience,
      image,
      bio,
      company,
    } = req.body;

    // Check if email already exists
    const existingGuide = await TourGuide.findOne({ email });
    if (existingGuide) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const tourGuide = new TourGuide({
      name,
      email,
      phone,
      languages,
      specialties,
      experience,
      image,
      bio,
      company,
    });

    await tourGuide.save();

    res.status(201).json(tourGuide);
  } catch (error) {
    console.error("Create tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update tour guide (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error("Update tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete tour guide (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndDelete(req.params.id);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({ message: "Tour guide deleted successfully" });
  } catch (error) {
    console.error("Delete tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update tour guide rating
router.patch("/:id/rating", async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    const tourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      { $set: { rating } },
      { new: true }
    );

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve a tour guide application (admin only)
router.patch("/:id/approve", adminAuth, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "approved",
          rejectionReason: "" // Clear any previous rejection reason
        }
      },
      { new: true }
    );

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Update the user's role to tourGuide
    const user = await User.findOneAndUpdate(
      { email: tourGuide.email },
      { $set: { role: "tourGuide" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Import the createNotification function
    const { createNotification } = await import("../routes/notifications.js");

    // Send notification to the tour guide
    await createNotification(
      req.io,
      user._id,
      req.user.id,
      "tour_guide_approved",
      "Tour Guide Application Approved",
      "Congratulations! Your tour guide application has been approved. You can now create and manage vacation packages.",
      { tourGuideId: tourGuide._id }
    );

    // Send notification to all admins about the new tour guide
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin._id.toString() !== req.user.id) { // Don't notify the admin who approved
        await createNotification(
          req.io,
          admin._id,
          req.user.id,
          "tour_guide_approved",
          "New Tour Guide Approved",
          `${tourGuide.name} has been approved as a tour guide.`,
          { tourGuideId: tourGuide._id }
        );
      }
    }

    res.status(200).json({
      message: "Tour guide application approved successfully",
      tourGuide
    });
  } catch (error) {
    console.error("Approve tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject a tour guide application (admin only)
router.patch("/:id/reject", adminAuth, async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const tourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "rejected",
          rejectionReason
        }
      },
      { new: true }
    );

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Update the user's role back to user
    const user = await User.findOneAndUpdate(
      { email: tourGuide.email },
      { $set: { role: "user" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Import the createNotification function
    const { createNotification } = await import("../routes/notifications.js");

    // Send notification to the tour guide
    await createNotification(
      req.io,
      user._id,
      req.user.id,
      "tour_guide_rejected",
      "Tour Guide Application Rejected",
      `Your tour guide application has been rejected. Reason: ${rejectionReason}`,
      {
        tourGuideId: tourGuide._id,
        rejectionReason
      }
    );

    // Send notification to all admins about the rejected tour guide
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin._id.toString() !== req.user.id) { // Don't notify the admin who rejected
        await createNotification(
          req.io,
          admin._id,
          req.user.id,
          "tour_guide_rejected",
          "Tour Guide Application Rejected",
          `${tourGuide.name}'s tour guide application has been rejected.`,
          {
            tourGuideId: tourGuide._id,
            rejectionReason
          }
        );
      }
    }

    res.status(200).json({
      message: "Tour guide application rejected",
      tourGuide
    });
  } catch (error) {
    console.error("Reject tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Register as a tour guide (requires user authentication)
router.post("/register", auth, async (req, res) => {
  try {
    const {
      phone,
      languages,
      specialties,
      experience,
      image,
      bio,
      company,
    } = req.body;

    // Get user information from the authenticated user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a tour guide
    if (user.role === "tourGuide" && user.tourGuideProfile) {
      return res.status(400).json({ message: "You are already a tour guide" });
    }

    // Check if email already exists in tour guides
    const existingGuide = await TourGuide.findOne({ email: user.email });
    if (existingGuide) {
      return res.status(400).json({ message: "Email already registered as a tour guide" });
    }

    // Create new tour guide profile
    const tourGuide = new TourGuide({
      name: user.name,
      email: user.email,
      phone,
      languages,
      specialties,
      experience,
      image: image || user.picture, // Use user's picture if no image provided
      bio,
      company,
    });

    await tourGuide.save();

    // Update user role to pendingTourGuide and link to tour guide profile
    user.role = "pendingTourGuide";
    user.tourGuideProfile = tourGuide._id;
    await user.save();

    // If company is provided, add this tour guide to the company's tour guides
    if (company) {
      await Company.findByIdAndUpdate(
        company,
        { $push: { tourGuides: tourGuide._id } }
      );
    }

    res.status(201).json({
      message: "Tour guide application submitted successfully. An admin will review your application.",
      tourGuide
    });
  } catch (error) {
    console.error("Register tour guide error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current tour guide profile (for authenticated tour guides)
router.get("/profile/me", tourGuideAuth, async (req, res) => {
  try {
    const tourGuideId = req.user.tourGuideProfile;

    if (!tourGuideId) {
      return res.status(400).json({
        message: "You don't have a tour guide profile"
      });
    }

    const tourGuide = await TourGuide.findById(tourGuideId)
      .populate("company", "name logo website")
      .populate("vacationPackages", "name price duration destinations status");

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide profile not found" });
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error("Get tour guide profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update current tour guide profile (for authenticated tour guides)
router.put("/profile/me", tourGuideAuth, async (req, res) => {
  try {
    const tourGuideId = req.user.tourGuideProfile;

    if (!tourGuideId) {
      return res.status(400).json({
        message: "You don't have a tour guide profile"
      });
    }

    const {
      phone,
      languages,
      specialties,
      experience,
      image,
      bio,
      company,
      availability
    } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (phone) updateFields.phone = phone;
    if (languages) updateFields.languages = languages;
    if (specialties) updateFields.specialties = specialties;
    if (experience) updateFields.experience = experience;
    if (image) updateFields.image = image;
    if (bio) updateFields.bio = bio;
    if (company) updateFields.company = company;
    if (availability !== undefined) updateFields.availability = availability;

    const tourGuide = await TourGuide.findByIdAndUpdate(
      tourGuideId,
      { $set: updateFields },
      { new: true }
    )
    .populate("company", "name logo website")
    .populate("vacationPackages", "name price duration destinations status");

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide profile not found" });
    }

    // If company is updated, update the company's tour guides list
    if (company) {
      // Remove from old company if exists
      if (tourGuide.company && tourGuide.company.toString() !== company) {
        await Company.findByIdAndUpdate(
          tourGuide.company,
          { $pull: { tourGuides: tourGuide._id } }
        );
      }

      // Add to new company
      await Company.findByIdAndUpdate(
        company,
        { $addToSet: { tourGuides: tourGuide._id } }
      );
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    console.error("Update tour guide profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
