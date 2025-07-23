import jwt from "jsonwebtoken";

// Authentication middleware
export const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin authentication middleware
export const adminAuth = (req, res, next) => {
  console.log('Admin auth middleware called');
  console.log('Request path:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  console.log('Token received:', token.substring(0, 20) + '...');

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);

    // Check if user is admin
    if (decoded.role !== "admin") {
      console.log(`Access denied: User role is ${decoded.role}, not admin`);
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    console.log('Admin authentication successful for user:', decoded.id);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    console.error('JWT Secret first 5 chars:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) + '...' : 'undefined');
    console.error('Token first 20 chars:', token.substring(0, 20) + '...');

    res.status(401).json({ message: "Token is not valid" });
  }
};

// Tour guide authentication middleware
export const tourGuideAuth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is tour guide or admin
    if (decoded.role !== "tourGuide" && decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied, tour guide only" });
    }

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin or tour guide authentication middleware
export const adminOrTourGuideAuth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin or tour guide
    if (decoded.role !== "admin" && decoded.role !== "tourGuide") {
      return res.status(403).json({ message: "Access denied, admin or tour guide only" });
    }

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
