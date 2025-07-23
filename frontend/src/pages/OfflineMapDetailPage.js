import React from 'react';
import OfflineMap from '../components/maps/OfflineMap';

const OfflineMapDetailPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <OfflineMap />
      </div>
    </div>
  );
};

export default OfflineMapDetailPage;
