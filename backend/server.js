import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { initializeSocket } from "./socket.js";
import multer from "multer";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import destinationRoutes from "./routes/destinations.js";
import vacationRoutes from "./routes/vacations.js";
import transportRoutes from "./routes/transport.js";
import bookingRoutes from "./routes/bookings.js";
import tourGuideRoutes from "./routes/tourGuides.js";
import companyRoutes from "./routes/companies.js";
import uploadRoutes from "./routes/uploads.js";
import paymentRoutes from "./routes/payments.js";
import weatherRoutes from "./routes/weather.js";
import adminRoutes from "./routes/admin.js";
import notificationRoutes from "./routes/notifications.js";
import mapRoutes from "./routes/maps.js";
import itineraryRoutes from "./routes/itineraries.js";
import travelRequirementRoutes from "./routes/travelRequirements.js";
import forumRoutes from "./routes/forum.js";
import culturalInfoRoutes from "./routes/culturalInfo.js";

// Load environment variables
dotenv.config();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-auth-token"],
  })
);

app.use(express.json()); // Make sure this is before any routes

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  if (req.method !== "GET") {
    console.log("Body:", req.body);
  }
  next();
});

// Serve static files from the frontend public directory
app.use(
  "/images",
  express.static(path.join(__dirname, "../frontend/public/images"))
);

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../frontend/public/uploads"))
);

// Log all static file requests for debugging
app.use(["/images", "/uploads"], (req, res, next) => {
  console.log(`Static file requested: ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // Add connection options if needed
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    console.log("Database connection established successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Exit process with failure if database connection fails
    process.exit(1);
  });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/vacations", vacationRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tour-guides", tourGuideRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/travel-requirements", travelRequirementRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/cultural-info", culturalInfoRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Travel Tourism API is running");
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../frontend/public/uploads");
import fs from "fs";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created");
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO initialized`);
});
