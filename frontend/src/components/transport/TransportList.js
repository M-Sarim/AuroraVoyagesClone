import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TransportBookingModal from "./TransportBookingModal";
import BookingSuccessModal from "./BookingSuccessModal";

const TransportList = ({ transports, onBookingSuccess, onBookingError }) => {
  const { isAuthenticated } = useAuth();
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate duration between departure and arrival
  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return "N/A";

    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = arrival - departure;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Get icon for transport type
  const getTransportIcon = (type) => {
    switch (type) {
      case "flight":
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        );
      case "bus":
        return (
          <svg
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
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
        );
      case "car_rental":
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case "shuttle":
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 3h5m0 0v5m0-5l-6 6M8 21H3m0 0v-5m0 5l6-6"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        );
    }
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
  };

  return (
    <div className="space-y-6">
      {transports.map((transport) => (
        <div
          key={transport._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
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
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                      {formatTypeName(transport.type)}
                    </span>
                    <span>{transport.provider}</span>
                  </div>
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  ${transport.price}
                </div>
                <button
                  onClick={() => {
                    setSelectedTransport(transport);
                    setShowBookingModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Book Now
                </button>
                {transport.availableSeats <= 5 && (
                  <p className="text-xs text-red-600 mt-1">
                    Only {transport.availableSeats} seats left!
                  </p>
                )}
              </div>
            </div>

            {/* Route and Time Information */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
                {/* Departure */}
                <div className="mb-4 md:mb-0">
                  <div className="text-sm text-gray-500">Departure</div>
                  <div className="text-lg font-semibold">
                    {formatDate(transport.departureTime)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transport.origin}
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-4 md:mb-0 flex flex-col items-center">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-lg font-semibold">
                    {calculateDuration(
                      transport.departureTime,
                      transport.arrivalTime
                    )}
                  </div>
                  <div className="relative w-24 h-0.5 bg-gray-300 my-2">
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"></div>
                  </div>
                </div>

                {/* Arrival */}
                <div>
                  <div className="text-sm text-gray-500">Arrival</div>
                  <div className="text-lg font-semibold">
                    {formatDate(transport.arrivalTime)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transport.destination}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex flex-wrap justify-between text-sm text-gray-500">
                <div className="mr-4 mb-2">
                  <span className="font-medium text-gray-700">
                    Available Seats:
                  </span>{" "}
                  {transport.availableSeats}
                </div>
                {transport.description && (
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">
                      Description:
                    </span>{" "}
                    {transport.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Booking Modal */}
      <TransportBookingModal
        transport={selectedTransport}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedTransport(null);
        }}
        onSuccess={(booking) => {
          setBookingData(booking);
          setShowBookingModal(false);
          setBookingSuccess(true);
          if (onBookingSuccess) onBookingSuccess(booking);
        }}
        onError={(errorMsg) => {
          if (onBookingError) onBookingError(errorMsg);
        }}
      />

      {/* Success Modal */}
      <BookingSuccessModal
        booking={bookingData}
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          setBookingData(null);
        }}
      />
    </div>
  );
};

export default TransportList;
