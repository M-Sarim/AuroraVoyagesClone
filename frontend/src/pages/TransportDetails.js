import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import TransportBookingModal from "../components/transport/TransportBookingModal";
import BookingSuccessModal from "../components/transport/BookingSuccessModal";
import InteractiveMap from "../components/maps/InteractiveMap";

const TransportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [mapPoints, setMapPoints] = useState([]);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/transport/${id}`);
        setTransport(response.data);

        // Set map points for origin and destination
        setMapPoints([
          {
            id: "origin",
            title: response.data.origin,
            description:
              "Departure: " + formatDate(response.data.departureTime),
            position: { lat: 0, lng: 0 }, // This would need to be geocoded in a real app
            type: "origin",
          },
          {
            id: "destination",
            title: response.data.destination,
            description: "Arrival: " + formatDate(response.data.arrivalTime),
            position: { lat: 0, lng: 0 }, // This would need to be geocoded in a real app
            type: "destination",
          },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching transport details:", err);
        setError("Failed to load transport details");
        setLoading(false);
      }
    };

    fetchTransport();
  }, [id]);

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
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
            className="h-8 w-8"
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
      // Add other transport types here
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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

  // Handle booking button click
  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Save current page to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", `/transport/${id}`);
      navigate("/login");
      return;
    }

    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <Link
            to="/how-to-get-there"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Transport Options
          </Link>
        </div>
      </div>
    );
  }

  if (!transport) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Transport not found. It may have been removed or is no longer
                  available.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/how-to-get-there"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Transport Options
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  to="/how-to-get-there"
                  className="ml-4 text-gray-400 hover:text-gray-500"
                >
                  Transport
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-gray-500">{transport.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Transport Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              {/* Transport Type and Provider */}
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    {getTransportIcon(transport.type)}
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {transport.name}
                  </h1>
                  <div className="flex items-center text-gray-500 mt-1">
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
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  PKR {transport.price.toLocaleString()}
                </div>
                <button
                  onClick={handleBookNow}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Book Now
                </button>
                <div className="text-sm text-gray-500 mt-2">
                  {transport.availableSeats} seats available
                </div>
              </div>
            </div>

            {/* Route and Times */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">
                      {transport.origin}
                    </div>
                    <div className="text-gray-500">
                      {formatDate(transport.departureTime)}
                    </div>
                  </div>
                  <div className="mx-4 flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-20 border-t-2 border-gray-300"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">
                      {transport.destination}
                    </div>
                    <div className="text-gray-500">
                      {formatDate(transport.arrivalTime)}
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-lg font-medium text-gray-900">
                    {calculateDuration(
                      transport.departureTime,
                      transport.arrivalTime
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {transport.description && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{transport.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Route Map
            </h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <InteractiveMap
                center={{ lat: 30.3753, lng: 69.3451 }} // Center of Pakistan
                zoom={5}
                markers={mapPoints}
                height="400px"
              />
            </div>
          </div>
        </div>

        {/* Related Transport Options */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Other Transport Options
            </h2>
            <p className="text-gray-600">
              Looking for alternatives? Check out our other transport options
              for this route.
            </p>
            <div className="mt-4">
              <Link
                to={`/how-to-get-there?origin=${encodeURIComponent(
                  transport.origin
                )}&destination=${encodeURIComponent(transport.destination)}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Alternatives
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <TransportBookingModal
        transport={transport}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={(booking) => {
          setBookingData(booking);
          setShowBookingModal(false);
          setBookingSuccess(true);
        }}
        onError={(errorMsg) => {
          setError(errorMsg);
        }}
      />

      {/* Success Modal */}
      <BookingSuccessModal
        booking={bookingData}
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          navigate("/bookings");
        }}
      />
    </div>
  );
};

export default TransportDetails;
