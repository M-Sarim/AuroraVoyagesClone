import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDownloadedMaps } from '../services/mapService';

const OfflineMapsPage = () => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        setLoading(true);
        const downloadedMaps = await getDownloadedMaps();
        setMaps(downloadedMaps);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching downloaded maps:', err);
        setError('Failed to load your offline maps');
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600 p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Offline Maps</h1>
        
        {maps.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">No offline maps found</h2>
            <p className="mt-1 text-sm text-gray-500">
              You haven't downloaded any maps for offline use yet.
            </p>
            <div className="mt-6">
              <Link
                to="/download-maps"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Download Maps
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {maps.map((map) => (
              <Link
                key={map.id}
                to={`/offline-maps/${map.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-40 bg-gray-200 relative">
                  {map.staticMapUrl ? (
                    <img
                      src={map.staticMapUrl}
                      alt={`Map of ${map.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <span className="text-gray-400">Map Preview</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-white font-bold text-lg">{map.name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Downloaded: {new Date(map.timestamp).toLocaleDateString()}
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Offline
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {map.pointsOfInterest?.length || 0} points of interest
                    </span>
                    <span className="text-primary-600 text-sm font-medium">View Map →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineMapsPage;
