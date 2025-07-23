import React, { useEffect, useRef, useState } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./CesiumViewer.css";

/**
 * SimpleCesiumViewer component for displaying 3D maps using Cesium
 * This version uses a direct Cesium widget without Resium to avoid token issues
 *
 * @param {Object} props
 * @param {Object} props.coordinates - Coordinates {latitude, longitude}
 * @param {string} props.name - Name of the destination
 * @param {Array} props.attractions - Array of attractions at the destination
 * @param {string} props.cesiumIonToken - Cesium Ion access token
 */
const SimpleCesiumViewer = ({
  coordinates,
  name,
  attractions = [],
  cesiumIonToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8"
}) => {
  const cesiumContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(3000); // Default zoom level (altitude in meters)
  const [currentTilt, setCurrentTilt] = useState(-35); // Default tilt angle in degrees
  const [weatherData, setWeatherData] = useState({
    temperature: Math.floor(Math.random() * 15) + 5, // Random temperature between 5-20°C
    condition: "Partly Cloudy"
  });

  // Initialize Cesium
  useEffect(() => {
    const initCesium = async () => {
      try {
        // Set up Cesium base URL
        window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/';

        // Load Cesium script if not already loaded
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

        // Initialize the viewer once Cesium is loaded
        if (window.Cesium && cesiumContainerRef.current) {
          // Set the Cesium Ion token
          window.Cesium.Ion.defaultAccessToken = cesiumIonToken;

          // Create the viewer with enhanced settings
          const cesiumViewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
            baseLayerPicker: true,
            geocoder: true,
            homeButton: true,
            infoBox: true,
            sceneModePicker: true,
            selectionIndicator: true,
            timeline: false,
            navigationHelpButton: true,
            navigationInstructionsInitiallyVisible: false,
            terrainProvider: window.Cesium.createWorldTerrain({
              requestWaterMask: true,
              requestVertexNormals: true
            }),
            // Enable keyboard and mouse navigation
            navigationEnabled: true,
            // Make sure the scene accepts keyboard input
            scene3DOnly: false,
            // Ensure the camera controls are enabled
            useBrowserRecommendedResolution: true,
            // Enable smooth camera transitions
            shouldAnimate: true
          });

          // Enable lighting and atmosphere for more realistic view
          cesiumViewer.scene.globe.enableLighting = true;
          cesiumViewer.scene.globe.depthTestAgainstTerrain = true;
          cesiumViewer.scene.skyAtmosphere.show = true;
          cesiumViewer.scene.fog.enabled = true;

          // Enable smooth camera control
          cesiumViewer.clock.shouldAnimate = true;
          cesiumViewer.scene.screenSpaceCameraController.enableRotate = true;
          cesiumViewer.scene.screenSpaceCameraController.enableTranslate = true;
          cesiumViewer.scene.screenSpaceCameraController.enableZoom = true;
          cesiumViewer.scene.screenSpaceCameraController.enableTilt = true;
          cesiumViewer.scene.screenSpaceCameraController.enableLook = true;

          // Ensure pinch zoom is enabled for touch devices
          cesiumViewer.scene.screenSpaceCameraController.zoomEventTypes = [
            window.Cesium.CameraEventType.WHEEL,
            window.Cesium.CameraEventType.PINCH
          ];

          // Enhance pinch sensitivity for better touch control
          cesiumViewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; // Closer zoom
          cesiumViewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000000; // Further zoom out

          // Add event listeners for keyboard navigation
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
              cesiumViewer.camera.lookUp(0.02);
            } else if (e.key === 'ArrowDown') {
              cesiumViewer.camera.lookDown(0.02);
            } else if (e.key === 'ArrowLeft') {
              cesiumViewer.camera.lookLeft(0.02);
            } else if (e.key === 'ArrowRight') {
              cesiumViewer.camera.lookRight(0.02);
            } else if (e.key === '+' || e.key === '=') {
              cesiumViewer.camera.moveForward(currentZoom / 10);
            } else if (e.key === '-' || e.key === '_') {
              cesiumViewer.camera.moveBackward(currentZoom / 10);
            }
          });

          // Add Cesium OSM Buildings
          try {
            const osmBuildingsTileset = await window.Cesium.createOsmBuildings();
            cesiumViewer.scene.primitives.add(osmBuildingsTileset);
          } catch (err) {
            console.warn("Could not load OSM Buildings:", err);
          }

          // Add destination entity
          if (coordinates) {
            const position = window.Cesium.Cartesian3.fromDegrees(
              coordinates.longitude || 75.1755,
              coordinates.latitude || 35.3753,
              100 // Lower height to be closer to terrain
            );

            // Add main destination entity with enhanced styling
            cesiumViewer.entities.add({
              name: name,
              position: position,
              billboard: {
                image: 'https://cdn.jsdelivr.net/npm/cesium@1.104.0/Build/Cesium/Assets/Images/pin-blue.png',
                verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                scale: 0.8
              },
              label: {
                text: name,
                font: '16pt sans-serif',
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: window.Cesium.Color.BLACK,
                fillColor: window.Cesium.Color.WHITE,
                verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new window.Cesium.Cartesian2(0, -40),
                heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              },
              description: `<div class="cesium-infoBox-description">
                <h2>${name}</h2>
                <p>Coordinates: ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}</p>
                <p>Attractions: ${attractions.join(', ')}</p>
              </div>`
            });

            // Add temperature information entity
            cesiumViewer.entities.add({
              name: `Temperature at ${name}`,
              position: window.Cesium.Cartesian3.fromDegrees(
                coordinates.longitude || 75.1755,
                coordinates.latitude || 35.3753,
                150 // Slightly higher than main marker
              ),
              billboard: {
                image: 'https://cdn.jsdelivr.net/npm/cesium@1.104.0/Build/Cesium/Assets/Images/pin-purple.png',
                verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                scale: 0.7
              },
              label: {
                text: `Temperature right now: ${weatherData.temperature}°C`,
                font: '14pt sans-serif',
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: window.Cesium.Color.BLACK,
                fillColor: window.Cesium.Color.WHITE,
                backgroundColor: window.Cesium.Color.fromCssColorString('rgba(147, 51, 234, 0.7)'), // Purple background
                backgroundPadding: new window.Cesium.Cartesian2(7, 5),
                verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new window.Cesium.Cartesian2(0, -40),
                heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              },
              description: `<div class="cesium-infoBox-description">
                <h3>Weather at ${name}</h3>
                <p>Temperature: ${weatherData.temperature}°C</p>
                <p>Condition: ${weatherData.condition}</p>
              </div>`
            });

            // Add attraction entities with enhanced styling
            attractions.forEach((attraction, index) => {
              // Create positions around the main destination with better distribution
              const angle = (index / attractions.length) * Math.PI * 2;
              const radius = 0.02 + (Math.random() * 0.01); // Random radius between 0.02 and 0.03 degrees

              const attractionPosition = window.Cesium.Cartesian3.fromDegrees(
                coordinates.longitude + Math.cos(angle) * radius,
                coordinates.latitude + Math.sin(angle) * radius,
                50 // Lower height to be closer to terrain
              );

              // Add attraction entity with enhanced styling
              cesiumViewer.entities.add({
                name: attraction,
                position: attractionPosition,
                billboard: {
                  image: 'https://cdn.jsdelivr.net/npm/cesium@1.104.0/Build/Cesium/Assets/Images/pin-red.png',
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                  scale: 0.6
                },
                label: {
                  text: attraction,
                  font: '12pt sans-serif',
                  style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  outlineColor: window.Cesium.Color.BLACK,
                  fillColor: window.Cesium.Color.WHITE,
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new window.Cesium.Cartesian2(0, -30),
                  heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                description: `<div class="cesium-infoBox-description">
                  <h3>${attraction}</h3>
                  <p>A popular attraction near ${name}</p>
                </div>`
              });
            });

            // Add a school or other point of interest
            if (name.includes("Hunza")) {
              const schoolPosition = window.Cesium.Cartesian3.fromDegrees(
                coordinates.longitude + 0.03,
                coordinates.latitude + 0.02,
                50
              );

              cesiumViewer.entities.add({
                name: "Ulwa Public School & College Ganish Hunza",
                position: schoolPosition,
                billboard: {
                  image: 'https://cdn.jsdelivr.net/npm/cesium@1.104.0/Build/Cesium/Assets/Images/pin-blue-dot.png',
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                  scale: 0.6
                },
                label: {
                  text: "Ulwa Public School & College Ganish Hunza",
                  font: '12pt sans-serif',
                  style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  outlineColor: window.Cesium.Color.BLACK,
                  fillColor: window.Cesium.Color.WHITE,
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new window.Cesium.Cartesian2(0, -30),
                  heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
              });

              // Add Regional Passport Office
              const passportOfficePosition = window.Cesium.Cartesian3.fromDegrees(
                coordinates.longitude + 0.04,
                coordinates.latitude - 0.01,
                50
              );

              cesiumViewer.entities.add({
                name: "Regional Passport Office Hunza",
                position: passportOfficePosition,
                billboard: {
                  image: 'https://cdn.jsdelivr.net/npm/cesium@1.104.0/Build/Cesium/Assets/Images/pin-blue-dot.png',
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                  scale: 0.6
                },
                label: {
                  text: "Regional Passport Office Hunza",
                  font: '12pt sans-serif',
                  style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  outlineColor: window.Cesium.Color.BLACK,
                  fillColor: window.Cesium.Color.WHITE,
                  verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new window.Cesium.Cartesian2(0, -30),
                  heightReference: window.Cesium.HeightReference.RELATIVE_TO_GROUND,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
              });
            }

            // Set camera to look at destination with better angle
            cesiumViewer.camera.flyTo({
              destination: window.Cesium.Cartesian3.fromDegrees(
                coordinates.longitude || 75.1755,
                coordinates.latitude || 35.3753,
                currentZoom // Use the current zoom level
              ),
              orientation: {
                heading: window.Cesium.Math.toRadians(30), // Slight angle
                pitch: window.Cesium.Math.toRadians(currentTilt), // Use the current tilt value
                roll: 0.0
              },
              duration: 3.0
            });

            // Update currentZoom state to match initial camera position
            setCurrentZoom(3000);
          }

          setViewer(cesiumViewer);

          // Set a timeout to ensure loading state is removed
          setTimeout(() => {
            setLoading(false);
            console.log("Loading state removed");
          }, 1000);
        } else {
          throw new Error("Cesium not available after script load");
        }
      } catch (err) {
        console.error("Error initializing Cesium:", err);
        setError("Failed to initialize Cesium. Please try again.");
        setLoading(false);
      }
    };

    initCesium();

    // Cleanup function
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [coordinates, name, attractions]);

  // Function to handle zooming in - direct camera manipulation
  const handleZoomIn = () => {
    if (!viewer) {
      console.error("Zoom in failed: Cesium viewer not initialized");
      return;
    }

    try {
      console.log("Zooming in via direct camera manipulation");

      // Get current height
      const cameraPosition = viewer.camera.position;
      const ellipsoid = viewer.scene.globe.ellipsoid;
      const cartographic = ellipsoid.cartesianToCartographic(cameraPosition);
      const height = cartographic.height;

      // Calculate zoom amount based on current height
      const zoomAmount = height * 0.2; // 20% of current height

      // Move camera forward
      viewer.camera.zoomIn(zoomAmount);

      // Update the zoom state
      setCurrentZoom(prev => Math.max(prev * 0.8, 500));

      console.log("Zoomed in to height:", height - zoomAmount);
    } catch (error) {
      console.error("Error during zoom in:", error);

      // Try alternative approach
      try {
        // Alternative approach: use moveForward
        viewer.camera.moveForward(currentZoom / 5);
      } catch (e) {
        console.error("Alternative zoom in also failed:", e);
      }
    }
  };

  // Function to handle zooming out - direct camera manipulation
  const handleZoomOut = () => {
    if (!viewer) {
      console.error("Zoom out failed: Cesium viewer not initialized");
      return;
    }

    try {
      console.log("Zooming out via direct camera manipulation");

      // Get current height
      const cameraPosition = viewer.camera.position;
      const ellipsoid = viewer.scene.globe.ellipsoid;
      const cartographic = ellipsoid.cartesianToCartographic(cameraPosition);
      const height = cartographic.height;

      // Calculate zoom amount based on current height
      const zoomAmount = height * 0.2; // 20% of current height

      // Move camera backward
      viewer.camera.zoomOut(zoomAmount);

      // Update the zoom state
      setCurrentZoom(prev => Math.min(prev * 1.2, 10000));

      console.log("Zoomed out to height:", height + zoomAmount);
    } catch (error) {
      console.error("Error during zoom out:", error);

      // Try alternative approach
      try {
        // Alternative approach: use moveBackward
        viewer.camera.moveBackward(currentZoom / 5);
      } catch (e) {
        console.error("Alternative zoom out also failed:", e);
      }
    }
  };

  // Function to tilt the view up - using direct DOM events
  const handleTiltUp = () => {
    if (!cesiumContainerRef.current) {
      console.error("Tilt up failed: Cesium container not found");
      return;
    }

    try {
      console.log("Tilting up via DOM event");

      // Create and dispatch a keyboard event to simulate arrow key press
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        code: 'ArrowUp',
        keyCode: 38,
        which: 38,
        bubbles: true,
        cancelable: true
      });

      // Dispatch the event on the document (Cesium listens for keyboard events at document level)
      document.dispatchEvent(keyEvent);

      // Update the tilt state (approximate)
      setCurrentTilt(prev => Math.min(prev + 5, 0));

      // Fallback method if event dispatch doesn't work as expected
      if (viewer) {
        try {
          viewer.camera.lookUp(0.05);
        } catch (e) {
          console.error("Fallback tilt also failed:", e);
        }
      }
    } catch (error) {
      console.error("Error during tilt up:", error);
    }
  };

  // Function to tilt the view down - using direct DOM events
  const handleTiltDown = () => {
    if (!cesiumContainerRef.current) {
      console.error("Tilt down failed: Cesium container not found");
      return;
    }

    try {
      console.log("Tilting down via DOM event");

      // Create and dispatch a keyboard event to simulate arrow key press
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: true
      });

      // Dispatch the event on the document (Cesium listens for keyboard events at document level)
      document.dispatchEvent(keyEvent);

      // Update the tilt state (approximate)
      setCurrentTilt(prev => Math.max(prev - 5, -90));

      // Fallback method if event dispatch doesn't work as expected
      if (viewer) {
        try {
          viewer.camera.lookDown(0.05);
        } catch (e) {
          console.error("Fallback tilt also failed:", e);
        }
      }
    } catch (error) {
      console.error("Error during tilt down:", error);
    }
  };

  // Function to reset the view to the original position
  const handleResetView = () => {
    if (!viewer) {
      console.error("Reset view failed: Cesium viewer not initialized");
      return;
    }

    try {
      console.log("Resetting view");

      // Reset zoom and tilt levels
      setCurrentZoom(3000);
      setCurrentTilt(-35);

      // Try multiple approaches to reset the view

      // Approach 1: Use the home button if available
      if (viewer.homeButton && viewer.homeButton.viewModel && typeof viewer.homeButton.viewModel.command === 'function') {
        try {
          viewer.homeButton.viewModel.command();
          console.log("Used home button to reset view");
          return;
        } catch (e) {
          console.warn("Home button approach failed:", e);
        }
      }

      // Approach 2: Use flyTo with default coordinates
      try {
        viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(
            coordinates.longitude || 75.1755,
            coordinates.latitude || 35.3753,
            3000
          ),
          orientation: {
            heading: window.Cesium.Math.toRadians(30),
            pitch: window.Cesium.Math.toRadians(-35),
            roll: 0.0
          },
          duration: 1.0
        });
        console.log("Used flyTo for reset");
        return;
      } catch (e) {
        console.warn("FlyTo approach failed:", e);
      }

      // Approach 3: Direct camera manipulation
      try {
        viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(
            coordinates.longitude || 75.1755,
            coordinates.latitude || 35.3753,
            3000
          ),
          orientation: {
            heading: window.Cesium.Math.toRadians(30),
            pitch: window.Cesium.Math.toRadians(-35),
            roll: 0.0
          }
        });
        console.log("Used setView for reset");
      } catch (e) {
        console.error("All reset approaches failed:", e);
      }
    } catch (error) {
      console.error("Error during reset view:", error);
    }
  };

  return (
    <div className="cesium-viewer-container">
      {loading && (
        <div className="cesium-loading">
          <div className="cesium-spinner"></div>
          <p>Loading 3D Map...</p>
          <p className="text-sm text-gray-300 mt-2">This may take a few moments...</p>
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
              if (viewer) {
                viewer.destroy();
                setViewer(null);
              }
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Retry
          </button>
        </div>
      )}

      {/* Custom controls - only tilt and reset */}
      <div className="cesium-custom-controls">
        {/* Tilt Controls */}
        <div className="cesium-control-group">
          <button
            onClick={handleTiltUp}
            onMouseDown={() => {
              // Start continuous tilting up
              const interval = setInterval(() => {
                if (viewer) {
                  try {
                    viewer.camera.lookUp(0.02);
                  } catch (e) {
                    console.error("Continuous tilt up failed:", e);
                  }
                }
              }, 100);

              // Store the interval ID in a data attribute
              document.body.setAttribute('data-tilt-interval', interval);

              // Add mouseup event listener to stop tilting
              document.addEventListener('mouseup', () => {
                clearInterval(parseInt(document.body.getAttribute('data-tilt-interval')));
                document.body.removeAttribute('data-tilt-interval');
              }, { once: true });
            }}
            className="cesium-zoom-button cesium-tilt-up"
            title="Tilt Up"
            type="button"
          >
            ↑
          </button>
          <button
            onClick={handleTiltDown}
            onMouseDown={() => {
              // Start continuous tilting down
              const interval = setInterval(() => {
                if (viewer) {
                  try {
                    viewer.camera.lookDown(0.02);
                  } catch (e) {
                    console.error("Continuous tilt down failed:", e);
                  }
                }
              }, 100);

              // Store the interval ID in a data attribute
              document.body.setAttribute('data-tilt-interval', interval);

              // Add mouseup event listener to stop tilting
              document.addEventListener('mouseup', () => {
                clearInterval(parseInt(document.body.getAttribute('data-tilt-interval')));
                document.body.removeAttribute('data-tilt-interval');
              }, { once: true });
            }}
            className="cesium-zoom-button cesium-tilt-down"
            title="Tilt Down"
            type="button"
          >
            ↓
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={handleResetView}
          className="cesium-zoom-button cesium-reset-view"
          title="Reset View"
          type="button"
        >
          ⟳
        </button>
      </div>

      <div
        ref={cesiumContainerRef}
        className="cesium-container"
        style={{
          visibility: loading ? "hidden" : "visible",
          height: "80vh",
          minHeight: "700px",
          position: "relative", /* Ensure proper stacking context */
          zIndex: 1 /* Lower than controls but above other elements */
        }}
      ></div>

      <div className="cesium-instructions">
        <h3>How to use 3D View</h3>
        <ul>
          <li>Left click + drag: Rotate the camera</li>
          <li>Right click + drag: Zoom in/out</li>
          <li>Middle click + drag: Pan the camera</li>
          <li>Pinch to zoom: Use two fingers to zoom in and out</li>
          <li>Use the arrow buttons to adjust the viewing angle</li>
          <li>Use the circle button to reset the view</li>
          <li>Click on markers to see detailed information</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleCesiumViewer;
