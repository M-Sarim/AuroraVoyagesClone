import React, { useState } from 'react';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CultureInfoCard = ({ info }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine icon based on importance
  const getIcon = () => {
    switch (info.importance) {
      case 'essential':
        return <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />;
      case 'recommended':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  // Determine border color based on importance
  const getBorderColor = () => {
    switch (info.importance) {
      case 'essential':
        return 'border-l-amber-500';
      case 'recommended':
        return 'border-l-green-500';
      default:
        return 'border-l-blue-500';
    }
  };

  // Format category for display
  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-card overflow-hidden border-l-4 ${getBorderColor()} transition-all duration-300 hover:shadow-elevated`}
    >
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{info.title}</h3>
            <div className="mt-1 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                info.importance === 'essential' 
                  ? 'bg-amber-100 text-amber-800' 
                  : info.importance === 'recommended'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {info.importance === 'good-to-know' ? 'Good to know' : info.importance}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {formatCategory(info.category)}
              </span>
            </div>
            
            <div className={`mt-3 text-sm text-gray-600 ${expanded ? '' : 'line-clamp-3'}`}>
              {info.description}
            </div>
            
            {info.description.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}

            {/* Seasonal relevance */}
            {info.seasonalRelevance && info.seasonalRelevance.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Seasonal Relevance:</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {info.seasonalRelevance.map((season, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Media */}
            {info.mediaUrls && info.mediaUrls.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {info.mediaUrls.slice(0, 3).map((url, index) => (
                    <img 
                      key={index}
                      src={url} 
                      alt={`${info.title} - media ${index + 1}`}
                      className="h-20 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureInfoCard;
