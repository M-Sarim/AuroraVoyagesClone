import React, { useState } from 'react';

const BookingSort = ({ activeSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { id: 'date-desc', label: 'Newest First' },
    { id: 'date-asc', label: 'Oldest First' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'price-asc', label: 'Price: Low to High' }
  ];

  const currentOption = sortOptions.find(option => option.id === activeSort) || sortOptions[0];

  return (
    <div className="relative">
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">Sort:</span>
        <button
          type="button"
          className="inline-flex justify-between items-center w-44 rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentOption.label}
          <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  onSortChange(option.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-xs ${
                  activeSort === option.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default BookingSort;
