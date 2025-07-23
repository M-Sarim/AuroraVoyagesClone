import React, { useState } from 'react';

const SortingOptions = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Viewed' }
  ];

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort By';

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-xl bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-5 h-5 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
        </svg>
        {currentSortLabel}
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentSort === option.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingOptions;
