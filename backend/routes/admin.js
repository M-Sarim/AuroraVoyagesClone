import express from "express";
import { adminAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import VacationPackage from "../models/VacationPackage.js";
import Destination from "../models/Destination.js";
import TourGuide from "../models/TourGuide.js";

const router = express.Router();

// Get dashboard statistics
router.get("/analytics/stats", adminAuth, async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total bookings count
    const totalBookings = await Booking.countDocuments();

    // Get total revenue
    const bookings = await Booking.find({ paymentStatus: "paid" });
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    // Get pending approvals count (tour guides + vacation packages)
    const pendingTourGuides = await TourGuide.countDocuments({
      status: "pending",
    });
    const pendingPackages = await VacationPackage.countDocuments({
      status: "pending",
    });
    const pendingApprovals = pendingTourGuides + pendingPackages;

    res.status(200).json({
      totalUsers,
      totalBookings,
      totalRevenue,
      pendingApprovals,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching admin statistics" });
  }
});

// Get revenue data
router.get("/analytics/revenue", adminAuth, async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    // Get all paid bookings
    const bookings = await Booking.find({
      paymentStatus: "paid",
      createdAt: { $exists: true },
    });

    // Group bookings by period
    const revenueData = [];

    if (period === "daily") {
      // Last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(thirtyDaysAgo.getDate() + i);

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= dayStart && bookingDate <= dayEnd;
        });

        const dayRevenue = dayBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        revenueData.push({
          label: date.toLocaleDateString(),
          revenue: dayRevenue,
        });
      }
    } else if (period === "monthly") {
      // Last 12 months
      const today = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (let i = 11; i >= 0; i--) {
        const month = today.getMonth() - i;
        const year = today.getFullYear() + Math.floor(month / 12);
        const adjustedMonth = ((month % 12) + 12) % 12;

        const monthStart = new Date(year, adjustedMonth, 1);
        const monthEnd = new Date(year, adjustedMonth + 1, 0, 23, 59, 59, 999);

        const monthBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        });

        const monthRevenue = monthBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        revenueData.push({
          label: `${monthNames[adjustedMonth]} ${year}`,
          revenue: monthRevenue,
        });
      }
    } else if (period === "yearly") {
      // Last 5 years
      const currentYear = new Date().getFullYear();

      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;

        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

        const yearBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= yearStart && bookingDate <= yearEnd;
        });

        const yearRevenue = yearBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        revenueData.push({
          label: year.toString(),
          revenue: yearRevenue,
        });
      }
    }

    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching revenue analytics" });
  }
});

// Get bookings data
router.get("/analytics/bookings", adminAuth, async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    // Get all bookings
    const bookings = await Booking.find({
      createdAt: { $exists: true },
    });

    // Group bookings by period
    const bookingsData = [];

    if (period === "daily") {
      // Last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(thirtyDaysAgo.getDate() + i);

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= dayStart && bookingDate <= dayEnd;
        });

        bookingsData.push({
          label: date.toLocaleDateString(),
          count: dayBookings.length,
        });
      }
    } else if (period === "monthly") {
      // Last 12 months
      const today = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (let i = 11; i >= 0; i--) {
        const month = today.getMonth() - i;
        const year = today.getFullYear() + Math.floor(month / 12);
        const adjustedMonth = ((month % 12) + 12) % 12;

        const monthStart = new Date(year, adjustedMonth, 1);
        const monthEnd = new Date(year, adjustedMonth + 1, 0, 23, 59, 59, 999);

        const monthBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        });

        bookingsData.push({
          label: `${monthNames[adjustedMonth]} ${year}`,
          count: monthBookings.length,
        });
      }
    } else if (period === "yearly") {
      // Last 5 years
      const currentYear = new Date().getFullYear();

      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;

        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

        const yearBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= yearStart && bookingDate <= yearEnd;
        });

        bookingsData.push({
          label: year.toString(),
          count: yearBookings.length,
        });
      }
    }

    res.status(200).json(bookingsData);
  } catch (error) {
    console.error("Bookings analytics error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching bookings analytics" });
  }
});

// Get popular destinations
router.get("/analytics/popular-destinations", adminAuth, async (req, res) => {
  try {
    // Get all bookings with destination populated
    const bookings = await Booking.find().populate("destination", "name");

    // Count bookings per destination
    const destinationCounts = {};

    bookings.forEach((booking) => {
      if (booking.destination) {
        const destId = booking.destination._id.toString();
        const destName = booking.destination.name;

        if (!destinationCounts[destId]) {
          destinationCounts[destId] = {
            id: destId,
            name: destName,
            bookings: 0,
          };
        }

        destinationCounts[destId].bookings++;
      }
    });

    // Convert to array and sort by booking count
    const popularDestinations = Object.values(destinationCounts)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10); // Top 10 destinations

    res.status(200).json(popularDestinations);
  } catch (error) {
    console.error("Popular destinations error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching popular destinations" });
  }
});

// Get user statistics
router.get("/analytics/users", adminAuth, async (req, res) => {
  try {
    // Count users by role
    const regularUsers = await User.countDocuments({ role: "user" });
    const tourGuides = await User.countDocuments({ role: "tourGuide" });
    const pendingTourGuides = await User.countDocuments({
      role: "pendingTourGuide",
    });
    const admins = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      regularUsers,
      tourGuides,
      pendingTourGuides,
      admins,
      total: regularUsers + tourGuides + pendingTourGuides + admins,
    });
  } catch (error) {
    console.error("User statistics error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user statistics" });
  }
});

// Get pending tour guide applications
router.get("/pending-tour-guides", adminAuth, async (req, res) => {
  try {
    const pendingTourGuides = await TourGuide.find({ status: "pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingTourGuides);
  } catch (error) {
    console.error("Pending tour guides error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching pending tour guides" });
  }
});

// Approve or reject tour guide application
router.put("/tour-guides/:id/status", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const tourGuide = await TourGuide.findById(id);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Update tour guide status
    tourGuide.status = status;

    if (status === "rejected" && rejectionReason) {
      tourGuide.rejectionReason = rejectionReason;
    }

    await tourGuide.save();

    // Update user role if approved
    if (status === "approved") {
      await User.findByIdAndUpdate(tourGuide.user, { role: "tourGuide" });
    }

    // Send notification to user if Socket.IO is available
    if (req.io) {
      req.io.to(tourGuide.user.toString()).emit("tour_guide_update", {
        status,
        rejectionReason: status === "rejected" ? rejectionReason : null,
      });
    }

    res.status(200).json({
      message: `Tour guide application ${status}`,
      tourGuide,
    });
  } catch (error) {
    console.error("Tour guide status update error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating tour guide status" });
  }
});

// Get pending vacation packages
router.get("/pending-packages", adminAuth, async (req, res) => {
  try {
    const pendingPackages = await VacationPackage.find({ status: "pending" })
      .populate("tourGuide", "name")
      .populate("destinations", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingPackages);
  } catch (error) {
    console.error("Pending packages error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching pending packages" });
  }
});

// Get all vacation packages (admin only)
router.get("/all-packages", adminAuth, async (req, res) => {
  try {
    console.log("Admin requesting all vacation packages");

    const packages = await VacationPackage.find()
      .populate("destinations", "name country")
      .populate("tourGuide", "name experience rating")
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    console.log(`Found ${packages.length} vacation packages`);
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching all packages for admin:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching all vacation packages" });
  }
});

// Approve or reject vacation package
router.put("/packages/:id/status", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const vacationPackage = await VacationPackage.findById(id).populate(
      "tourGuide",
      "user"
    );

    if (!vacationPackage) {
      return res.status(404).json({ message: "Vacation package not found" });
    }

    // Update package status
    vacationPackage.status = status;

    if (status === "rejected" && rejectionReason) {
      vacationPackage.rejectionReason = rejectionReason;
    }

    await vacationPackage.save();

    // Send notification to tour guide if Socket.IO is available
    if (req.io && vacationPackage.tourGuide && vacationPackage.tourGuide.user) {
      req.io
        .to(vacationPackage.tourGuide.user.toString())
        .emit("package_update", {
          id: vacationPackage._id,
          name: vacationPackage.name,
          status,
          rejectionReason: status === "rejected" ? rejectionReason : null,
        });
    }

    res.status(200).json({
      message: `Vacation package ${status}`,
      vacationPackage,
    });
  } catch (error) {
    console.error("Vacation package status update error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating vacation package status" });
  }
});

export default router;
