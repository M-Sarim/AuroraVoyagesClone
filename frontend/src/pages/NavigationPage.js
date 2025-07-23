import React from 'react';
import Navigation from '../components/maps/Navigation';

const NavigationPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Turn-by-Turn Navigation</h1>
        <p className="text-lg text-gray-600 mb-8">
          Navigate to your destination with step-by-step directions, even when offline.
        </p>
        <Navigation />
      </div>
    </div>
  );
};

export default NavigationPage;
