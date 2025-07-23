import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
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
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  website: String,
  description: String,
  logo: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  tourGuides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
    },
  ],
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

const Company = mongoose.model("Company", companySchema);

export default Company;
