import express from "express";
import TravelRequirement from "../models/TravelRequirement.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { notifyTravelRequirementUpdate } from "../utils/notificationHelpers.js";

const router = express.Router();

// Get all travel requirements
router.get("/", async (req, res) => {
  try {
    const { destination, type } = req.query;

    // Build filter object
    const filter = {};
    if (destination) filter.destination = destination;
    if (type) filter.type = type;

    const requirements = await TravelRequirement.find(filter)
      .populate("destination", "name country")
      .sort({ destination: 1, type: 1 });

    res.status(200).json(requirements);
  } catch (error) {
    console.error("Get travel requirements error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get travel requirements for a specific destination
router.get("/destination/:destinationId", async (req, res) => {
  try {
    const requirements = await TravelRequirement.find({
      destination: req.params.destinationId
    }).populate("destination", "name country");

    res.status(200).json(requirements);
  } catch (error) {
    console.error("Get destination requirements error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific travel requirement by ID
router.get("/:id", async (req, res) => {
  try {
    const requirement = await TravelRequirement.findById(req.params.id)
      .populate("destination", "name country");

    if (!requirement) {
      return res.status(404).json({ message: "Travel requirement not found" });
    }

    res.status(200).json(requirement);
  } catch (error) {
    console.error("Get travel requirement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new travel requirement (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      destination,
      name,
      description,
      type,
      isRequired,
      applicationProcess,
      applicationUrl,
      cost,
      processingTime,
      validityPeriod,
      seasonalRestrictions,
      notes
    } = req.body;

    const requirement = new TravelRequirement({
      destination,
      name,
      description,
      type,
      isRequired,
      applicationProcess,
      applicationUrl,
      cost,
      processingTime,
      validityPeriod,
      seasonalRestrictions,
      notes
    });

    await requirement.save();

    // Populate destination data for the response
    const populatedRequirement = await TravelRequirement.findById(requirement._id)
      .populate("destination", "name country");

    // Send notifications to relevant users
    try {
      await notifyTravelRequirementUpdate(req.io, populatedRequirement, "added");
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Continue with the response even if notifications fail
    }

    res.status(201).json(populatedRequirement);
  } catch (error) {
    console.error("Create travel requirement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a travel requirement (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      destination,
      name,
      description,
      type,
      isRequired,
      applicationProcess,
      applicationUrl,
      cost,
      processingTime,
      validityPeriod,
      seasonalRestrictions,
      notes
    } = req.body;

    // Find the requirement
    let requirement = await TravelRequirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ message: "Travel requirement not found" });
    }

    // Update the requirement
    requirement.destination = destination || requirement.destination;
    requirement.name = name || requirement.name;
    requirement.description = description || requirement.description;
    requirement.type = type || requirement.type;
    requirement.isRequired = isRequired !== undefined ? isRequired : requirement.isRequired;
    requirement.applicationProcess = applicationProcess || requirement.applicationProcess;
    requirement.applicationUrl = applicationUrl || requirement.applicationUrl;
    requirement.cost = cost || requirement.cost;
    requirement.processingTime = processingTime || requirement.processingTime;
    requirement.validityPeriod = validityPeriod || requirement.validityPeriod;
    requirement.seasonalRestrictions = seasonalRestrictions || requirement.seasonalRestrictions;
    requirement.notes = notes || requirement.notes;
    requirement.updatedAt = Date.now();

    await requirement.save();

    // Populate destination data for the response
    const populatedRequirement = await TravelRequirement.findById(requirement._id)
      .populate("destination", "name country");

    // Send notifications to relevant users
    try {
      await notifyTravelRequirementUpdate(req.io, populatedRequirement, "updated");
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
      // Continue with the response even if notifications fail
    }

    res.status(200).json(populatedRequirement);
  } catch (error) {
    console.error("Update travel requirement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a travel requirement (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const requirement = await TravelRequirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ message: "Travel requirement not found" });
    }

    await requirement.deleteOne();

    res.status(200).json({ message: "Travel requirement removed" });
  } catch (error) {
    console.error("Delete travel requirement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
