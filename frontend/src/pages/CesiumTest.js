import React, { useState, useEffect } from 'react';
import SimpleCesiumViewer from '../components/ar/SimpleCesiumViewer';
// Import Cesium CSS
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumTest = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample destination data
  const destination = {
    name: "Hunza Valley",
    coordinates: {
      latitude: 36.3159,
      longitude: 74.6523
    },
    attractions: [
      "Baltit Fort",
      "Altit Fort",
      "Attabad Lake",
      "Passu Cones",
      "Hussaini Suspension Bridge"
    ]
  };

  useEffect(() => {
    const loadCesium = async () => {
      try {
        // Explicitly set the token in the global scope for Cesium to find
        window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/';
        window.CESIUM_ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8";

        // Add Cesium script if not already present
        if (!document.querySelector('script[src*="cesium.js"]')) {
          // Create a promise to track when the script is loaded
          const scriptLoadPromise = new Promise((resolve, reject) => {
            const cesiumScript = document.createElement('script');
            cesiumScript.src = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Cesium.js';
            cesiumScript.async = true;
            cesiumScript.onload = resolve;
            cesiumScript.onerror = reject;
            document.head.appendChild(cesiumScript);
          });

          // Add Cesium CSS
          if (!document.querySelector('link[href*="Widgets/widgets.css"]')) {
            const cesiumCss = document.createElement('link');
            cesiumCss.rel = 'stylesheet';
            cesiumCss.href = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Widgets/widgets.css';
            document.head.appendChild(cesiumCss);
          }

          // Wait for script to load
          await scriptLoadPromise;
        }

        // Check if Cesium is loaded and set the token
        const checkCesiumLoaded = () => {
          if (window.Cesium) {
            console.log("Cesium loaded successfully");

            // Set the token directly on the Ion object
            if (window.Cesium.Ion) {
              window.Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8";
              console.log("Cesium Ion token set");

              // Force Cesium to recognize the token
              const ionServer = window.Cesium.Ion.getServer();
              if (ionServer) {
                ionServer.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8";
                console.log("Ion server token updated");
              }
            }

            // Add a small delay before removing loading state
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } else {
            setTimeout(checkCesiumLoaded, 500);
          }
        };

        checkCesiumLoaded();
      } catch (err) {
        console.error("Error loading Cesium:", err);
        setError("Failed to load Cesium. Please refresh the page and try again.");
      }
    };

    loadCesium();

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Cesium 3D Test: {destination.name}
            </h2>
          </div>

          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 mb-4">
              This is a test page for the Cesium 3D viewer. It displays {destination.name} in 3D using Cesium Ion.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Tip:</strong> Use the navigation controls in the top-right corner to explore the 3D view.
            </p>
          </div>

          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
                <div className="text-center bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Loading Cesium 3D viewer...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments...</p>
                  <button
                    onClick={async () => {
                      try {
                        // Force reload Cesium
                        if (!document.querySelector('script[src*="cesium.js"]')) {
                          // Create a promise to track when the script is loaded
                          const scriptLoadPromise = new Promise((resolve, reject) => {
                            const cesiumScript = document.createElement('script');
                            cesiumScript.src = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Cesium.js';
                            cesiumScript.async = true;
                            cesiumScript.onload = resolve;
                            cesiumScript.onerror = reject;
                            document.head.appendChild(cesiumScript);
                          });

                          // Add Cesium CSS
                          if (!document.querySelector('link[href*="Widgets/widgets.css"]')) {
                            const cesiumCss = document.createElement('link');
                            cesiumCss.rel = 'stylesheet';
                            cesiumCss.href = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Widgets/widgets.css';
                            document.head.appendChild(cesiumCss);
                          }

                          // Wait for script to load
                          await scriptLoadPromise;
                        }

                        // Check if Cesium is loaded
                        const checkCesiumLoaded = () => {
                          if (window.Cesium) {
                            console.log("Cesium loaded successfully");
                            // Add a small delay before removing loading state
                            setTimeout(() => {
                              setLoading(false);
                            }, 1000);
                          } else {
                            setTimeout(checkCesiumLoaded, 500);
                          }
                        };

                        checkCesiumLoaded();
                      } catch (err) {
                        console.error("Error loading Cesium:", err);
                        setError("Failed to load Cesium. Please refresh the page and try again.");
                      }
                    }}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Retry Loading Cesium
                  </button>
                </div>
              </div>
            )}

            <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
              <SimpleCesiumViewer
                coordinates={destination.coordinates}
                name={destination.name}
                attractions={destination.attractions}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CesiumTest;
