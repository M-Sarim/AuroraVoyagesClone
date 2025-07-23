import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },
  activities: [String],
  accommodation: String,
  transportation: String,
  notes: String,
});

const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  items: [itineraryItemSchema],
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
itinerarySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
