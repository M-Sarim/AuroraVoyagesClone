// IndexedDB utility for offline map storage

// Database configuration
const DB_NAME = 'aurora_voyages_db';
const DB_VERSION = 1;
const MAPS_STORE = 'offline_maps';

// Initialize the database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      console.log('IndexedDB opened successfully');
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(MAPS_STORE)) {
        const mapsStore = db.createObjectStore(MAPS_STORE, { keyPath: 'id' });
        mapsStore.createIndex('name', 'name', { unique: false });
        console.log('Maps store created');
      }
    };
  });
};

// Save map data to IndexedDB
export const saveMapData = async (mapData) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MAPS_STORE], 'readwrite');
      const store = transaction.objectStore(MAPS_STORE);
      
      // Add timestamp for cache management
      const dataToStore = {
        ...mapData,
        timestamp: Date.now()
      };
      
      const request = store.put(dataToStore);
      
      request.onsuccess = () => {
        console.log(`Map data saved for: ${mapData.name}`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error saving map data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to save map data:', error);
    throw error;
  }
};

// Get map data from IndexedDB
export const getMapData = async (mapId) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MAPS_STORE], 'readonly');
      const store = transaction.objectStore(MAPS_STORE);
      const request = store.get(mapId);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log(`Map data retrieved for: ${mapId}`);
          resolve(request.result);
        } else {
          console.log(`No map data found for: ${mapId}`);
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving map data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to get map data:', error);
    throw error;
  }
};

// Get all saved maps
export const getAllMaps = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MAPS_STORE], 'readonly');
      const store = transaction.objectStore(MAPS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => {
        console.log(`Retrieved ${request.result.length} saved maps`);
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving all maps:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to get all maps:', error);
    throw error;
  }
};

// Delete map data
export const deleteMapData = async (mapId) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MAPS_STORE], 'readwrite');
      const store = transaction.objectStore(MAPS_STORE);
      const request = store.delete(mapId);
      
      request.onsuccess = () => {
        console.log(`Map data deleted for: ${mapId}`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error deleting map data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to delete map data:', error);
    throw error;
  }
};

// Check if a map is already downloaded
export const isMapDownloaded = async (mapId) => {
  try {
    const mapData = await getMapData(mapId);
    return !!mapData;
  } catch (error) {
    console.error('Error checking if map is downloaded:', error);
    return false;
  }
};

// Get the total size of stored maps (in bytes)
export const getStoredMapsSize = async () => {
  try {
    const maps = await getAllMaps();
    // Estimate size by converting to JSON string and measuring length
    const totalSize = maps.reduce((size, map) => {
      return size + JSON.stringify(map).length;
    }, 0);
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating maps storage size:', error);
    return 0;
  }
};
