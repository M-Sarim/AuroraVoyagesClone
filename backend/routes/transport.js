import express from "express";
import Transport from "../models/Transport.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all transport options
router.get("/", async (req, res) => {
  try {
    const { type, origin, destination, departureDate } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (origin) filter.origin = origin;
    if (destination) filter.destination = destination;

    // Filter by departure date if provided
    if (departureDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 1);

      filter.departureTime = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const transports = await Transport.find(filter);

    res.status(200).json(transports);
  } catch (error) {
    console.error("Get transports error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get transport by ID
router.get("/:id", async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    res.status(200).json(transport);
  } catch (error) {
    console.error("Get transport error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create transport (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      type,
      name,
      description,
      provider,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    } = req.body;

    // Create new transport
    const transport = new Transport({
      type,
      name,
      description,
      provider,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });

    await transport.save();

    res.status(201).json(transport);
  } catch (error) {
    console.error("Create transport error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update transport (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const transport = await Transport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    res.status(200).json(transport);
  } catch (error) {
    console.error("Update transport error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete transport (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    res.status(200).json({ message: "Transport deleted successfully" });
  } catch (error) {
    console.error("Delete transport error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
