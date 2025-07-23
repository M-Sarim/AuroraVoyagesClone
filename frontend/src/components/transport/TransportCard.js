import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TransportCard = ({ transport, onBookNow }) => {
  const { isAuthenticated } = useAuth();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get icon for transport type
  const getTransportIcon = (type) => {
    switch (type) {
      case "flight":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "bus":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        );
      case "train":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case "car_rental":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        );
      case "shuttle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Transport Type and Provider */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                {getTransportIcon(transport.type)}
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {transport.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>{transport.provider}</span>
                <span className="mx-2">•</span>
                <span>
                  {transport.type.charAt(0).toUpperCase() +
                    transport.type.slice(1).replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Price and Book Now Button */}
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold text-primary-600 mb-2">
              PKR {transport.price.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/transport/${transport._id}`}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Details
              </Link>
              <button
                onClick={() => onBookNow(transport)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={!isAuthenticated}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Route and Times */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {transport.origin}
                </div>
                <div className="text-gray-500">
                  {formatDate(transport.departureTime)}
                </div>
              </div>
              <div className="mx-4 border-t-2 border-gray-300 w-10 sm:w-20"></div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {transport.destination}
                </div>
                <div className="text-gray-500">
                  {formatDate(transport.arrivalTime)}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span>{transport.availableSeats} seats available</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {transport.description && (
          <div className="mt-4 text-sm text-gray-600">
            <p>{transport.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportCard;
