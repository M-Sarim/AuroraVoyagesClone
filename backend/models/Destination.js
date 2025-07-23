import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  attractions: [String],
  bestVisitingMonths: [String],
  culturalTips: [String],
  popularity: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: [
      "beach",
      "mountain",
      "city",
      "countryside",
      "historical",
      "adventure",
    ],
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  weatherLocationKey: {
    type: String,
    trim: true,
  },
  seasonalInfo: {
    winter: String,
    spring: String,
    summer: String,
    autumn: String,
  },
  howToGetThere: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
