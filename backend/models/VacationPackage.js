import mongoose from "mongoose";

const vacationPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  tourGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
  },
  destinations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  activities: [String],
  includedTransport: [String],
  includedHotels: [String],
  includedMeals: [String],
  schedule: [
    {
      day: Number,
      morning: String,
      afternoon: String,
      evening: String,
    },
  ],
  images: [String],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
    default: "",
  },
  submittedBy: {
    type: String,
    enum: ["admin", "tourGuide"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const VacationPackage = mongoose.model(
  "VacationPackage",
  vacationPackageSchema
);

export default VacationPackage;
