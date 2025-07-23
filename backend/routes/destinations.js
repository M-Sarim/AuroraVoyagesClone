import express from "express";
import Destination from "../models/Destination.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all destinations
router.get("/", async (req, res) => {
  try {
    const { country, type, popularity } = req.query;

    // Build filter object
    const filter = {};
    if (country) filter.country = country;
    if (type) filter.type = type;

    // Get destinations with filters
    const destinations = await Destination.find(filter);

    // Sort by popularity if requested
    if (popularity === "desc") {
      destinations.sort((a, b) => b.popularity - a.popularity);
    } else if (popularity === "asc") {
      destinations.sort((a, b) => a.popularity - b.popularity);
    }

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Get destinations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get destination by ID
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error("Get destination error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create destination (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      name,
      country,
      description,
      images,
      attractions,
      bestVisitingMonths,
      culturalTips,
      type,
    } = req.body;

    // Create new destination
    const destination = new Destination({
      name,
      country,
      description,
      images,
      attractions,
      bestVisitingMonths,
      culturalTips,
      type,
    });

    await destination.save();

    res.status(201).json(destination);
  } catch (error) {
    console.error("Create destination error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update destination (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error("Update destination error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete destination (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Delete destination error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
