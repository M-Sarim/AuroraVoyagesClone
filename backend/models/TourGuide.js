import mongoose from "mongoose";

const tourGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  languages: [String],
  specialties: [String],
  experience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: String,
  image: String,
  bio: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  vacationPackages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VacationPackage",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

export default TourGuide;
