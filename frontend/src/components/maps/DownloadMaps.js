import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { downloadMap, getDownloadedMaps, removeDownloadedMap } from '../../services/mapService';
import { getStoredMapsSize } from '../../utils/indexedDB';

const DownloadMaps = () => {
  const [destinations, setDestinations] = useState([]);
  const [downloadedMaps, setDownloadedMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all destinations
        const destinationsResponse = await api.get('/destinations');
        setDestinations(destinationsResponse.data);
        
        // Get already downloaded maps
        const maps = await getDownloadedMaps();
        setDownloadedMaps(maps);
        
        // Get storage usage
        const size = await getStoredMapsSize();
        setStorageUsed(size);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load destinations');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDownload = async (destinationId) => {
    try {
      // Set progress state
      setDownloadProgress(prev => ({
        ...prev,
        [destinationId]: { status: 'downloading', progress: 0 }
      }));
      
      // Simulate progress (in a real app, you'd track actual download progress)
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const currentProgress = prev[destinationId]?.progress || 0;
          if (currentProgress < 90) {
            return {
              ...prev,
              [destinationId]: { status: 'downloading', progress: currentProgress + 10 }
            };
          }
          return prev;
        });
      }, 300);
      
      // Download the map
      const result = await downloadMap(destinationId);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        // Update progress to complete
        setDownloadProgress(prev => ({
          ...prev,
          [destinationId]: { status: 'complete', progress: 100 }
        }));
        
        // Update downloaded maps list
        const maps = await getDownloadedMaps();
        setDownloadedMaps(maps);
        
        // Update storage usage
        const size = await getStoredMapsSize();
        setStorageUsed(size);
        
        // Clear progress after a delay
        setTimeout(() => {
          setDownloadProgress(prev => {
            const newState = { ...prev };
            delete newState[destinationId];
            return newState;
          });
        }, 2000);
      } else {
        // Update progress to error
        setDownloadProgress(prev => ({
          ...prev,
          [destinationId]: { status: 'error', progress: 0 }
        }));
      }
    } catch (err) {
      console.error('Error downloading map:', err);
      setDownloadProgress(prev => ({
        ...prev,
        [destinationId]: { status: 'error', progress: 0 }
      }));
    }
  };

  const handleRemove = async (destinationId) => {
    try {
      const result = await removeDownloadedMap(destinationId);
      
      if (result.success) {
        // Update downloaded maps list
        const maps = await getDownloadedMaps();
        setDownloadedMaps(maps);
        
        // Update storage usage
        const size = await getStoredMapsSize();
        setStorageUsed(size);
      }
    } catch (err) {
      console.error('Error removing map:', err);
    }
  };

  const isMapDownloaded = (destinationId) => {
    return downloadedMaps.some(map => map.id === destinationId);
  };

  const formatStorageSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Download Maps for Offline Use</h2>
        <div className="text-sm text-gray-500">
          Storage used: {formatStorageSize(storageUsed)}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Download maps to use them when you're offline. Downloaded maps will be available in the Offline Maps section.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map(destination => {
          const isDownloaded = isMapDownloaded(destination._id);
          const downloadState = downloadProgress[destination._id];
          
          return (
            <div key={destination._id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                {destination.images && destination.images[0] ? (
                  <img
                    src={`/images/${destination.images[0]}`}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{destination.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{destination.country}</p>
                
                {downloadState?.status === 'downloading' && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${downloadState.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Downloading... {downloadState.progress}%</p>
                  </div>
                )}
                
                {downloadState?.status === 'error' && (
                  <p className="text-xs text-red-500 mb-4">Download failed. Please try again.</p>
                )}
                
                <div className="flex space-x-2">
                  {isDownloaded ? (
                    <>
                      <Link
                        to={`/offline-maps/${destination._id}`}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-center"
                      >
                        View Offline
                      </Link>
                      <button
                        onClick={() => handleRemove(destination._id)}
                        className="bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDownload(destination._id)}
                      disabled={downloadState?.status === 'downloading'}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Download Map
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {downloadedMaps.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Downloaded Maps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloadedMaps.map(map => (
              <div key={map.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{map.name}</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Downloaded: {new Date(map.timestamp).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <Link
                    to={`/offline-maps/${map.id}`}
                    className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(map.id)}
                    className="bg-white text-gray-700 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadMaps;
