import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import {
  getLocationKey,
  getCurrentConditions,
  getForecast,
  getHourlyForecast,
  getWeatherAlerts,
  getCompleteWeatherData,
} from "../utils/weatherService.js";

// Load environment variables
dotenv.config();

const router = express.Router();
const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const BASE_URL = "https://dataservice.accuweather.com";

// Test endpoint to verify API key
router.get("/test", async (req, res) => {
  try {
    // Check if API key is configured
    if (!ACCUWEATHER_API_KEY) {
      return res.status(500).json({
        message: "Weather API key is not configured",
        apiKeyConfigured: false,
      });
    }

    // Test the API key with a simple request
    const testResponse = await axios.get(
      `${BASE_URL}/locations/v1/cities/search`,
      {
        params: {
          apikey: ACCUWEATHER_API_KEY,
          q: "Islamabad",
        },
      }
    );

    // If we get here, the API key is valid
    res.status(200).json({
      message: "Weather API is working",
      apiKeyConfigured: true,
      apiKeyFirstChars: ACCUWEATHER_API_KEY.substring(0, 5) + "...",
      apiKeyValid: true,
    });
  } catch (error) {
    // Check if the error is due to an invalid API key
    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        message: "Weather API key is invalid or has expired",
        apiKeyConfigured: true,
        apiKeyValid: false,
        error: error.response.data,
      });
    }

    // Other errors
    res.status(500).json({
      message: "Error testing weather API",
      apiKeyConfigured: !!ACCUWEATHER_API_KEY,
      apiKeyFirstChars: ACCUWEATHER_API_KEY
        ? ACCUWEATHER_API_KEY.substring(0, 5) + "..."
        : "Not configured",
      error: error.message,
    });
  }
});

// Get location key by city name
router.get("/location", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "City name is required" });
    }

    try {
      // Use our utility function to get the location key
      const key = await getLocationKey(q);

      // Make a direct API call to get additional location details
      const response = await axios.get(
        `${BASE_URL}/locations/v1/cities/search`,
        {
          params: {
            apikey: ACCUWEATHER_API_KEY,
            q,
          },
        }
      );

      const location = response.data[0];

      res.status(200).json({
        key: key,
        name: location.LocalizedName,
        country: location.Country.LocalizedName,
        administrativeArea: location.AdministrativeArea.LocalizedName,
      });
    } catch (locationError) {
      console.error(`Location not found for "${q}":`, locationError);
      return res.status(404).json({ message: `Location not found for "${q}"` });
    }
  } catch (error) {
    console.error("Weather location error:", error);

    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      res.status(error.response.status).json({
        message: "Server error while fetching location data",
        error: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      res.status(500).json({
        message: "No response received from weather service",
        error: "Request timeout or network error",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
      res.status(500).json({
        message: "Server error while fetching location data",
        error: error.message,
      });
    }
  }
});

// Get current conditions by location key
router.get("/current/:locationKey", async (req, res) => {
  try {
    const { locationKey } = req.params;

    if (!locationKey) {
      return res.status(400).json({ message: "Location key is required" });
    }

    try {
      // Use our utility function to get current conditions
      const currentConditions = await getCurrentConditions(locationKey);
      res.status(200).json(currentConditions);
    } catch (error) {
      console.error(
        `Weather data not found for location key "${locationKey}":`,
        error
      );
      return res.status(404).json({ message: "Weather data not found" });
    }
  } catch (error) {
    console.error("Current weather error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching current weather data" });
  }
});

// Get 5-day forecast by location key
router.get("/forecast/:locationKey", async (req, res) => {
  try {
    const { locationKey } = req.params;
    const { metric = true } = req.query;

    if (!locationKey) {
      return res.status(400).json({ message: "Location key is required" });
    }

    try {
      // Use our utility function to get forecast
      const forecastData = await getForecast(
        locationKey,
        metric === "true" || metric === true
      );
      res.status(200).json(forecastData);
    } catch (error) {
      console.error(
        `Forecast data not found for location key "${locationKey}":`,
        error
      );
      return res.status(404).json({ message: "Forecast data not found" });
    }
  } catch (error) {
    console.error("Forecast error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching forecast data" });
  }
});

// Get hourly forecast by location key
router.get("/hourly/:locationKey", async (req, res) => {
  try {
    const { locationKey } = req.params;
    const { hours = 12 } = req.query;

    if (!locationKey) {
      return res.status(400).json({ message: "Location key is required" });
    }

    try {
      // Use our utility function to get hourly forecast
      const hourlyData = await getHourlyForecast(
        locationKey,
        hours,
        true // metric units
      );
      res.status(200).json(hourlyData);
    } catch (error) {
      console.error(
        `Hourly forecast data not found for location key "${locationKey}":`,
        error
      );
      return res
        .status(404)
        .json({ message: "Hourly forecast data not found" });
    }
  } catch (error) {
    console.error("Hourly forecast error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching hourly forecast data" });
  }
});

// Get weather alerts by location key
router.get("/alerts/:locationKey", async (req, res) => {
  try {
    const { locationKey } = req.params;

    if (!locationKey) {
      return res.status(400).json({ message: "Location key is required" });
    }

    try {
      // Use our utility function to get weather alerts
      const alertsData = await getWeatherAlerts(locationKey);
      res.status(200).json(alertsData);
    } catch (error) {
      console.error(
        `Weather alerts not found for location key "${locationKey}":`,
        error
      );
      return res.status(404).json({ message: "Weather alerts not found" });
    }
  } catch (error) {
    console.error("Weather alerts error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching weather alerts" });
  }
});

// Get complete weather data for a city in one call
router.get("/complete/:city", async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City name is required" });
    }

    try {
      // Use our utility function to get complete weather data
      const weatherData = await getCompleteWeatherData(city);
      res.status(200).json(weatherData);
    } catch (error) {
      console.error(`Weather data not found for city "${city}":`, error);
      return res.status(404).json({
        message: `Weather data not found for city "${city}"`,
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Complete weather data error:", error);
    res.status(500).json({
      message: "Server error while fetching complete weather data",
      error: error.message,
    });
  }
});

export default router;
