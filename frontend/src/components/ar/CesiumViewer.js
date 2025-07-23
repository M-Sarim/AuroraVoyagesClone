import React, { useEffect, useRef, useState } from "react";
// Import only what we need for type checking, but use window.Cesium for actual usage
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Cartesian3, Cartographic } from "cesium";
import { Viewer as ResiumViewer, Entity, CameraFlyTo, Cesium3DTileset } from "resium";
import "./CesiumViewer.css";

/**
 * CesiumViewer component for displaying 3D maps using Cesium Ion
 *
 * @param {Object} props
 * @param {Object} props.coordinates - Coordinates {latitude, longitude}
 * @param {string} props.name - Name of the destination
 * @param {Array} props.attractions - Array of attractions at the destination
 * @param {string} props.cesiumIonToken - Cesium Ion access token
 * @param {number} props.tilesetId - Cesium Ion 3D Tileset ID (default: 354307)
 */
const CesiumViewer = ({
  coordinates,
  name,
  attractions = [],
  cesiumIonToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8",
  tilesetId = 354307
}) => {
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerInstance, setViewerInstance] = useState(null);
  const [flyToComplete, setFlyToComplete] = useState(false);

  // Initialize Cesium Ion with the provided token
  useEffect(() => {
    const initCesium = async () => {
      try {
        // Explicitly set the token in the global scope for Cesium to find
        window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/';

        // Add Cesium ion script to the document head if not already present
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

        // Set the token after ensuring script is loaded
        if (window.Cesium && window.Cesium.Ion) {
          // Set the token directly on the Ion object
          window.Cesium.Ion.defaultAccessToken = cesiumIonToken;
          console.log("Cesium Ion initialized with token:", cesiumIonToken);

          // Also set it as a global variable that Cesium might look for
          window.CESIUM_ION_TOKEN = cesiumIonToken;

          // Force Cesium to recognize the token
          const ionServer = window.Cesium.Ion.getServer();
          if (ionServer) {
            ionServer.accessToken = cesiumIonToken;
            console.log("Ion server token updated");
          }
        } else {
          console.warn("Cesium or Cesium.Ion not available yet");
          // Keep checking for Cesium to be available
          const checkInterval = setInterval(() => {
            if (window.Cesium && window.Cesium.Ion) {
              window.Cesium.Ion.defaultAccessToken = cesiumIonToken;
              console.log("Cesium Ion initialized with token (delayed)");
              clearInterval(checkInterval);
            }
          }, 500);

          // Clear interval after 10 seconds to prevent memory leaks
          setTimeout(() => clearInterval(checkInterval), 10000);
        }
      } catch (err) {
        console.error("Error initializing Cesium Ion:", err);
        setError("Failed to initialize Cesium Ion. Please check your access token.");
      }
    };

    initCesium();

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [cesiumIonToken]);

  // Handle viewer initialization
  const handleViewerReady = (viewer) => {
    if (!viewer) return;

    setViewerInstance(viewer);
    console.log("Cesium Viewer initialized");

    // Set up basic viewer settings without external resources
    try {
      // Set initial view settings
      viewer.scene.globe.depthTestAgainstTerrain = true;

      // Make sure the token is set directly on the viewer
      if (window.Cesium && window.Cesium.Ion) {
        // Set the token directly on the Ion object again to be sure
        window.Cesium.Ion.defaultAccessToken = cesiumIonToken;

        // Disable automatic asset fetching to prevent unwanted requests
        viewer.scene.globe.enableLighting = false;
        viewer.scene.fog.enabled = false;
        viewer.scene.skyAtmosphere.show = false;

        console.log("Viewer initialized with token:", cesiumIonToken);
      } else {
        console.warn("Cesium not available for viewer initialization");
      }
    } catch (err) {
      console.error("Error setting up viewer:", err);
    }

    // Configure viewer appearance
    viewer.scene.skyBox.show = false; // Disable skybox to reduce resource usage
    viewer.scene.fog.enabled = false; // Disable fog to reduce resource usage

    // Set initial view settings
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // Set a timeout to ensure loading state is removed
    setTimeout(() => {
      setLoading(false);
      console.log("Loading state removed");
    }, 1000);
  };

  // Handle fly-to completion
  const handleFlyToComplete = () => {
    setFlyToComplete(true);
    console.log("Camera fly-to complete");
  };

  // Calculate position from coordinates
  const getPosition = () => {
    if (!coordinates) return null;
    if (!window.Cesium) return null;

    const latitude = coordinates.latitude || 35.3753;
    const longitude = coordinates.longitude || 75.1755;

    try {
      return window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000);
    } catch (err) {
      console.error("Error creating position:", err);
      return null;
    }
  };

  // Calculate camera position for fly-to
  const getCameraDestination = () => {
    if (!coordinates) return null;
    if (!window.Cesium) return null;

    const latitude = coordinates.latitude || 35.3753;
    const longitude = coordinates.longitude || 75.1755;

    try {
      return {
        destination: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
        orientation: {
          heading: window.Cesium.Math.toRadians(0),
          pitch: window.Cesium.Math.toRadians(-45),
          roll: 0.0
        }
      };
    } catch (err) {
      console.error("Error creating camera destination:", err);
      return null;
    }
  };

  return (
    <div className="cesium-viewer-container">
      {loading && (
        <div className="cesium-loading">
          <div className="cesium-spinner"></div>
          <p>Loading 3D Map...</p>
        </div>
      )}

      {error && (
        <div className="cesium-error">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              // Attempt to reinitialize
              if (viewerInstance) {
                viewerInstance.destroy();
                setViewerInstance(null);
              }
              setTimeout(() => {
                try {
                  if (window.Cesium && window.Cesium.Ion) {
                    window.Cesium.Ion.defaultAccessToken = cesiumIonToken;
                  }
                  setLoading(false);
                } catch (err) {
                  console.error("Error reinitializing Cesium Ion:", err);
                  setError("Failed to initialize Cesium Ion. Please refresh the page.");
                  setLoading(false);
                }
              }, 1000);
            }}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Retry
          </button>
        </div>
      )}

      <ResiumViewer
        ref={viewerRef}
        full
        className="cesium-viewer"
        onReady={handleViewerReady}
        timeline={false}
        animation={false}
        baseLayerPicker={true}
        fullscreenButton={true}
        vrButton={true}
        homeButton={true}
        infoBox={true}
        sceneModePicker={true}
        selectionIndicator={true}
        navigationHelpButton={true}
        navigationInstructionsInitiallyVisible={false}
        geocoder={true}
        terrainProvider={window.Cesium ? new window.Cesium.EllipsoidTerrainProvider({}) : undefined}
        imageryProvider={window.Cesium ? new window.Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        }) : undefined}
        accessToken={cesiumIonToken}
      >
        {/* Main destination entity */}
        <Entity
          name={name}
          position={getPosition()}
          point={{ pixelSize: 15, color: { red: 0.26, green: 0.52, blue: 0.96, alpha: 1 } }}
          label={{
            text: name,
            font: '14pt sans-serif',
            style: 'FILL_AND_OUTLINE',
            outlineWidth: 2,
            verticalOrigin: 'BOTTOM',
            pixelOffset: { x: 0, y: -10 }
          }}
        />

        {/* Attraction entities */}
        {window.Cesium && attractions.map((attraction, index) => {
          try {
            // Create random position around the main destination
            const position = getPosition();
            if (!position) return null;

            // Convert Cartesian3 to Cartographic
            const cartographic = window.Cesium.Cartographic.fromCartesian(position);
            if (!cartographic) {
              console.error("Failed to convert position to cartographic for attraction:", attraction);
              return null;
            }

            const longitude = window.Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = window.Cesium.Math.toDegrees(cartographic.latitude);

            // Add small random offset
            const attractionPosition = window.Cesium.Cartesian3.fromDegrees(
              longitude + (Math.random() - 0.5) * 0.05,
              latitude + (Math.random() - 0.5) * 0.05,
              cartographic.height || 1000
            );

            return (
              <Entity
                key={`attraction-${index}`}
                name={attraction}
                position={attractionPosition}
                point={{ pixelSize: 12, color: { red: 0.92, green: 0.26, blue: 0.21, alpha: 1 } }}
                label={{
                  text: attraction,
                  font: '12pt sans-serif',
                  style: 'FILL_AND_OUTLINE',
                  outlineWidth: 2,
                  verticalOrigin: 'BOTTOM',
                  pixelOffset: { x: 0, y: -10 }
                }}
              />
            );
          } catch (err) {
            console.error("Error creating attraction entity:", err);
            return null;
          }
        })}

        {/* Camera fly-to animation */}
        {!flyToComplete && getCameraDestination() && (
          <CameraFlyTo
            destination={getCameraDestination().destination}
            orientation={getCameraDestination().orientation}
            duration={3.0}
            onComplete={handleFlyToComplete}
          />
        )}

        {/* Add a simple point for the destination */}
        {window.Cesium && getPosition() && (
          <Entity
            name={`Destination: ${name}`}
            description={`Location: ${coordinates.latitude}, ${coordinates.longitude}`}
            position={getPosition()}
            point={{
              pixelSize: 20,
              color: window.Cesium ? new window.Cesium.Color(0.0, 1.0, 1.0, 1.0) : { red: 0, green: 1, blue: 1, alpha: 1 },
              outlineColor: window.Cesium ? new window.Cesium.Color(0.0, 0.5, 1.0, 1.0) : { red: 0, green: 0.5, blue: 1, alpha: 1 },
              outlineWidth: 3
            }}
          />
        )}
      </ResiumViewer>

      <div className="cesium-instructions">
        <h3>How to use 3D View</h3>
        <ul>
          <li>Left click + drag: Rotate the camera</li>
          <li>Right click + drag: Zoom in/out</li>
          <li>Middle click + drag: Pan the camera</li>
          <li>Use the navigation controls in the top-right</li>
          <li>Click on markers to see information</li>
        </ul>
      </div>
    </div>
  );
};

export default CesiumViewer;
