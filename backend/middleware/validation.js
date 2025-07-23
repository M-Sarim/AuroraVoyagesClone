// Validation middleware for signup
export const validateSignup = (req, res, next) => {
  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { name, email, password, confirmPassword } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // Check if passwords match
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  next();
};

// Validation middleware for login
export const validateLogin = (req, res, next) => {
  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  next();
};
