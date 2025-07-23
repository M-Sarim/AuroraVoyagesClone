import { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token is handled by the api interceptor in utils/api.js

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me");

          // Log user data for debugging
          console.log("Loaded user data:", res.data);
          console.log("User profile picture:", res.data.picture);

          // Ensure the picture URL is properly formatted
          if (res.data.picture && !res.data.picture.startsWith("http")) {
            // If it's a relative URL, make sure it's properly formatted
            if (!res.data.picture.startsWith("/")) {
              res.data.picture = "/" + res.data.picture;
              console.log("Formatted picture URL:", res.data.picture);
            }
          }

          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Error loading user:", err);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError(err.response?.data?.message || "Authentication error");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      // Check if this is a tour guide registration
      const isTourGuide = formData.isTourGuide;

      // Remove isTourGuide flag from the data to be sent
      const { isTourGuide: _, ...userData } = formData;

      // If it's a tour guide registration, use the tour guide signup endpoint
      let endpoint = "/auth/signup";
      if (isTourGuide) {
        endpoint = "/auth/signup/tour-guide";
      }

      console.log(`Registering user with endpoint: ${endpoint}`);
      const res = await api.post(endpoint, userData);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      console.log("AuthContext: Attempting login with:", formData.email);

      // Special handling for admin and tour guides
      let endpoint = "/auth/login";
      let requestData = formData;

      // If it's an admin login, use the admin endpoint
      if (formData.email === "admin@auroravoyages.com") {
        console.log("AuthContext: Using admin login endpoint");
        endpoint = "/auth/admin/login";
        requestData = {
          username: formData.email,
          password: formData.password,
        };
      }

      console.log(`AuthContext: Sending request to ${endpoint}`, requestData);
      const res = await api.post(endpoint, requestData);

      console.log("AuthContext: Login response:", res.data);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        console.log("AuthContext: Login successful, user set:", res.data.user);

        // Force a page reload to ensure all components recognize the authentication state
        // window.location.reload();

        return res.data;
      } else {
        console.error("AuthContext: Login response missing token");
        setError("Login failed: Invalid server response");
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.error("AuthContext: Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Register as tour guide
  const registerAsTourGuide = async (formData) => {
    try {
      const res = await api.post("/tour-guides/register", formData);
      // Update user data with tour guide info and pending status
      setUser({
        ...user,
        role: "pendingTourGuide",
        tourGuideProfile: res.data.tourGuide._id,
      });
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Tour guide registration failed");
      throw err;
    }
  };

  // Google login
  const googleLogin = async (credentialResponse) => {
    try {
      // Extract the necessary data from the credential response
      const { credential } = credentialResponse;

      // Send the token to the backend for verification
      const res = await api.post("/auth/google", { credential });

      // Log the response to help with debugging
      console.log("Google login response:", res.data);
      console.log("User data from Google login:", res.data.user);
      console.log("Profile picture from Google:", res.data.user.picture);

      // Store the token and user data
      localStorage.setItem("token", res.data.token);

      // Make sure we have the user data with picture
      const userData = res.data.user;

      // Set the state
      setToken(res.data.token);
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);

      return res.data;
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.message || "Google login failed");
      throw err;
    }
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send password reset email"
      );
      throw err;
    }
  };

  // Reset password with token
  const resetPassword = async (token, email, password) => {
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        email,
        password,
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    }
  };

  // Verify reset token
  const verifyResetToken = async (token, email) => {
    try {
      const res = await api.post("/auth/verify-reset-token", { token, email });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset token");
      throw err;
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  // Update user data in state after profile changes
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        login,
        googleLogin,
        logout,
        registerAsTourGuide,
        forgotPassword,
        resetPassword,
        verifyResetToken,
        clearError,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
