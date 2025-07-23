import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["flight", "bus", "car_rental", "shuttle", "train"],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  provider: String,
  origin: String,
  destination: String,
  departureTime: Date,
  arrivalTime: Date,
  price: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transport = mongoose.model("Transport", transportSchema);

export default Transport;
