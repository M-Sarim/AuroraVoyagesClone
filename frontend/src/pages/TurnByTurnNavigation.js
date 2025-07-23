import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMap, getDirections, isOnline } from "../services/mapService";
import LocationIQMap from "../components/maps/LocationIQMap";

const TurnByTurnNavigation = () => {
  const [mapData, setMapData] = useState(null);
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [online, setOnline] = useState(isOnline());
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [travelMode, setTravelMode] = useState("driving");
  const [userLocation, setUserLocation] = useState(null);
  const [simulateNavigation, setSimulateNavigation] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Set up online/offline event listeners
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set default map data
    setMapData({
      name: "Skardu",
      center: {
        lat: 35.3,
        lng: 75.6,
      },
      zoom: 10,
    });

    // Set default destination (Skardu coordinates)
    // Make sure to use the format "latitude,longitude"
    setDestination("35.3,75.6");

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setOrigin(`${latitude},${longitude}`);
        },
        (err) => {
          console.error("Error getting location:", err);
          // Use a default location as fallback
          setOrigin("34.0151,71.5249"); // Peshawar coordinates as fallback
        }
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      // Clear simulation interval if active
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  const fetchDirections = async () => {
    if (!origin || !destination) {
      setError("Please provide both origin and destination");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      console.log(
        `Fetching directions from ${origin} to ${destination} via ${travelMode}`
      );

      // Validate coordinates format
      const originRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
      const destinationRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

      if (!originRegex.test(origin)) {
        console.warn(`Origin format may be invalid: ${origin}`);
      }

      if (!destinationRegex.test(destination)) {
        console.warn(`Destination format may be invalid: ${destination}`);
      }

      console.log("Making API call to get directions...");
      const directionsData = await getDirections(
        origin,
        destination,
        travelMode
      );

      console.log("Directions data received:", directionsData);

      // Check if we have valid routes
      if (
        !directionsData ||
        !directionsData.routes ||
        directionsData.routes.length === 0
      ) {
        throw new Error("No routes found for the given origin and destination");
      }

      // Set destination coordinates from the route data
      if (directionsData.routes[0].legs && directionsData.routes[0].legs[0]) {
        const leg = directionsData.routes[0].legs[0];
        if (leg.end_location) {
          setMapData((prevData) => ({
            ...prevData,
            center: {
              lat: leg.end_location.lat,
              lng: leg.end_location.lng,
            },
          }));
        }
      }

      setDirections(directionsData);
      setCurrentStep(0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching directions:", err);

      // Provide more specific error messages
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Server error";
        setError(`Failed to get directions: ${errorMessage}`);
      } else if (err.request) {
        setError(
          "Failed to get directions. Please check your internet connection."
        );
      } else {
        setError(err.message || "Failed to get directions. Please try again.");
      }

      setLoading(false);
    }
  };

  const handleStartNavigation = () => {
    // Set default values if not provided
    if (!origin) {
      // Default to Peshawar
      setOrigin("34.0151,71.5249");
      console.log("Setting default origin to Peshawar: 34.0151,71.5249");
    }

    if (!destination) {
      // Default to Skardu
      setDestination("35.3,75.6");
      console.log("Setting default destination to Skardu: 35.3,75.6");

      // Need to return and wait for state update
      setTimeout(() => {
        fetchDirections();
      }, 100);
      return;
    }

    // Make sure coordinates are in the correct format (lat,lng)
    const originRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    const destinationRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

    let validationError = false;

    if (!originRegex.test(origin)) {
      console.warn(`Origin format may be invalid: ${origin}`);
      // Don't block, just warn
      console.log("Origin coordinates should be in format: latitude,longitude");
    }

    if (!destinationRegex.test(destination)) {
      console.warn(`Destination format may be invalid: ${destination}`);
      // Don't block, just warn
      console.log(
        "Destination coordinates should be in format: latitude,longitude"
      );
    }

    // Fetch directions even if format is not perfect - backend will handle it
    fetchDirections();
  };

  const handleNextStep = () => {
    if (
      directions &&
      currentStep < directions.routes[0].legs[0].steps.length - 1
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (directions && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startSimulation = () => {
    if (!directions || !directions.routes[0]) return;

    setSimulateNavigation(true);

    const steps = directions.routes[0].legs[0].steps;
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        clearInterval(interval);
        setSimulateNavigation(false);
      }
    }, 3000); // Move to next step every 3 seconds

    setSimulationInterval(interval);
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setSimulateNavigation(false);
  };

  // Extract HTML instructions and remove HTML tags
  const cleanInstructions = (htmlInstructions) => {
    if (!htmlInstructions) return "";
    const div = document.createElement("div");
    div.innerHTML = htmlInstructions;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Turn-by-Turn Navigation
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Navigate to your destination with step-by-step directions, even when
          offline.
        </p>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Navigation Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Navigation - {mapData?.name || "Skardu"}
              </h2>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    online ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span className="text-sm text-gray-600">
                  {online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Route Planning Form */}
          {!directions && (
            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Starting Point
                </label>
                <input
                  type="text"
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Enter starting point or coordinates"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Using your current location. You can change it if needed.
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination or coordinates"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Default destination is set to Skardu. You can change it to a
                  specific point of interest.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Mode
                </label>
                <div className="flex space-x-4">
                  {["driving", "walking", "bicycling", "transit"].map(
                    (mode) => (
                      <label key={mode} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="travelMode"
                          value={mode}
                          checked={travelMode === mode}
                          onChange={() => setTravelMode(mode)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {mode}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={handleStartNavigation}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Get Directions
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {loading && (
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              )}
            </div>
          )}

          {/* Navigation View */}
          {directions && (
            <div>
              {/* Map View */}
              <div className="h-[400px] w-full relative">
                <LocationIQMap
                  center={userLocation || mapData.center}
                  zoom={12}
                  markers={[
                    ...(userLocation
                      ? [
                          {
                            position: userLocation,
                            title: "Your Location",
                          },
                        ]
                      : []),
                    {
                      position: {
                        lat: mapData.center.lat,
                        lng: mapData.center.lng,
                      },
                      title: mapData.name,
                    },
                  ]}
                  route={directions} // Pass the directions data to draw the route
                  height="400px"
                />

                {/* Current Step Indicator */}
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Step {currentStep + 1} of{" "}
                      {directions.routes[0].legs[0].steps.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(
                        directions.routes[0].legs[0].steps[currentStep].distance
                          .value / 1000
                      )}{" "}
                      km
                    </span>
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    {cleanInstructions(
                      directions.routes[0].legs[0].steps[currentStep]
                        .html_instructions
                    )}
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="p-4 flex justify-between items-center border-t border-b border-gray-200">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="text-center">
                  <div className="text-sm text-gray-500">
                    {directions.routes[0].legs[0].distance.text} •{" "}
                    {directions.routes[0].legs[0].duration.text}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={
                    currentStep ===
                    directions.routes[0].legs[0].steps.length - 1
                  }
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              {/* Step Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Turn-by-Turn Directions
                </h3>

                <div className="space-y-4">
                  {directions.routes[0].legs[0].steps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${
                        index === currentStep
                          ? "bg-primary-50 border border-primary-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              index === currentStep
                                ? "bg-primary-600 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {cleanInstructions(step.html_instructions)}
                          </p>
                          <div className="mt-1 text-xs text-gray-500">
                            {step.distance.text} • {step.duration.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="p-4 border-t border-gray-200">
                {simulateNavigation ? (
                  <button
                    onClick={stopSimulation}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Stop Simulation
                  </button>
                ) : (
                  <button
                    onClick={startSimulation}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Simulate Navigation
                  </button>
                )}

                <button
                  onClick={() => {
                    setDirections(null);
                    setError(null);
                  }}
                  className="w-full mt-2 bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Plan New Route
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnByTurnNavigation;
