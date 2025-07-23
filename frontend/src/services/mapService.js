import api from "../utils/api";
import {
  saveMapData,
  getMapData,
  getAllMaps,
  deleteMapData,
  isMapDownloaded,
} from "../utils/indexedDB";

// Fallback image to use when no map image is available
const FALLBACK_MAP_IMAGE = "/images/map-placeholder.jpg";

// Fetch map data from API
export const fetchMapData = async (destinationId) => {
  try {
    const response = await api.get(`/maps/region/${destinationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw error;
  }
};

// Fetch map data for multiple destinations
export const fetchMultipleMapData = async (destinationIds) => {
  try {
    const response = await api.post("/maps/regions", { destinationIds });
    return response.data;
  } catch (error) {
    console.error("Error fetching multiple map data:", error);
    throw error;
  }
};

// Download map for offline use
export const downloadMap = async (destinationId) => {
  try {
    // Check if already downloaded
    const isDownloaded = await isMapDownloaded(destinationId);
    if (isDownloaded) {
      console.log("Map already downloaded");

      // Even if already downloaded, ensure the image is cached
      const mapData = await getMapData(destinationId);
      if (mapData && mapData.staticMapUrl) {
        // Check if image is already in cache
        const cache = await caches.open("map-images-cache");
        const cachedResponse = await cache.match(mapData.staticMapUrl);

        if (!cachedResponse) {
          console.log("Re-caching map image");
          await cacheMapImage(mapData.staticMapUrl);
        }
      }

      return { success: true, message: "Map already downloaded" };
    }

    // Fetch map data
    const mapData = await fetchMapData(destinationId);

    // Save to IndexedDB
    await saveMapData(mapData);

    // Prefetch and cache the static map image
    let imageCached = false;
    if (mapData.staticMapUrl) {
      imageCached = await cacheMapImage(mapData.staticMapUrl);
    }

    if (!imageCached) {
      return {
        success: true,
        message:
          "Map data downloaded, but the map image could not be cached. The map may not work offline.",
      };
    }

    return { success: true, message: "Map downloaded successfully" };
  } catch (error) {
    console.error("Error downloading map:", error);
    return { success: false, message: "Failed to download map" };
  }
};

// Cache map image for offline use
const cacheMapImage = async (imageUrl) => {
  try {
    // First check if the image is already cached
    const cache = await caches.open("map-images-cache");
    const existingCache = await cache.match(imageUrl);

    if (existingCache) {
      console.log("Image already in cache, skipping fetch");
      return true;
    }

    // Fetch with a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log("Fetching image to cache:", imageUrl);
      const response = await fetch(imageUrl, {
        signal: controller.signal,
        mode: "cors", // Try with CORS mode
        cache: "no-cache", // Don't use browser cache, we want a fresh response
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Create a new response to cache (can't use the original after reading its body)
      const blob = await response.blob();
      const newResponse = new Response(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      await cache.put(imageUrl, newResponse);
      console.log("Map image cached successfully");
      return true;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Error fetching image:", fetchError);

      // Try one more time with no-cors mode as fallback
      try {
        console.log("Retrying with no-cors mode");
        const fallbackResponse = await fetch(imageUrl, { mode: "no-cors" });
        await cache.put(imageUrl, fallbackResponse);
        console.log("Map image cached successfully with no-cors");
        return true;
      } catch (fallbackError) {
        console.error("Fallback caching also failed:", fallbackError);
        return false;
      }
    }
  } catch (error) {
    console.error("Error in cache operation:", error);
    return false;
  }
};

// Get cached image as blob URL
export const getCachedImageUrl = async (imageUrl) => {
  try {
    console.log("Looking for cached image:", imageUrl);

    // Check if we have a valid URL
    if (!imageUrl || typeof imageUrl !== "string") {
      console.error("Invalid image URL provided:", imageUrl);
      return null;
    }

    // Try to open the cache
    const cache = await caches.open("map-images-cache");

    // Look for the image in the cache
    const cachedResponse = await cache.match(imageUrl);

    if (cachedResponse && cachedResponse.ok) {
      console.log("Found cached image, converting to blob URL");
      try {
        // Convert the cached response to a blob and create an object URL
        const blob = await cachedResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        console.log("Created blob URL:", objectUrl);
        return objectUrl;
      } catch (blobError) {
        console.error("Error creating blob URL:", blobError);
        return null;
      }
    } else {
      console.log("No valid cached response found for:", imageUrl);

      // List all cached URLs for debugging
      const keys = await cache.keys();
      console.log(
        "Available cached URLs:",
        keys.map((req) => req.url)
      );

      return null; // No cached image found
    }
  } catch (error) {
    console.error("Error retrieving cached image:", error);
    return null;
  }
};

// Get map data (tries offline first, then online)
export const getMap = async (destinationId) => {
  try {
    // Try to get from IndexedDB first
    const offlineMap = await getMapData(destinationId);

    if (offlineMap) {
      console.log("Using offline map data");

      // Check if we need to get a cached image
      if (offlineMap.staticMapUrl) {
        // Try to get cached image regardless of online status
        // This ensures we use cached images when available even if online
        const cachedImageUrl = await getCachedImageUrl(offlineMap.staticMapUrl);

        if (cachedImageUrl) {
          console.log("Found cached image for map");
          // Return a modified map data with the cached image URL
          return {
            ...offlineMap,
            cachedImageUrl: cachedImageUrl,
          };
        } else if (!navigator.onLine) {
          // If we're offline and don't have a cached image, use the fallback
          console.log("Offline with no cached image, using fallback");
          return {
            ...offlineMap,
            cachedImageUrl: FALLBACK_MAP_IMAGE,
          };
        }
      }

      return offlineMap;
    }

    // If not available offline, fetch from API
    console.log("No offline data, fetching from API");
    const mapData = await fetchMapData(destinationId);

    // Try to cache the image immediately if we're online
    if (navigator.onLine && mapData.staticMapUrl) {
      console.log("Caching map image after fetching data");
      cacheMapImage(mapData.staticMapUrl).catch((err) => {
        console.error("Failed to cache map image after fetch:", err);
      });
    }

    return mapData;
  } catch (error) {
    console.error("Error getting map:", error);
    throw error;
  }
};

// Get all downloaded maps
export const getDownloadedMaps = async () => {
  try {
    return await getAllMaps();
  } catch (error) {
    console.error("Error getting downloaded maps:", error);
    return [];
  }
};

// Delete a downloaded map
export const removeDownloadedMap = async (destinationId) => {
  try {
    await deleteMapData(destinationId);
    return { success: true, message: "Map removed successfully" };
  } catch (error) {
    console.error("Error removing map:", error);
    return { success: false, message: "Failed to remove map" };
  }
};

// Get directions between two points
export const getDirections = async (origin, destination, mode = "driving") => {
  try {
    console.log(
      `mapService: Getting directions from ${origin} to ${destination} via ${mode}`
    );

    // Make the API call
    console.log("mapService: Making API call to /maps/directions");
    const response = await api.get("/maps/directions", {
      params: { origin, destination, mode },
    });

    console.log("mapService: API call successful, status:", response.status);
    console.log("mapService: Response data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error getting directions:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// Check if the device is online
export const isOnline = () => {
  return navigator.onLine;
};
