import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.facebookId; // Password is required only if not using OAuth
    },
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  facebookId: {
    type: String,
    sparse: true,
    unique: true,
  },
  picture: String,
  authProvider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  language: {
    type: String,
    enum: ["english", "spanish", "french", "german", "chinese", "japanese"],
    default: "english",
  },
  role: {
    type: String,
    enum: ["user", "admin", "tourGuide", "pendingTourGuide"],
    default: "user",
  },
  tourGuideProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
  },
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Skip hashing if password is not modified or if using OAuth (no password)
  if (!this.isModified("password") || this.googleId || this.facebookId)
    return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // If this is an OAuth user and no password exists, return false
    if ((this.googleId || this.facebookId) && !this.password) {
      console.log("OAuth user with no password, returning false");
      return false;
    }

    console.log("Comparing passwords:");
    console.log("- Candidate password:", candidatePassword);
    console.log("- Stored password hash:", this.password);

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("- Password match result:", isMatch);

    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
