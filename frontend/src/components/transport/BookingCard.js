import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking, onCancel }) => {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format short date (without time)
  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get icon for transport type
  const getTransportIcon = (type) => {
    switch (type) {
      case 'flight':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'bus':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'train':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        );
      case 'car_rental':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'shuttle':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5m0 0v5m0-5l-6 6M8 21H3m0 0v-5m0 5l6-6" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        );
    }
  };

  // Check if booking can be cancelled
  const canCancel = () => {
    return booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  // Get primary transport (first one in the list)
  const primaryTransport = booking.transport && booking.transport.length > 0 
    ? booking.transport[0] 
    : null;

  if (!primaryTransport) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Booking ID and Status */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">Booking #{booking._id.substring(booking._id.length - 8)}</h3>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Booked on {formatShortDate(booking.createdAt)}</p>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold text-primary-600 mb-2">
              ${booking.totalPrice}
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/bookings/${booking._id}`}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Details
              </Link>
              {canCancel() && (
                <button
                  onClick={() => setShowConfirmCancel(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transport Summary */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                {getTransportIcon(primaryTransport.type)}
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">{primaryTransport.name}</h4>
              <div className="text-sm text-gray-500">
                {primaryTransport.provider} • {primaryTransport.type.charAt(0).toUpperCase() + primaryTransport.type.slice(1).replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">From</div>
              <div className="text-sm font-medium text-gray-900">{primaryTransport.origin}</div>
              <div className="text-sm text-gray-500">{formatDate(primaryTransport.departureTime)}</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-0.5 bg-gray-300">
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">To</div>
              <div className="text-sm font-medium text-gray-900">{primaryTransport.destination}</div>
              <div className="text-sm text-gray-500">{formatDate(primaryTransport.arrivalTime)}</div>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="mt-4 flex flex-wrap gap-x-4 text-sm text-gray-500">
            <div>
              <span className="font-medium text-gray-700">Passengers:</span> {booking.passengers || 1}
            </div>
            <div>
              <span className="font-medium text-gray-700">Contact:</span> {booking.contactName}
            </div>
          </div>

          {/* Show More Button (if multiple transports) */}
          {booking.transport.length > 1 && (
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
              >
                {isExpanded ? 'Show Less' : `Show ${booking.transport.length - 1} More Transport Options`}
                <svg
                  className={`ml-1 h-5 w-5 transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Additional Transports */}
          {isExpanded && booking.transport.length > 1 && (
            <div className="mt-4 space-y-4">
              {booking.transport.slice(1).map((transport, index) => (
                <div key={index} className="border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        {getTransportIcon(transport.type)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-900">{transport.name}</h5>
                      <div className="text-xs text-gray-500">
                        {transport.provider} • {transport.type.charAt(0).toUpperCase() + transport.type.slice(1).replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">From</div>
                      <div className="font-medium text-gray-900">{transport.origin}</div>
                      <div className="text-gray-500">{formatDate(transport.departureTime)}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative w-12 h-0.5 bg-gray-300">
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">To</div>
                      <div className="font-medium text-gray-900">{transport.destination}</div>
                      <div className="text-gray-500">{formatDate(transport.arrivalTime)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowConfirmCancel(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    onCancel();
                    setShowConfirmCancel(false);
                  }}
                >
                  Cancel Booking
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmCancel(false)}
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
