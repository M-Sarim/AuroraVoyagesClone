import React from 'react';

const TransportSearch = ({ searchParams, destinations, handleInputChange, handleSearch }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Origin */}
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={searchParams.origin}
              onChange={handleInputChange}
              placeholder="City or location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              list="originList"
            />
            <datalist id="originList">
              {destinations.map(destination => (
                <option key={`origin-${destination._id}`} value={destination.name} />
              ))}
            </datalist>
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={searchParams.destination}
              onChange={handleInputChange}
              placeholder="City or location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              list="destinationList"
            />
            <datalist id="destinationList">
              {destinations.map(destination => (
                <option key={`dest-${destination._id}`} value={destination.name} />
              ))}
            </datalist>
          </div>

          {/* Departure Date */}
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransportSearch;
