import React from 'react';
import DownloadMaps from '../components/maps/DownloadMaps';

const DownloadMapsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Download Maps</h1>
        <p className="text-lg text-gray-600 mb-8">
          Download maps for offline use. Access your favorite destinations even without an internet connection.
        </p>
        <DownloadMaps />
      </div>
    </div>
  );
};

export default DownloadMapsPage;
