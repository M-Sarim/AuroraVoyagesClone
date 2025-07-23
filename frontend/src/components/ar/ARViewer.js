import React, { useEffect, useState } from "react";
import "./ARViewer.css";
import SimpleCesiumViewer from "./SimpleCesiumViewer";

/**
 * ARViewer component for displaying augmented reality view of destinations
 * Uses Cesium Ion for 3D visualization
 *
 * @param {Object} props
 * @param {Object} props.coordinates - Coordinates {latitude, longitude}
 * @param {string} props.name - Name of the destination
 * @param {Array} props.attractions - Array of attractions at the destination
 * @param {string} props.cesiumIonToken - Cesium Ion access token
 * @param {number} props.tilesetId - Cesium Ion 3D Tileset ID
 */
const ARViewer = ({
  coordinates,
  name,
  attractions = [],
  cesiumIonToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8",
  tilesetId = 354307
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cesiumLoaded, setCesiumLoaded] = useState(false);

  // Initialize Cesium
  useEffect(() => {
    // Load Cesium
    try {
      setLoading(true);

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
        scriptLoadPromise.then(() => {
          // Check if Cesium is loaded
          const checkCesiumLoaded = () => {
            if (window.Cesium) {
              console.log("Cesium loaded successfully");
              setCesiumLoaded(true);
              setLoading(false);
            } else {
              setTimeout(checkCesiumLoaded, 500);
            }
          };

          checkCesiumLoaded();
        }).catch(err => {
          console.error("Error loading Cesium script:", err);
          setError("Failed to load Cesium. Please try again.");
          setLoading(false);
        });
      } else {
        // Cesium script already exists, check if Cesium is loaded
        const checkCesiumLoaded = () => {
          if (window.Cesium) {
            console.log("Cesium already loaded");
            setCesiumLoaded(true);
            setLoading(false);
          } else {
            setTimeout(checkCesiumLoaded, 500);
          }
        };

        checkCesiumLoaded();
      }
    } catch (err) {
      console.error("Error setting up Cesium:", err);
      setError("Failed to initialize Cesium. Please try again later.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="ar-viewer-container">
      <div className="cesium-container">
        {loading && (
          <div className="ar-loading">
            <div className="ar-spinner"></div>
            <p>Loading Cesium 3D View...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments...</p>
          </div>
        )}

        {error && (
          <div className="ar-error">
            <p>{error}</p>
            <button
              onClick={async () => {
                try {
                  setError(null);
                  setLoading(true);
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
                      setCesiumLoaded(true);
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
                  setError("Failed to load Cesium. Please try again.");
                  setLoading(false);
                }
              }}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retry Loading Cesium
            </button>
          </div>
        )}

        {(cesiumLoaded || window.Cesium) && (
          <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
            <SimpleCesiumViewer
              coordinates={coordinates}
              name={name}
              attractions={attractions}
              cesiumIonToken={cesiumIonToken}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ARViewer;
