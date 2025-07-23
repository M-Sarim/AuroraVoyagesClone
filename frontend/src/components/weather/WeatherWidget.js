import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../utils/api";

const WeatherWidget = ({ locationKey, locationName }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, check if the weather API is working
        try {
          const testResponse = await api.get("/weather/test");
          console.log("Weather API test response:", testResponse.data);

          if (!testResponse.data.apiKeyConfigured) {
            throw new Error("AccuWeather API key is not configured");
          }
        } catch (testErr) {
          console.error("Weather API test error:", testErr);
          throw new Error("Weather service is not available");
        }

        // If we don't have a location key, we need to search for it first
        let key = locationKey;
        if (!key && locationName) {
          try {
            console.log("Fetching location key for:", locationName);
            // Use our backend API to get the location key
            const locationResponse = await api.get(
              `/weather/location?q=${locationName}`
            );
            console.log("Location response:", locationResponse.data);
            key = locationResponse.data.key;
          } catch (locationErr) {
            console.error("Error fetching location key:", locationErr);
            console.error(
              "Location error response:",
              locationErr.response?.data
            );

            // Check if it's a rate limit error
            if (
              locationErr.response?.data?.message?.includes("exceeded") ||
              locationErr.message?.includes("exceeded")
            ) {
              throw new Error(
                `Rate limit exceeded for weather API. Please try again later.`
              );
            } else {
              throw new Error(
                `Weather information is not available for this destination at the moment.`
              );
            }
          }
        }

        if (!key) {
          throw new Error("Location key is required");
        }

        console.log("Using location key:", key);

        // Fetch current conditions from our backend API
        const currentResponse = await api.get(`/weather/current/${key}`);
        console.log("Current weather data:", currentResponse.data);

        // Fetch 5-day forecast from our backend API
        const forecastResponse = await api.get(`/weather/forecast/${key}`);
        console.log("Forecast data received");

        // Fetch hourly forecast from our backend API
        const hourlyResponse = await api.get(`/weather/hourly/${key}?hours=12`);
        console.log("Hourly forecast data received");

        setCurrentWeather(currentResponse.data);
        setForecast(forecastResponse.data);
        setHourlyForecast(hourlyResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        let errorMessage = "Failed to load weather data";

        if (err.response) {
          if (err.response.status === 401) {
            errorMessage =
              "Weather API key is invalid or has expired. Please contact the administrator.";
          } else {
            errorMessage = `Error: ${err.response.status} - ${
              err.response.data.message || err.message
            }`;
          }
          console.error("Error response:", err.response.data);
        } else if (err.message) {
          if (err.message.includes("401")) {
            errorMessage =
              "Weather API key is invalid or has expired. Please contact the administrator.";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    if (locationKey || locationName) {
      fetchWeatherData();
    } else {
      setLoading(false);
      setError("Location information is missing");
    }
  }, [locationKey, locationName]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (error) {
    const isApiKeyError =
      error.includes("API key") ||
      error.includes("401") ||
      error.includes("Unauthorized");

    const isLocationError =
      error.includes("not found") || error.includes("No location found");

    const isRateLimitError =
      error.includes("rate limit") || error.includes("exceeded");

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-center mb-4">
          <svg
            className="h-12 w-12 text-amber-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mt-2">
            Weather Information Temporarily Unavailable
          </h3>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600">
            {isRateLimitError
              ? "Weather data is temporarily unavailable due to high demand. Please try again later."
              : isLocationError
              ? "Weather information is not available for this destination at the moment."
              : isApiKeyError
              ? "Weather service configuration issue. Please contact support."
              : "Weather information is temporarily unavailable. Please try again later."}
          </p>
        </div>

        {isApiKeyError ? (
          <div className="mt-3 text-gray-600 text-sm p-3 bg-gray-50 rounded">
            <p className="font-medium mb-1">Possible Solutions:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>The AccuWeather API key may be invalid or has expired</li>
              <li>Daily API call limit may have been reached</li>
              <li>Check the API key configuration in the .env files</li>
            </ol>
            <p className="mt-2 text-xs">
              See the ACCUWEATHER_API_SETUP.md file for instructions on getting
              a new API key.
            </p>
          </div>
        ) : isRateLimitError ? (
          <div className="mt-3 text-gray-600 text-sm p-3 bg-gray-50 rounded">
            <p className="font-medium mb-1">Why is this happening?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                The weather service has a limited number of API calls per day
              </li>
              <li>
                The system is using cached data when possible to reduce API
                calls
              </li>
              <li>
                Weather data will be available again when the rate limit resets
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-2">
            Please try again later or check the location information.
          </p>
        )}
      </div>
    );
  }

  if (!currentWeather || !forecast) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-500">No weather data available</p>
      </div>
    );
  }

  // Helper function to format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Weather Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{locationName}</h3>
        <span className="text-sm text-gray-500">
          {currentWeather &&
            formatDate(currentWeather.LocalObservationDateTime)}
          {currentWeather &&
            ` ${formatTime(currentWeather.LocalObservationDateTime)}`}
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "current"
              ? "border-b-2 border-primary-500 text-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "hourly"
              ? "border-b-2 border-primary-500 text-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("hourly")}
        >
          Hourly
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "forecast"
              ? "border-b-2 border-primary-500 text-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("forecast")}
        >
          5-Day
        </button>
      </div>

      {/* Current Weather Tab */}
      {activeTab === "current" && currentWeather && (
        <div>
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <img
                src={`https://www.accuweather.com/images/weathericons/${currentWeather.WeatherIcon}.svg`}
                alt={currentWeather.WeatherText}
                className="w-20 h-20"
              />
            </div>
            <div>
              <div className="text-4xl font-bold">
                {currentWeather.Temperature.Metric.Value}°
                {currentWeather.Temperature.Metric.Unit}
              </div>
              <div className="text-lg text-gray-600">
                {currentWeather.WeatherText}
              </div>
              <div className="text-sm text-gray-500">
                Feels like{" "}
                {currentWeather.RealFeelTemperature?.Metric?.Value || ""}°
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">Humidity</div>
              <div className="font-medium">
                {currentWeather.RelativeHumidity}%
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">Wind</div>
              <div className="font-medium">
                {currentWeather.Wind?.Speed?.Metric?.Value || ""}{" "}
                {currentWeather.Wind?.Speed?.Metric?.Unit || ""}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">Pressure</div>
              <div className="font-medium">
                {currentWeather.Pressure?.Metric?.Value || ""}{" "}
                {currentWeather.Pressure?.Metric?.Unit || ""}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">Visibility</div>
              <div className="font-medium">
                {currentWeather.Visibility?.Metric?.Value || ""}{" "}
                {currentWeather.Visibility?.Metric?.Unit || ""}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded mb-4">
            <div className="text-sm text-gray-500">UV Index</div>
            <div className="font-medium">
              {currentWeather.UVIndex || "0"} -{" "}
              {currentWeather.UVIndexText || "Low"}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Forecast Tab */}
      {activeTab === "hourly" && hourlyForecast && (
        <div className="overflow-x-auto">
          <div className="inline-flex space-x-4 min-w-full pb-2">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="text-center flex-shrink-0 w-20">
                <div className="text-sm font-medium mb-1">
                  {formatTime(hour.DateTime)}
                </div>
                <img
                  src={`https://www.accuweather.com/images/weathericons/${hour.WeatherIcon}.svg`}
                  alt={hour.IconPhrase}
                  className="w-10 h-10 mx-auto my-1"
                />
                <div className="text-lg font-medium">
                  {Math.round(hour.Temperature.Value)}°
                </div>
                <div className="text-xs text-gray-500">{hour.IconPhrase}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {hour.PrecipitationProbability}%{" "}
                  <span className="text-blue-500">☂</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Forecast Tab */}
      {activeTab === "forecast" && forecast && (
        <div>
          {forecast.DailyForecasts.map((day, index) => (
            <div
              key={index}
              className="border-b border-gray-100 last:border-0 py-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-24">
                  <div className="font-medium">
                    {index === 0 ? "Today" : formatDate(day.Date)}
                  </div>
                </div>
                <div className="flex items-center flex-1 px-2">
                  <img
                    src={`https://www.accuweather.com/images/weathericons/${day.Day.Icon}.svg`}
                    alt={day.Day.IconPhrase}
                    className="w-10 h-10 mr-2"
                  />
                  <span className="text-sm">{day.Day.IconPhrase}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    {Math.round(day.Temperature.Maximum.Value)}°
                  </span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span className="text-gray-500">
                    {Math.round(day.Temperature.Minimum.Value)}°
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                <div>
                  <span>Precip: </span>
                  <span className="font-medium">
                    {day.Day.PrecipitationProbability}%
                  </span>
                </div>
                <div>
                  <span>Humidity: </span>
                  <span className="font-medium">
                    {day.Day.RelativeHumidity?.Average || "-"}%
                  </span>
                </div>
                <div>
                  <span>Wind: </span>
                  <span className="font-medium">
                    {day.Day.Wind?.Speed?.Value || "-"}{" "}
                    {day.Day.Wind?.Speed?.Unit || ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weather Attribution */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Weather data provided by AccuWeather
      </div>
    </div>
  );
};

export default WeatherWidget;
