import React, { useState } from 'react';
import { DocumentTextIcon, ExclamationTriangleIcon, CurrencyDollarIcon, ClockIcon, CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

const RegulationCard = ({ requirement }) => {
  const [expanded, setExpanded] = useState(false);

  // Format type for display
  const formatType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get icon based on requirement type
  const getIcon = () => {
    switch (requirement.type) {
      case 'visa':
        return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
      case 'permit':
        return <DocumentTextIcon className="h-6 w-6 text-green-500" />;
      case 'vaccination':
        return <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get border color based on requirement type
  const getBorderColor = () => {
    switch (requirement.type) {
      case 'visa':
        return 'border-l-blue-500';
      case 'permit':
        return 'border-l-green-500';
      case 'vaccination':
        return 'border-l-amber-500';
      default:
        return 'border-l-gray-500';
    }
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
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">{requirement.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                requirement.isRequired 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {requirement.isRequired ? 'Required' : 'Optional'}
              </span>
            </div>
            
            <div className="mt-1 text-sm text-gray-500">
              {formatType(requirement.type)}
            </div>
            
            <div className={`mt-3 text-sm text-gray-600 ${expanded ? '' : 'line-clamp-3'}`}>
              {requirement.description}
            </div>
            
            {requirement.description.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}

            {/* Additional details */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              {/* Cost */}
              {requirement.cost && requirement.cost.amount > 0 && (
                <div className="flex items-center text-sm">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                  <span className="text-gray-700">
                    Cost: {requirement.cost.amount} {requirement.cost.currency}
                  </span>
                </div>
              )}
              
              {/* Processing time */}
              {requirement.processingTime && (
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                  <span className="text-gray-700">
                    Processing time: {requirement.processingTime}
                  </span>
                </div>
              )}
              
              {/* Validity period */}
              {requirement.validityPeriod && (
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                  <span className="text-gray-700">
                    Validity: {requirement.validityPeriod}
                  </span>
                </div>
              )}
              
              {/* Application URL */}
              {requirement.applicationUrl && (
                <div className="flex items-center text-sm">
                  <LinkIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                  <a 
                    href={requirement.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Official application website
                  </a>
                </div>
              )}
            </div>

            {/* Seasonal restrictions */}
            {requirement.seasonalRestrictions && requirement.seasonalRestrictions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Seasonal Restrictions:</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {requirement.seasonalRestrictions.map((season, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationCard;
