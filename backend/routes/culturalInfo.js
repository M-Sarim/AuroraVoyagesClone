import express from "express";
import CulturalInfo from "../models/CulturalInfo.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { createNotification } from "./notifications.js";
import { notifyCulturalInfoUpdate } from "../utils/notificationHelpers.js";

const router = express.Router();

// Get all cultural info (with optional filtering)
router.get("/", async (req, res) => {
  try {
    const { destination, category, importance } = req.query;

    // Build filter object
    const filter = {};
    if (destination) filter.destination = destination;
    if (category) filter.category = category;
    if (importance) filter.importance = importance;

    const culturalInfo = await CulturalInfo.find(filter)
      .populate("destination", "name country")
      .sort({ createdAt: -1 });

    res.status(200).json(culturalInfo);
  } catch (error) {
    console.error("Get cultural info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cultural info by ID
router.get("/:id", async (req, res) => {
  try {
    const culturalInfo = await CulturalInfo.findById(req.params.id)
      .populate("destination", "name country description images");

    if (!culturalInfo) {
      return res.status(404).json({ message: "Cultural information not found" });
    }

    res.status(200).json(culturalInfo);
  } catch (error) {
    console.error("Get cultural info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all cultural info for a specific destination
router.get("/destination/:destinationId", async (req, res) => {
  try {
    const culturalInfo = await CulturalInfo.find({
      destination: req.params.destinationId,
    }).sort({ importance: 1, createdAt: -1 });

    res.status(200).json(culturalInfo);
  } catch (error) {
    console.error("Get destination cultural info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new cultural info (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      destination,
      title,
      description,
      category,
      importance,
      seasonalRelevance,
      mediaUrls,
      sources,
    } = req.body;

    const culturalInfo = new CulturalInfo({
      destination,
      title,
      description,
      category,
      importance,
      seasonalRelevance,
      mediaUrls,
      sources,
    });

    await culturalInfo.save();

    // Populate destination data for the response
    const populatedInfo = await CulturalInfo.findById(culturalInfo._id)
      .populate("destination", "name country");

    // Send notifications to relevant users
    try {
      await notifyCulturalInfoUpdate(req.io, populatedInfo, "added");
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Continue with the response even if notifications fail
    }

    res.status(201).json(populatedInfo);
  } catch (error) {
    console.error("Create cultural info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update cultural info (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      importance,
      seasonalRelevance,
      mediaUrls,
      sources,
    } = req.body;

    const culturalInfo = await CulturalInfo.findById(req.params.id);

    if (!culturalInfo) {
      return res.status(404).json({ message: "Cultural information not found" });
    }

    // Update fields
    culturalInfo.title = title || culturalInfo.title;
    culturalInfo.description = description || culturalInfo.description;
    culturalInfo.category = category || culturalInfo.category;
    culturalInfo.importance = importance || culturalInfo.importance;
    culturalInfo.seasonalRelevance = seasonalRelevance || culturalInfo.seasonalRelevance;
    culturalInfo.mediaUrls = mediaUrls || culturalInfo.mediaUrls;
    culturalInfo.sources = sources || culturalInfo.sources;
    culturalInfo.updatedAt = Date.now();

    await culturalInfo.save();

    // Populate destination data for the response
    const populatedInfo = await CulturalInfo.findById(culturalInfo._id)
      .populate("destination", "name country");

    // Send notifications to relevant users
    try {
      await notifyCulturalInfoUpdate(req.io, populatedInfo, "updated");
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Continue with the response even if notifications fail
    }

    res.status(200).json(populatedInfo);
  } catch (error) {
    console.error("Update cultural info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete cultural info (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const culturalInfo = await CulturalInfo.findById(req.params.id);

    if (!culturalInfo) {
      return res.status(404).json({ message: "Cultural information not found" });
    }

    await culturalInfo.remove();

    res.status(200).json({ message: "Cultural information deleted" });
  } catch (error) {
    console.error("Delete cultural info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
