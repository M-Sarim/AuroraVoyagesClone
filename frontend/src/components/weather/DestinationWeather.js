import React from "react";
import WeatherWidget from "./WeatherWidget";

/**
 * DestinationWeather component displays weather information for a specific destination
 *
 * @param {Object} props
 * @param {string} props.destinationName - The name of the destination (e.g., "Hunza, Pakistan")
 * @param {string} props.locationKey - Optional AccuWeather location key if already known
 */
const DestinationWeather = ({ destinationName, locationKey }) => {
  // If no destination name is provided, show a message
  if (!destinationName && !locationKey) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">No destination selected</p>
      </div>
    );
  }

  return (
    <div className="destination-weather">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Weather Information
      </h3>
      <WeatherWidget locationName={destinationName} locationKey={locationKey} />
      <div className="mt-2 text-xs text-gray-500">
        <p>Weather data is updated in real-time from AccuWeather.</p>
      </div>
    </div>
  );
};

export default DestinationWeather;
