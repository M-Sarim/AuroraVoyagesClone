import mongoose from "mongoose";

const culturalInfoSchema = new mongoose.Schema({
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["customs", "etiquette", "religion", "language", "traditions", "food", "dress", "taboos", "other"],
    required: true,
  },
  importance: {
    type: String,
    enum: ["essential", "recommended", "good-to-know"],
    default: "good-to-know",
  },
  seasonalRelevance: [String],
  mediaUrls: [String],
  sources: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update the updatedAt field
culturalInfoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CulturalInfo = mongoose.model("CulturalInfo", culturalInfoSchema);

export default CulturalInfo;
