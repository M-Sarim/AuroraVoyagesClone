import mongoose from "mongoose";

const travelRequirementSchema = new mongoose.Schema({
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["permit", "visa", "vaccination", "document", "equipment", "other"],
    required: true,
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
  applicationProcess: String,
  applicationUrl: String,
  cost: {
    amount: Number,
    currency: {
      type: String,
      default: "PKR",
    },
  },
  processingTime: String,
  validityPeriod: String,
  seasonalRestrictions: [String],
  notes: String,
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
travelRequirementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const TravelRequirement = mongoose.model(
  "TravelRequirement",
  travelRequirementSchema
);

export default TravelRequirement;
