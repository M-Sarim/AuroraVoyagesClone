/**
 * Weather Cache Utility
 *
 * This module provides caching functionality for weather data to reduce API calls
 * and handle rate limiting from the AccuWeather API.
 */

// In-memory cache object
const cache = {
  locations: {}, // Cache for location keys: { cityName: { key, timestamp, data } }
  current: {}, // Cache for current conditions: { locationKey: { timestamp, data } }
  forecast: {}, // Cache for forecasts: { locationKey: { timestamp, data } }
  hourly: {}, // Cache for hourly forecasts: { locationKey: { timestamp, data } }
  alerts: {}, // Cache for weather alerts: { locationKey: { timestamp, data } }
};

// Cache expiration times (in milliseconds)
const EXPIRATION = {
  LOCATION: 7 * 24 * 60 * 60 * 1000, // 7 days for location data
  CURRENT: 30 * 60 * 1000, // 30 minutes for current conditions
  FORECAST: 3 * 60 * 60 * 1000, // 3 hours for forecast
  HOURLY: 60 * 60 * 1000, // 1 hour for hourly forecast
  ALERTS: 60 * 60 * 1000, // 1 hour for alerts
};

/**
 * Get a location key from cache
 *
 * @param {string} cityName - The name of the city
 * @returns {string|null} - The location key if found and valid, null otherwise
 */
function getCachedLocationKey(cityName) {
  // Normalize city name for consistent caching
  const normalizedCityName = cityName.trim().toLowerCase();

  const cachedLocation = cache.locations[normalizedCityName];

  // Check if we have a cached location and if it's still valid
  if (
    cachedLocation &&
    Date.now() - cachedLocation.timestamp < EXPIRATION.LOCATION
  ) {
    console.log(`Using cached location key for ${cityName}`);
    return cachedLocation.key;
  }

  return null;
}

/**
 * Store a location key in cache
 *
 * @param {string} cityName - The name of the city
 * @param {string} locationKey - The AccuWeather location key
 * @param {Object} locationData - Additional location data to cache
 */
function cacheLocationKey(cityName, locationKey, locationData = {}) {
  // Normalize city name for consistent caching
  const normalizedCityName = cityName.trim().toLowerCase();

  cache.locations[normalizedCityName] = {
    key: locationKey,
    timestamp: Date.now(),
    data: locationData,
  };

  console.log(`Cached location key for ${cityName}: ${locationKey}`);
}

/**
 * Get cached weather data
 *
 * @param {string} type - The type of weather data ('current', 'forecast', or 'hourly')
 * @param {string} locationKey - The AccuWeather location key
 * @param {boolean} ignoreExpiration - If true, return cached data even if expired
 * @returns {Object|null} - The cached data if found and valid, null otherwise
 */
function getCachedWeatherData(type, locationKey, ignoreExpiration = false) {
  if (!cache[type] || !cache[type][locationKey]) {
    return null;
  }

  const cachedData = cache[type][locationKey];

  // If we're ignoring expiration, return the data regardless of age
  if (ignoreExpiration) {
    console.log(
      `Using stale cached ${type} data for location key ${locationKey}`
    );
    return cachedData.data;
  }

  const expiration = EXPIRATION[type.toUpperCase()];

  // Check if the cached data is still valid
  if (Date.now() - cachedData.timestamp < expiration) {
    console.log(`Using cached ${type} data for location key ${locationKey}`);
    return cachedData.data;
  }

  return null;
}

/**
 * Store weather data in cache
 *
 * @param {string} type - The type of weather data ('current', 'forecast', or 'hourly')
 * @param {string} locationKey - The AccuWeather location key
 * @param {Object} data - The weather data to cache
 */
function cacheWeatherData(type, locationKey, data) {
  if (!cache[type]) {
    return;
  }

  cache[type][locationKey] = {
    timestamp: Date.now(),
    data: data,
  };

  console.log(`Cached ${type} data for location key ${locationKey}`);
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache() {
  const now = Date.now();

  // Clear expired location cache
  Object.keys(cache.locations).forEach((cityName) => {
    if (now - cache.locations[cityName].timestamp > EXPIRATION.LOCATION) {
      delete cache.locations[cityName];
    }
  });

  // Clear expired current conditions cache
  Object.keys(cache.current).forEach((key) => {
    if (now - cache.current[key].timestamp > EXPIRATION.CURRENT) {
      delete cache.current[key];
    }
  });

  // Clear expired forecast cache
  Object.keys(cache.forecast).forEach((key) => {
    if (now - cache.forecast[key].timestamp > EXPIRATION.FORECAST) {
      delete cache.forecast[key];
    }
  });

  // Clear expired hourly forecast cache
  Object.keys(cache.hourly).forEach((key) => {
    if (now - cache.hourly[key].timestamp > EXPIRATION.HOURLY) {
      delete cache.hourly[key];
    }
  });

  // Clear expired alerts cache
  Object.keys(cache.alerts).forEach((key) => {
    if (now - cache.alerts[key].timestamp > EXPIRATION.ALERTS) {
      delete cache.alerts[key];
    }
  });

  console.log("Cleared expired cache entries");
}

// Run cache cleanup every hour
setInterval(clearExpiredCache, 60 * 60 * 1000);

export {
  getCachedLocationKey,
  cacheLocationKey,
  getCachedWeatherData,
  cacheWeatherData,
  clearExpiredCache,
};
