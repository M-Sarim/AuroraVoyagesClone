import express from "express";
import jwt from "jsonwebtoken";
import VacationPackage from "../models/VacationPackage.js";
import TourGuide from "../models/TourGuide.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { adminAuth, tourGuideAuth, adminOrTourGuideAuth, auth } from "../middleware/auth.js";

const router = express.Router();

// Get all vacation packages
router.get("/", async (req, res) => {
  try {
    const { minPrice, maxPrice, duration, destination, status } = req.query;

    // Build filter object
    const filter = {};
    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    if (duration) filter.duration = duration;
    if (destination) filter.destinations = destination;

    // By default, only show approved packages to regular users
    // If status is specified, use it (admin can see all statuses)
    if (status) {
      filter.status = status;
    } else {
      // Default to showing only approved packages
      filter.status = "approved";
    }

    const vacations = await VacationPackage.find(filter)
      .populate("destinations", "name country")
      .populate("tourGuide", "name experience rating")
      .populate("company", "name logo");

    res.status(200).json(vacations);
  } catch (error) {
    console.error("Get vacations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get vacation package by ID
router.get("/:id", async (req, res) => {
  try {
    const vacation = await VacationPackage.findById(req.params.id)
      .populate("destinations", "name country description images")
      .populate("tourGuide", "name experience rating languages specialties image bio")
      .populate("company", "name logo website description");

    if (!vacation) {
      return res.status(404).json({ message: "Vacation package not found" });
    }

    // If the package is not approved, only allow admin or the tour guide who created it to view
    if (vacation.status !== "approved") {
      // Check if user is authenticated
      const token = req.header("x-auth-token");
      if (!token) {
        return res.status(404).json({ message: "Vacation package not found" });
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If not admin and not the tour guide who created it, return 404
        if (decoded.role !== "admin" &&
            (decoded.role !== "tourGuide" ||
             vacation.tourGuide._id.toString() !== decoded.tourGuideId)) {
          return res.status(404).json({ message: "Vacation package not found" });
        }
      } catch (error) {
        return res.status(404).json({ message: "Vacation package not found" });
      }
    }

    res.status(200).json(vacation);
  } catch (error) {
    console.error("Get vacation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create vacation package (admin only) - automatically approved
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      company,
      tourGuide,
      destinations,
      duration,
      price,
      activities,
      includedTransport,
      includedHotels,
      includedMeals,
      schedule,
      images,
    } = req.body;

    // Create new vacation package (admin-created packages are auto-approved)
    const vacation = new VacationPackage({
      name,
      description,
      company,
      tourGuide,
      destinations,
      duration,
      price,
      activities,
      includedTransport,
      includedHotels,
      includedMeals,
      schedule,
      images,
      status: "approved", // Auto-approve admin-created packages
      submittedBy: "admin",
    });

    await vacation.save();

    // If company is provided, add this package to the company's packages
    if (company) {
      await Company.findByIdAndUpdate(
        company,
        { $push: { vacationPackages: vacation._id } }
      );
    }

    // If tour guide is provided, add this package to the tour guide's packages
    if (tourGuide) {
      await TourGuide.findByIdAndUpdate(
        tourGuide,
        { $push: { vacationPackages: vacation._id } }
      );
    }

    res.status(201).json(vacation);
  } catch (error) {
    console.error("Create vacation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Tour guide submits a vacation package (requires tour guide authentication)
router.post("/submit", tourGuideAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      company,
      destinations,
      duration,
      price,
      activities,
      includedTransport,
      includedHotels,
      includedMeals,
      schedule,
      images,
    } = req.body;

    // Get the tour guide ID from the authenticated user
    const tourGuideId = req.user.tourGuideProfile;

    if (!tourGuideId) {
      return res.status(400).json({
        message: "You must have a tour guide profile to submit packages"
      });
    }

    // Verify the tour guide exists
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide profile not found" });
    }

    // Create new vacation package with pending status
    const vacation = new VacationPackage({
      name,
      description,
      company: company || tourGuide.company, // Use provided company or the tour guide's company
      tourGuide: tourGuideId,
      destinations,
      duration,
      price,
      activities,
      includedTransport,
      includedHotels,
      includedMeals,
      schedule,
      images,
      status: "pending", // Tour guide submissions start as pending
      submittedBy: "tourGuide",
    });

    await vacation.save();

    // Add this package to the tour guide's packages
    await TourGuide.findByIdAndUpdate(
      tourGuideId,
      { $push: { vacationPackages: vacation._id } }
    );

    // If company is provided, add this package to the company's packages
    if (company || tourGuide.company) {
      const companyId = company || tourGuide.company;
      await Company.findByIdAndUpdate(
        companyId,
        { $push: { vacationPackages: vacation._id } }
      );
    }

    res.status(201).json(vacation);
  } catch (error) {
    console.error("Submit vacation package error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update vacation package (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const vacation = await VacationPackage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!vacation) {
      return res.status(404).json({ message: "Vacation package not found" });
    }

    res.status(200).json(vacation);
  } catch (error) {
    console.error("Update vacation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete vacation package (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const vacation = await VacationPackage.findById(req.params.id);

    if (!vacation) {
      return res.status(404).json({ message: "Vacation package not found" });
    }

    // Remove from tour guide's packages if applicable
    if (vacation.tourGuide) {
      await TourGuide.findByIdAndUpdate(
        vacation.tourGuide,
        { $pull: { vacationPackages: vacation._id } }
      );
    }

    // Remove from company's packages if applicable
    if (vacation.company) {
      await Company.findByIdAndUpdate(
        vacation.company,
        { $pull: { vacationPackages: vacation._id } }
      );
    }

    // Delete the vacation package
    await VacationPackage.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Vacation package deleted successfully" });
  } catch (error) {
    console.error("Delete vacation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending vacation packages (admin only)
router.get("/admin/pending", adminAuth, async (req, res) => {
  try {
    const pendingPackages = await VacationPackage.find({ status: "pending" })
      .populate("destinations", "name country")
      .populate("tourGuide", "name experience rating")
      .populate("company", "name logo");

    res.status(200).json(pendingPackages);
  } catch (error) {
    console.error("Get pending packages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve a vacation package (admin only)
router.patch("/:id/approve", adminAuth, async (req, res) => {
  try {
    console.log(`Approving vacation package with ID: ${req.params.id}`);
    console.log(`Request from user: ${req.user.id}, role: ${req.user.role}`);
    console.log('Request headers:', req.headers);

    // First check if the package exists
    const packageExists = await VacationPackage.findById(req.params.id)
      .populate("tourGuide");

    if (!packageExists) {
      console.log(`Package with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Vacation package not found" });
    }

    console.log(`Found package: ${packageExists.name}, current status: ${packageExists.status}`);

    try {
      // Update the package status
      const vacation = await VacationPackage.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            status: "approved",
            rejectionReason: "" // Clear any previous rejection reason
          }
        },
        { new: true }
      )
      .populate("destinations", "name country")
      .populate("tourGuide", "name experience rating")
      .populate("company", "name logo");

      if (!vacation) {
        console.log(`Failed to update package with ID ${req.params.id}`);
        return res.status(404).json({ message: "Failed to update vacation package" });
      }

      // Import the createNotification function
      const { createNotification } = await import("../routes/notifications.js");

      // Find the user associated with the tour guide
      if (packageExists.tourGuide) {
        // Get the user ID associated with this tour guide
        const tourGuideUser = await User.findOne({ tourGuideProfile: packageExists.tourGuide._id });

        if (tourGuideUser) {
          // Send notification to the tour guide
          await createNotification(
            req.io,
            tourGuideUser._id,
            req.user.id,
            "package_approved",
            "Package Approved",
            `Your vacation package "${packageExists.name}" has been approved and is now live.`,
            { packageId: packageExists._id, packageName: packageExists.name }
          );
        }
      }

      // Send notification to all users about the new package
      const allUsers = await User.find({ role: "user" });

      for (const user of allUsers) {
        await createNotification(
          req.io,
          user._id,
          null,
          "new_package_available",
          "New Vacation Package Available",
          `Check out the new vacation package: "${packageExists.name}"`,
          { packageId: packageExists._id, packageName: packageExists.name }
        );
      }

      console.log(`Successfully approved package: ${vacation.name}`);
      return res.status(200).json(vacation);
    } catch (updateError) {
      console.error("Error updating package:", updateError);
      return res.status(500).json({ message: "Database error while updating package" });
    }
  } catch (error) {
    console.error("Approve vacation error:", error);
    return res.status(500).json({ message: "Server error while approving package" });
  }
});

// Reject a vacation package (admin only)
router.patch("/:id/reject", adminAuth, async (req, res) => {
  try {
    console.log(`Rejecting vacation package with ID: ${req.params.id}`);
    console.log(`Request from user: ${req.user.id}, role: ${req.user.role}`);

    const { rejectionReason } = req.body;
    console.log(`Rejection reason: ${rejectionReason}`);

    if (!rejectionReason) {
      console.log('Rejection reason is missing');
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    // First check if the package exists
    const packageExists = await VacationPackage.findById(req.params.id)
      .populate("tourGuide");

    if (!packageExists) {
      console.log(`Package with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Vacation package not found" });
    }

    console.log(`Found package: ${packageExists.name}, current status: ${packageExists.status}`);

    const vacation = await VacationPackage.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "rejected",
          rejectionReason
        }
      },
      { new: true }
    )
    .populate("destinations", "name country")
    .populate("tourGuide", "name experience rating")
    .populate("company", "name logo");

    if (!vacation) {
      console.log(`Failed to update package with ID ${req.params.id}`);
      return res.status(404).json({ message: "Failed to update vacation package" });
    }

    // Import the createNotification function
    const { createNotification } = await import("../routes/notifications.js");

    // Find the user associated with the tour guide
    if (packageExists.tourGuide) {
      // Get the user ID associated with this tour guide
      const tourGuideUser = await User.findOne({ tourGuideProfile: packageExists.tourGuide._id });

      if (tourGuideUser) {
        // Send notification to the tour guide
        await createNotification(
          req.io,
          tourGuideUser._id,
          req.user.id,
          "package_rejected",
          "Package Rejected",
          `Your vacation package "${packageExists.name}" has been rejected. Reason: ${rejectionReason}`,
          {
            packageId: packageExists._id,
            packageName: packageExists.name,
            rejectionReason
          }
        );
      }
    }

    console.log(`Successfully rejected package: ${vacation.name}`);
    res.status(200).json(vacation);
  } catch (error) {
    console.error("Reject vacation error:", error);
    res.status(500).json({ message: "Server error while rejecting package" });
  }
});

// Get tour guide's submitted packages
router.get("/tour-guide/submissions", tourGuideAuth, async (req, res) => {
  try {
    const tourGuideId = req.user.tourGuideProfile;

    if (!tourGuideId) {
      return res.status(400).json({
        message: "You must have a tour guide profile to view submissions"
      });
    }

    const packages = await VacationPackage.find({
      tourGuide: tourGuideId
    })
    .populate("destinations", "name country")
    .populate("company", "name logo");

    res.status(200).json(packages);
  } catch (error) {
    console.error("Get tour guide submissions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
