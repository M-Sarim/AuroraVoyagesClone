import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMap, isOnline, getCachedImageUrl } from "../../services/mapService";
import InteractiveMap from "./InteractiveMap";
import {
  openInGoogleMaps,
  openDirectionsInGoogleMaps,
} from "../../utils/mapUtils";

const OfflineMap = () => {
  const { id } = useParams();
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [online, setOnline] = useState(isOnline());
  const [showPOIs, setShowPOIs] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const mapContainerRef = useRef(null);
  const mapImageRef = useRef(null);
  const mapDataRef = useRef(null); // Use a ref to track mapData without causing re-renders

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const data = await getMap(id);
        // Update both state and ref
        setMapData(data);
        mapDataRef.current = data;

        // Set the image URL - use cached URL if available, otherwise use the static map URL
        if (data.cachedImageUrl) {
          console.log("Using cached image URL");
          setImageUrl(data.cachedImageUrl);
          setImageError(false); // Reset any image error state
        } else if (data.staticMapUrl) {
          console.log("Using static map URL");
          setImageUrl(data.staticMapUrl);
          setImageError(false); // Reset any image error state
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching map data:", err);
        setError(
          "Failed to load map data. Please make sure you have downloaded this map."
        );
        setLoading(false);
      }
    };

    fetchMapData();

    // Set up online/offline event listeners
    const handleOnline = () => {
      setOnline(true);
      // When coming back online, we can try to use the original URL
      const currentMapData = mapDataRef.current;
      if (currentMapData && currentMapData.staticMapUrl) {
        console.log("Online: Using static map URL");
        setImageUrl(currentMapData.staticMapUrl);
        setImageError(false); // Reset any image error state
      }
    };

    const handleOffline = () => {
      setOnline(false);
      // When going offline, try to get the cached image
      const currentMapData = mapDataRef.current;
      if (currentMapData && currentMapData.staticMapUrl) {
        console.log("Offline: Trying to get cached image");
        getCachedImageUrl(currentMapData.staticMapUrl).then((url) => {
          if (url) {
            console.log("Offline: Found cached image, using it");
            setImageUrl(url);
            setImageError(false); // Reset any image error state
          } else {
            console.log("Offline: No cached image found");
          }
        });
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      // Clean up any object URLs to prevent memory leaks
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]); // Remove mapData from dependencies to prevent refresh loops

  // Handle map image error
  const handleImageError = async () => {
    // Prevent multiple error handling attempts for the same image
    if (imageError) {
      return;
    }

    console.error("Image failed to load:", imageUrl);
    setImageError(true);

    // Get current map data from ref to avoid dependency issues
    const currentMapData = mapDataRef.current;

    // If we're offline and the regular URL failed, try to get the cached version
    if (!online && currentMapData && currentMapData.staticMapUrl) {
      try {
        console.log("Image error: Trying to get cached version");
        const cachedUrl = await getCachedImageUrl(currentMapData.staticMapUrl);

        if (cachedUrl && cachedUrl !== imageUrl) {
          console.log("Image error: Found cached image, using it");
          setImageUrl(cachedUrl);
          setImageError(false);
          return;
        } else {
          console.log(
            "Image error: No cached image found or same as current URL"
          );
        }
      } catch (err) {
        console.error("Error getting cached image:", err);
      }
    }

    // Only set the error state if we couldn't recover with a cached image
    // This prevents the component from re-rendering with the error view
    // Instead, we'll show a placeholder in the image container
    console.log("Image error: Could not recover, showing placeholder");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !mapData) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error || "Map data not found"}</p>
        <Link
          to="/download-maps"
          className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Go to Download Maps
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Map Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{mapData.name}</h2>
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

      {/* Map Container */}
      <div className="relative">
        <div ref={mapContainerRef} className="h-[500px] w-full relative">
          {online || (mapData && mapData.cachedMapData) ? (
            <InteractiveMap
              center={mapData.center}
              zoom={mapData.zoom || 10}
              markers={
                mapData.pointsOfInterest
                  ? mapData.pointsOfInterest.map((poi) => ({
                      position: poi.position,
                      title: poi.name,
                    }))
                  : []
              }
              height="500px"
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-4">
              <p className="text-gray-700 font-medium mb-2">
                Map could not be loaded
              </p>
              <p className="text-gray-500 text-sm text-center mb-4">
                {online
                  ? "There was a problem loading the map. Please try downloading the map again."
                  : "You are currently offline. Please check your internet connection or make sure you've downloaded this map for offline use."}
              </p>
              <Link
                to="/download-maps"
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Go to Download Maps
              </Link>
            </div>
          )}

          {/* Points of Interest */}
          {showPOIs &&
            mapData.pointsOfInterest &&
            mapData.pointsOfInterest.map((poi) => (
              <div
                key={poi.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  // Calculate position based on the map container dimensions and POI coordinates
                  // This is a simplified calculation and would need to be adjusted for real maps
                  left: `${
                    ((poi.position.lng - mapData.center.lng) / 0.1 + 0.5) * 100
                  }%`,
                  top: `${
                    ((mapData.center.lat - poi.position.lat) / 0.1 + 0.5) * 100
                  }%`,
                }}
              >
                <div className="bg-primary-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  <span>POI</span>
                </div>
                <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                  {poi.name}
                </div>
              </div>
            ))}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2">
          <button
            onClick={() => setShowPOIs(!showPOIs)}
            className="p-2 text-gray-700 hover:text-primary-600 focus:outline-none"
            title={
              showPOIs ? "Hide Points of Interest" : "Show Points of Interest"
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Map Information */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Points of Interest
        </h3>
        <ul className="space-y-2">
          {mapData.pointsOfInterest &&
            mapData.pointsOfInterest.map((poi) => (
              <li key={poi.id} className="flex items-start">
                <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  POI
                </span>
                <span>{poi.name}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Link
          to={`/navigation/${id}`}
          className="block w-full bg-primary-600 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Start Navigation
        </Link>

        {/* Google Maps Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() =>
              mapData &&
              mapData.center &&
              openInGoogleMaps(mapData.center, mapData.name)
            }
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-center font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Open in Google Maps
            </div>
          </button>

          <button
            onClick={() =>
              mapData &&
              mapData.center &&
              openDirectionsInGoogleMaps(mapData.center)
            }
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-center font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
              Get Directions
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineMap;
