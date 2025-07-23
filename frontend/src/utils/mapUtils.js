/**
 * Utility functions for maps
 */

/**
 * Opens a location in Google Maps
 * @param {Object} coordinates - The coordinates object with lat and lng properties
 * @param {string} name - Optional name of the location for the marker label
 */
export const openInGoogleMaps = (coordinates, name = '') => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    console.error('Invalid coordinates provided to openInGoogleMaps');
    return;
  }

  // Format the coordinates
  const { lat, lng } = coordinates;
  
  // Create the Google Maps URL
  // If a name is provided, add it as a query parameter
  const url = name 
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  
  // Open the URL in a new tab
  window.open(url, '_blank');
};

/**
 * Opens directions to a location in Google Maps
 * @param {Object} destination - The destination coordinates object with lat and lng properties
 * @param {Object} origin - Optional origin coordinates object with lat and lng properties
 * @param {string} travelMode - Optional travel mode (driving, walking, bicycling, transit)
 */
export const openDirectionsInGoogleMaps = (destination, origin = null, travelMode = 'driving') => {
  if (!destination || !destination.lat || !destination.lng) {
    console.error('Invalid destination coordinates provided to openDirectionsInGoogleMaps');
    return;
  }

  // Format the destination coordinates
  const destCoords = `${destination.lat},${destination.lng}`;
  
  // Base URL for directions
  let url = 'https://www.google.com/maps/dir/?api=1';
  
  // Add destination
  url += `&destination=${destCoords}`;
  
  // Add origin if provided
  if (origin && origin.lat && origin.lng) {
    url += `&origin=${origin.lat},${origin.lng}`;
  }
  
  // Add travel mode
  url += `&travelmode=${travelMode}`;
  
  // Open the URL in a new tab
  window.open(url, '_blank');
};
