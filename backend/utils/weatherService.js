/**
 * Weather Service - AccuWeather API Integration
 *
 * This module provides utility functions for interacting with the AccuWeather API.
 * It handles location search, current conditions, forecasts, and other weather data.
 * Includes caching to reduce API calls and handle rate limiting.
 */

import dotenv from "dotenv";
import {
  getCachedLocationKey,
  cacheLocationKey,
  getCachedWeatherData,
  cacheWeatherData,
} from "./weatherCache.js";

// Load environment variables
dotenv.config();

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const BASE_URL = "https://dataservice.accuweather.com";

/**
 * Helper function for making GET requests to the AccuWeather API
 *
 * @param {string} path - The API endpoint path
 * @param {object} params - Query parameters to include in the request
 * @returns {Promise<object>} - The JSON response from the API
 * @throws {Error} - If the request fails
 */
async function accuFetch(path, params = {}) {
  // Build query string with API key
  const url = new URL(`${BASE_URL}${path}`);
  url.search = new URLSearchParams({ apikey: ACCUWEATHER_API_KEY, ...params });

  // Make the request
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AccuWeather API error: ${res.status} ${err}`);
  }
  return res.json();
}

/**
 * Get the Location Key for a given city name
 *
 * @param {string} cityName - The name of the city (e.g., 'Karachi', 'New York', 'London')
 * @returns {Promise<string>} - The AccuWeather location key
 * @throws {Error} - If the location is not found
 */
async function getLocationKey(cityName) {
  // Try to get the location key from cache first
  const cachedKey = getCachedLocationKey(cityName);
  if (cachedKey) {
    return cachedKey;
  }

  // If not in cache, fetch from API
  try {
    const results = await accuFetch("/locations/v1/cities/search", {
      q: cityName,
      language: "en-us",
    });

    if (results.length === 0) {
      throw new Error(`No location found for "${cityName}"`);
    }

    // Cache the location key for future use
    const locationKey = results[0].Key;
    cacheLocationKey(cityName, locationKey, results[0]);

    // Return the first match's key
    return locationKey;
  } catch (error) {
    // If we hit a rate limit, throw a more specific error
    if (error.message.includes("exceeded")) {
      throw new Error(
        `Rate limit exceeded for AccuWeather API. Please try again later.`
      );
    }
    throw error;
  }
}

/**
 * Get the current weather conditions for a Location Key
 *
 * @param {string} locationKey - The AccuWeather location key
 * @returns {Promise<object>} - The current weather conditions
 * @throws {Error} - If the weather data is not found
 */
async function getCurrentConditions(locationKey) {
  // Try to get current conditions from cache first
  const cachedData = getCachedWeatherData("current", locationKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  try {
    const data = await accuFetch(`/currentconditions/v1/${locationKey}`, {
      details: true,
    });

    // Data is an array; index 0 holds the current conditions
    if (!data || data.length === 0) {
      throw new Error(
        `No weather data found for location key "${locationKey}"`
      );
    }

    // Cache the current conditions for future use
    const currentConditions = data[0];
    cacheWeatherData("current", locationKey, currentConditions);

    return currentConditions;
  } catch (error) {
    // If we hit a rate limit, try to return stale cache data if available
    if (error.message.includes("exceeded")) {
      // For rate limit errors, we'll try to get any cached data regardless of age
      const staleData = getCachedWeatherData("current", locationKey, true);
      if (staleData) {
        console.log(
          `Using stale cache data for current conditions due to rate limiting`
        );
        return staleData;
      }
      throw new Error(
        `Rate limit exceeded for AccuWeather API. Please try again later.`
      );
    }
    throw error;
  }
}

/**
 * Get the 5-day forecast for a Location Key
 *
 * @param {string} locationKey - The AccuWeather location key
 * @param {boolean} metric - Whether to use metric units (default: true)
 * @returns {Promise<object>} - The 5-day forecast
 */
async function getForecast(locationKey, metric = true) {
  // Try to get forecast from cache first
  const cachedData = getCachedWeatherData("forecast", locationKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  try {
    const forecastData = await accuFetch(
      `/forecasts/v1/daily/5day/${locationKey}`,
      {
        metric: metric,
        details: true,
      }
    );

    // Cache the forecast for future use
    cacheWeatherData("forecast", locationKey, forecastData);

    return forecastData;
  } catch (error) {
    // If we hit a rate limit, try to return stale cache data if available
    if (error.message.includes("exceeded")) {
      // For rate limit errors, we'll try to get any cached data regardless of age
      const staleData = getCachedWeatherData("forecast", locationKey, true);
      if (staleData) {
        console.log(`Using stale cache data for forecast due to rate limiting`);
        return staleData;
      }
      throw new Error(
        `Rate limit exceeded for AccuWeather API. Please try again later.`
      );
    }
    throw error;
  }
}

/**
 * Get the hourly forecast for a Location Key
 *
 * @param {string} locationKey - The AccuWeather location key
 * @param {number} hours - Number of hours (1, 12, or 24)
 * @param {boolean} metric - Whether to use metric units (default: true)
 * @returns {Promise<Array>} - The hourly forecast
 */
async function getHourlyForecast(locationKey, hours = 12, metric = true) {
  // Validate hours parameter (AccuWeather supports 1, 12, or 24 hours)
  let validHours = 12;
  if (hours == 1 || hours == 24) {
    validHours = hours;
  }

  // Try to get hourly forecast from cache first
  const cachedData = getCachedWeatherData("hourly", locationKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  try {
    const hourlyData = await accuFetch(
      `/forecasts/v1/hourly/${validHours}hour/${locationKey}`,
      {
        metric: metric,
      }
    );

    // Cache the hourly forecast for future use
    cacheWeatherData("hourly", locationKey, hourlyData);

    return hourlyData;
  } catch (error) {
    // If we hit a rate limit, try to return stale cache data if available
    if (error.message.includes("exceeded")) {
      // For rate limit errors, we'll try to get any cached data regardless of age
      const staleData = getCachedWeatherData("hourly", locationKey, true);
      if (staleData) {
        console.log(
          `Using stale cache data for hourly forecast due to rate limiting`
        );
        return staleData;
      }
      throw new Error(
        `Rate limit exceeded for AccuWeather API. Please try again later.`
      );
    }
    throw error;
  }
}

/**
 * Get weather alerts for a Location Key
 *
 * @param {string} locationKey - The AccuWeather location key
 * @returns {Promise<Array>} - The weather alerts
 */
async function getWeatherAlerts(locationKey) {
  // Try to get alerts from cache first
  const cachedData = getCachedWeatherData("alerts", locationKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  try {
    const alertsData = await accuFetch(`/alerts/v1/${locationKey}`);

    // Cache the alerts for future use
    cacheWeatherData("alerts", locationKey, alertsData);

    return alertsData;
  } catch (error) {
    // If we hit a rate limit, try to return stale cache data if available
    if (error.message.includes("exceeded")) {
      // For rate limit errors, we'll try to get any cached data regardless of age
      const staleData = getCachedWeatherData("alerts", locationKey, true);
      if (staleData) {
        console.log(`Using stale cache data for alerts due to rate limiting`);
        return staleData;
      }
      throw new Error(
        `Rate limit exceeded for AccuWeather API. Please try again later.`
      );
    }
    throw error;
  }
}

/**
 * Get complete weather data for a city
 *
 * @param {string} city - The name of the city
 * @returns {Promise<object>} - Object containing current conditions, forecast, and hourly forecast
 */
async function getCompleteWeatherData(city) {
  try {
    const key = await getLocationKey(city);
    const current = await getCurrentConditions(key);
    const forecast = await getForecast(key);
    const hourly = await getHourlyForecast(key);

    return {
      locationKey: key,
      current,
      forecast,
      hourly,
    };
  } catch (err) {
    console.error(`Error getting weather data for ${city}:`, err);
    throw err;
  }
}

export {
  getLocationKey,
  getCurrentConditions,
  getForecast,
  getHourlyForecast,
  getWeatherAlerts,
  getCompleteWeatherData,
};
