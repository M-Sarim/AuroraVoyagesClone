import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vacationPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VacationPackage",
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
  },
  transport: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  tourGuideApproval: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: null,
    }
  },
  cancellationReason: {
    type: String,
    default: "",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  travelerInfo: [
    {
      name: String,
      email: String,
      phone: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
