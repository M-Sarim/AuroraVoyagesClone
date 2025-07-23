import React from "react";
import InteractiveMap from "./InteractiveMap";

const defaultCenter = {
  lat: 35.3753, // Default to Pakistan
  lng: 75.1755,
};

/**
 * LocationIQMap component for displaying interactive maps using LocationIQ and Leaflet
 * This is a wrapper around the InteractiveMap component for backward compatibility
 *
 * @param {Object} props
 * @param {Object} props.center - Center coordinates {lat, lng}
 * @param {number} props.zoom - Zoom level
 * @param {Array} props.markers - Array of marker objects with position, title, etc.
 * @param {Object} props.route - Route data from Google Directions API
 * @param {string} props.height - Height of the map container (default: 400px)
 * @param {string} props.width - Width of the map container (default: 100%)
 */
const LocationIQMap = ({
  center = defaultCenter,
  zoom = 8,
  markers = [],
  route = null,
  height = "400px",
  width = "100%",
}) => {
  return (
    <InteractiveMap
      center={center}
      zoom={zoom}
      markers={markers}
      route={route}
      height={height}
      width={width}
    />
  );
};

export default React.memo(LocationIQMap);
