import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with webpack
// This is needed because webpack doesn't handle Leaflet's assets correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/**
 * InteractiveMap component for displaying interactive maps using LocationIQ and Leaflet
 *
 * @param {Object} props
 * @param {Object} props.center - Center coordinates {lat, lng}
 * @param {number} props.zoom - Zoom level
 * @param {Array} props.markers - Array of marker objects with position, title, etc.
 * @param {Object} props.route - Route data from Google Directions API
 * @param {string} props.height - Height of the map container (default: 400px)
 * @param {string} props.width - Width of the map container (default: 100%)
 * @param {boolean} props.showAttribution - Whether to show attribution (default: true)
 * @param {Function} props.onMapReady - Callback when map is ready
 */
const InteractiveMap = ({
  center = { lat: 35.3753, lng: 75.1755 }, // Default to Pakistan
  zoom = 8,
  markers = [],
  route = null,
  height = "400px",
  width = "100%",
  showAttribution = true,
  onMapReady = null,
}) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef([]);
  const routeLayerRef = useRef(null);

  const containerStyle = {
    width: width,
    height: height,
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Get LocationIQ API key from environment variables
    const locationIqApiKey = process.env.REACT_APP_LOCATIONIQ_API_KEY;

    // Create map if it doesn't exist yet
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lng],
        zoom
      );

      // Add LocationIQ tile layer
      L.tileLayer(
        `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${locationIqApiKey}`,
        {
          attribution: showAttribution
            ? '&copy; <a href="https://locationiq.com/">LocationIQ</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            : "",
          maxZoom: 18,
        }
      ).addTo(leafletMapRef.current);

      // Call onMapReady callback if provided
      if (onMapReady && typeof onMapReady === "function") {
        onMapReady(leafletMapRef.current);
      }
    } else {
      // Update map view if it already exists
      leafletMapRef.current.setView([center.lat, center.lng], zoom);
    }

    // Clean up function
    return () => {
      // Clean up will happen in the component unmount effect
    };
  }, [center, zoom, onMapReady, showAttribution]);

  // Handle markers
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Clear existing markers
    markersLayerRef.current.forEach((marker) => {
      if (leafletMapRef.current) {
        marker.remove();
      }
    });
    markersLayerRef.current = [];

    // Add new markers
    if (markers && markers.length > 0) {
      markers.forEach((marker) => {
        const leafletMarker = L.marker([
          marker.position.lat,
          marker.position.lng,
        ])
          .addTo(leafletMapRef.current)
          .bindPopup(marker.title || "");

        markersLayerRef.current.push(leafletMarker);
      });
    } else if (center) {
      // Add a marker at the center if no markers provided
      const leafletMarker = L.marker([center.lat, center.lng])
        .addTo(leafletMapRef.current)
        .bindPopup("Center");

      markersLayerRef.current.push(leafletMarker);
    }
  }, [markers, center]);

  // Handle route
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Add route if available
    if (route && route.routes && route.routes.length > 0) {
      try {
        console.log("Drawing route on map:", route);

        // Check if we have LocationIQ response data
        if (
          route.locationiq_response &&
          route.locationiq_response.routes &&
          route.locationiq_response.routes.length > 0
        ) {
          console.log("Using LocationIQ route data");

          // Get the route path from LocationIQ response
          const locationIQRoute = route.locationiq_response.routes[0];
          console.log("LocationIQ route:", locationIQRoute);

          // Check if we have geometry coordinates
          if (
            locationIQRoute.geometry &&
            locationIQRoute.geometry.coordinates
          ) {
            console.log(
              "Found geometry coordinates:",
              locationIQRoute.geometry
            );

            // LocationIQ returns coordinates in [lng, lat] format, but Leaflet needs [lat, lng]
            let path = [];

            // Handle different geometry types
            if (locationIQRoute.geometry.type === "LineString") {
              console.log("Geometry type: LineString");
              path = locationIQRoute.geometry.coordinates.map((coord) => [
                coord[1],
                coord[0],
              ]);
            } else if (locationIQRoute.geometry.type === "MultiLineString") {
              console.log("Geometry type: MultiLineString");
              // Flatten the multi-line string
              path = locationIQRoute.geometry.coordinates
                .flat()
                .map((coord) => [coord[1], coord[0]]);
            } else {
              console.log(
                "Unknown geometry type:",
                locationIQRoute.geometry.type
              );
              // Try to handle it anyway
              if (Array.isArray(locationIQRoute.geometry.coordinates)) {
                if (Array.isArray(locationIQRoute.geometry.coordinates[0])) {
                  if (
                    Array.isArray(locationIQRoute.geometry.coordinates[0][0])
                  ) {
                    console.log("Detected nested array structure, flattening");
                    // It's likely a multi-line string
                    path = locationIQRoute.geometry.coordinates
                      .flat()
                      .map((coord) => [coord[1], coord[0]]);
                  } else {
                    console.log("Detected simple array structure");
                    // It's likely a line string
                    path = locationIQRoute.geometry.coordinates.map((coord) => [
                      coord[1],
                      coord[0],
                    ]);
                  }
                }
              }
            }

            console.log("Processed path:", path);

            if (path.length > 0) {
              routeLayerRef.current = L.polyline(path, {
                color: "blue",
                weight: 5,
                opacity: 0.7,
              }).addTo(leafletMapRef.current);

              // Fit the map to the route bounds
              leafletMapRef.current.fitBounds(
                routeLayerRef.current.getBounds(),
                {
                  padding: [50, 50],
                }
              );
            }
          } else {
            console.error("No geometry coordinates in LocationIQ route");
          }
        } else {
          // Try Google Maps API format as fallback
          console.log("Trying Google Maps API format");

          // Get the route path
          const path = route.routes[0].legs.flatMap((leg) =>
            leg.steps.flatMap((step) => {
              if (step.polyline && step.polyline.points) {
                return decodePolyline(step.polyline.points);
              } else if (step.polyline && Array.isArray(step.polyline.points)) {
                // Handle case where points is already an array of coordinates
                return step.polyline.points.map((point) => {
                  // Check if point is in [lng, lat] format (LocationIQ) and convert to [lat, lng] (Leaflet)
                  if (Array.isArray(point) && point.length === 2) {
                    return [point[1], point[0]];
                  }
                  return point;
                });
              }
              return [];
            })
          );

          // If we have a path, create a polyline
          if (path.length > 0) {
            routeLayerRef.current = L.polyline(path, {
              color: "blue",
              weight: 5,
              opacity: 0.7,
            }).addTo(leafletMapRef.current);

            // Fit the map to the route bounds
            leafletMapRef.current.fitBounds(routeLayerRef.current.getBounds(), {
              padding: [50, 50],
            });
          } else if (
            route.routes[0].overview_polyline &&
            route.routes[0].overview_polyline.points
          ) {
            // Try using the overview polyline if step polylines aren't available
            if (Array.isArray(route.routes[0].overview_polyline.points)) {
              // Handle case where points is already an array of coordinates
              const overviewPath = route.routes[0].overview_polyline.points.map(
                (point) => {
                  // Check if point is in [lng, lat] format (LocationIQ) and convert to [lat, lng] (Leaflet)
                  if (Array.isArray(point) && point.length === 2) {
                    return [point[1], point[0]];
                  }
                  return point;
                }
              );

              if (overviewPath.length > 0) {
                routeLayerRef.current = L.polyline(overviewPath, {
                  color: "blue",
                  weight: 5,
                  opacity: 0.7,
                }).addTo(leafletMapRef.current);

                // Fit the map to the route bounds
                leafletMapRef.current.fitBounds(
                  routeLayerRef.current.getBounds(),
                  {
                    padding: [50, 50],
                  }
                );
              }
            } else {
              // Handle encoded polyline string
              const overviewPath = decodePolyline(
                route.routes[0].overview_polyline.points
              );

              if (overviewPath.length > 0) {
                routeLayerRef.current = L.polyline(overviewPath, {
                  color: "blue",
                  weight: 5,
                  opacity: 0.7,
                }).addTo(leafletMapRef.current);

                // Fit the map to the route bounds
                leafletMapRef.current.fitBounds(
                  routeLayerRef.current.getBounds(),
                  {
                    padding: [50, 50],
                  }
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error adding route to map:", error);
      }
    }
  }, [route]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Function to decode Google's encoded polyline format
  const decodePolyline = (encoded) => {
    if (!encoded) return [];

    const poly = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push([lat * 1e-5, lng * 1e-5]);
    }

    return poly;
  };

  return (
    <div style={containerStyle} className="rounded-lg overflow-hidden">
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg"
      />
    </div>
  );
};

export default React.memo(InteractiveMap);
