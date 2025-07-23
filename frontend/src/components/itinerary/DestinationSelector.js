import React, { useState } from "react";

const DestinationSelector = ({ destinations, onSelectDestination }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Filter destinations based on search term and selected type
  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? destination.type === selectedType : true;

    return matchesSearch && matchesType;
  });

  // Get unique destination types
  const destinationTypes = [...new Set(destinations.map((dest) => dest.type))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search-destination" className="sr-only">
            Search destinations
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search destinations"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="sm:w-64">
          <label htmlFor="destination-type" className="sr-only">
            Filter by type
          </label>
          <select
            id="destination-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            {destinationTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.map((destination) => (
          <div
            key={destination._id}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={
                  destination.images && destination.images.length > 0
                    ? destination.images[0].startsWith("/")
                      ? destination.images[0]
                      : `/images/${destination.images[0]}`
                    : destination.name === "Skardu"
                    ? "/images/skardu_1.jpg"
                    : "/images/placeholder.jpg"
                }
                alt={destination.name}
              />
            </div>
            <div className="flex-1 min-w-0">
              <a
                href="#"
                className="focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectDestination(destination._id);
                }}
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  {destination.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {destination.country}
                </p>
              </a>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {destination.type}
              </span>
            </div>
          </div>
        ))}

        {filteredDestinations.length === 0 && (
          <div className="sm:col-span-3 p-4 text-center">
            <p className="text-gray-500">
              No destinations found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationSelector;
