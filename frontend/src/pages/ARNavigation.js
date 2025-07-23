import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ARViewer from '../components/ar/ARViewer';
import api from '../utils/api';

const ARNavigation = () => {
  const { id } = useParams(); // Destination ID
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arMarkers, setArMarkers] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/destinations/${id}`);
        setDestination(response.data);

        // Create AR markers based on destination attractions
        if (response.data.attractions && response.data.attractions.length > 0) {
          const markers = response.data.attractions.map((attraction, index) => ({
            id: `marker-${index}`,
            type: 'text',
            text: attraction,
            position: { x: 0, y: 0.5, z: 0 }
          }));
          setArMarkers(markers);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError('Failed to load destination details');
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately, we just needed the permission
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
      setShowInstructions(false);
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setError('Camera permission is required for AR navigation');
    }
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link
          to={`/destinations/${id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to Destination
        </Link>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Destination not found</p>
            </div>
          </div>
        </div>
        <Link
          to="/destinations"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* AR View */}
      {cameraPermission ? (
        <ARViewer
          coordinates={destination.coordinates || { latitude: 35.3753, longitude: 75.1755 }}
          name={destination.name}
          attractions={destination.attractions || []}
          markers={arMarkers}
          cesiumIonToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8"
          tilesetId={354307}
        />
      ) : (
        <div className="h-screen bg-gray-900 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AR Navigation for {destination.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Experience {destination.name} in augmented reality. Point your camera at Hiro markers to see attractions and navigation guides.
            </p>
            <button
              onClick={requestCameraPermission}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Start AR Experience
            </button>
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      {cameraPermission && showInstructions && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use AR Navigation</h3>
            <ol className="list-decimal pl-5 mb-6 space-y-2 text-gray-600">
              <li>Print a <a href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500">Hiro marker</a> or display it on another device</li>
              <li>Point your camera at the marker</li>
              <li>AR content will appear above the marker</li>
              <li>Move around to explore different angles</li>
            </ol>
            <div className="flex justify-center mb-4">
              <img
                src="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png"
                alt="Hiro Marker"
                className="w-32 h-32 border border-gray-300"
              />
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      {cameraPermission && !showInstructions && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-white bg-opacity-90 rounded-full shadow-lg px-4 py-2 flex space-x-4">
            <button
              onClick={() => setShowInstructions(true)}
              className="p-2 text-gray-600 hover:text-primary-600"
              title="Help"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <Link
              to={`/destinations/${id}`}
              className="p-2 text-gray-600 hover:text-primary-600"
              title="Back to Destination"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-600 hover:text-primary-600"
              title="Reload AR"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARNavigation;
