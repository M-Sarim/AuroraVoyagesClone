import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Log API calls for debugging
const logApiCall = (method, url, data = null) => {
  console.log(`API ${method}:`, url);
  if (data) {
    console.log("Request data:", data);
  }
};

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Log the request
    logApiCall(config.method.toUpperCase(), config.url, config.data);

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
      console.log("Token added to request:", token.substring(0, 15) + "...");
    } else {
      console.warn("No token found in localStorage");
    }

    // Set a timeout for requests
    config.timeout = 15000; // 15 seconds timeout

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log("API Response:", response.status, response.config.url);
    console.log("Response data:", response.data);
    return response;
  },
  (error) => {
    // Log error response
    console.error("API Error:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
      console.error("Request URL:", error.config.url);
      console.error("Request method:", error.config.method);

      // Handle session expiration
      if (error.response.status === 401) {
        console.log("Unauthorized access, redirecting to login");
        localStorage.removeItem("token");
        // Don't redirect automatically to avoid infinite loops
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      console.error("Request URL:", error.config?.url);
      console.error("Request method:", error.config?.method);
      console.error("Request timeout:", error.code === "ECONNABORTED");

      // If it's a timeout error, provide a more specific message
      if (error.code === "ECONNABORTED") {
        error.message =
          "Request timed out. The server might be down or unreachable.";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
