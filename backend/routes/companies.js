import express from "express";
import Company from "../models/Company.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all companies
router.get("/", async (req, res) => {
  try {
    const { country, minRating } = req.query;

    // Build filter object
    const filter = {};
    if (country) filter["address.country"] = country;
    if (minRating) filter.rating = { $gte: minRating };

    const companies = await Company.find(filter)
      .populate("tourGuides", "name email rating")
      .populate("vacationPackages", "name price duration");

    res.status(200).json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("tourGuides", "name email rating specialties languages")
      .populate("vacationPackages", "name price duration destinations");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create company (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, email, phone, address, website, description, logo } =
      req.body;

    // Check if email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const company = new Company({
      name,
      email,
      phone,
      address,
      website,
      description,
      logo,
    });

    await company.save();

    res.status(201).json(company);
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update company (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Update company error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete company (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update company rating
router.patch("/:id/rating", async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { rating } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
