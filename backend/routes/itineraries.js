import express from "express";
import Itinerary from "../models/Itinerary.js";
import TravelRequirement from "../models/TravelRequirement.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all itineraries for the current user
router.get("/", auth, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id })
      .populate("items.destination", "name country images")
      .sort({ createdAt: -1 });

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Get itineraries error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific itinerary by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate("items.destination", "name country images location coordinates type")
      .populate("user", "name email");

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary belongs to the user or is public
    if (itinerary.user._id.toString() !== req.user.id && !itinerary.isPublic) {
      return res.status(403).json({ message: "Not authorized to view this itinerary" });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    console.error("Get itinerary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new itinerary
router.post("/", auth, async (req, res) => {
  try {
    const { name, startDate, endDate, items, isPublic } = req.body;

    const itinerary = new Itinerary({
      name,
      user: req.user.id,
      startDate,
      endDate,
      items,
      isPublic,
    });

    await itinerary.save();

    // Populate destination data for the response
    const populatedItinerary = await Itinerary.findById(itinerary._id)
      .populate("items.destination", "name country images");

    res.status(201).json(populatedItinerary);
  } catch (error) {
    console.error("Create itinerary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an itinerary
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, startDate, endDate, items, isPublic } = req.body;

    // Find the itinerary
    let itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary belongs to the user
    if (itinerary.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this itinerary" });
    }

    // Update the itinerary
    itinerary.name = name || itinerary.name;
    itinerary.startDate = startDate || itinerary.startDate;
    itinerary.endDate = endDate || itinerary.endDate;
    itinerary.items = items || itinerary.items;
    itinerary.isPublic = isPublic !== undefined ? isPublic : itinerary.isPublic;
    itinerary.updatedAt = Date.now();

    await itinerary.save();

    // Populate destination data for the response
    const populatedItinerary = await Itinerary.findById(itinerary._id)
      .populate("items.destination", "name country images");

    res.status(200).json(populatedItinerary);
  } catch (error) {
    console.error("Update itinerary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an itinerary
router.delete("/:id", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary belongs to the user
    if (itinerary.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this itinerary" });
    }

    await itinerary.deleteOne();

    res.status(200).json({ message: "Itinerary removed" });
  } catch (error) {
    console.error("Delete itinerary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check compliance for an itinerary
router.post("/check-compliance", auth, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid itinerary items" });
    }

    // Extract destination IDs from items
    const destinationIds = items.map(item => item.destination);
    
    // Find all requirements for these destinations
    const requirements = await TravelRequirement.find({
      destination: { $in: destinationIds }
    }).populate("destination", "name");

    // Group requirements by destination
    const requirementsByDestination = {};
    
    requirements.forEach(req => {
      const destId = req.destination._id.toString();
      if (!requirementsByDestination[destId]) {
        requirementsByDestination[destId] = {
          destination: req.destination,
          requirements: []
        };
      }
      requirementsByDestination[destId].requirements.push(req);
    });

    res.status(200).json({
      requirementsByDestination: Object.values(requirementsByDestination)
    });
  } catch (error) {
    console.error("Check compliance error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
