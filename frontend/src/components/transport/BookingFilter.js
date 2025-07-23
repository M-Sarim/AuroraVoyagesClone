import React from 'react';

const BookingFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Bookings' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="flex items-center space-x-2 mb-4 sm:mb-0">
      <span className="text-sm text-gray-500">Status:</span>
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              activeFilter === filter.id
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilter;
