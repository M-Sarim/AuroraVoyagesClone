import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TransportBookingModal from "./TransportBookingModal";
import BookingSuccessModal from "./BookingSuccessModal";
import InteractiveMap from "../maps/InteractiveMap";

const LocationIQTransportMap = ({
  transports,
  onBookingSuccess,
  onBookingError,
}) => {
  const { isAuthenticated } = useAuth();
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [transportPoints, setTransportPoints] = useState([]);
  const [mapCenter] = useState({ lat: 30.3753, lng: 69.3451 }); // Center of Pakistan
  const [mapZoom] = useState(5);

  // Generate transport points for the map
  useEffect(() => {
    if (transports && transports.length > 0) {
      const points = [];

      transports.forEach((transport) => {
        // For demo purposes, we'll use random coordinates around Pakistan
        // In a real app, you would use geocoding or store coordinates in the database
        const originLat = 30.3753 + (Math.random() - 0.5) * 5;
        const originLng = 69.3451 + (Math.random() - 0.5) * 5;
        const destLat = 30.3753 + (Math.random() - 0.5) * 5;
        const destLng = 69.3451 + (Math.random() - 0.5) * 5;

        points.push({
          id: `${transport._id}-origin`,
          transport,
          position: { lat: originLat, lng: originLng },
          title: `${transport.origin} (${transport.type})`,
          isOrigin: true,
        });

        points.push({
          id: `${transport._id}-destination`,
          transport,
          position: { lat: destLat, lng: destLng },
          title: `${transport.destination} (${transport.type})`,
          isOrigin: false,
        });
      });

      setTransportPoints(points);
    }
  }, [transports]);

  // Get color for transport type
  const getColorForTransportType = (type) => {
    // Define colors for different transport types
    const colors = {
      flight: "#3B82F6", // blue
      bus: "#10B981", // green
      train: "#F59E0B", // amber
      car_rental: "#6366F1", // indigo
      shuttle: "#EC4899", // pink
      default: "#6B7280", // gray
    };

    return colors[type] || colors.default;
  };

  // Handle booking button click for a specific transport
  const handleBookNow = (transport) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      alert("Please log in to book transportation");
      return;
    }

    setSelectedTransport(transport);
    setShowBookingModal(true);
  };

  // Handle booking submission
  const handleBookingSubmit = (bookingDetails) => {
    // Here you would typically make an API call to save the booking
    // For demo purposes, we'll just simulate a successful booking
    setTimeout(() => {
      setBookingData({
        ...bookingDetails,
        transport: selectedTransport,
      });
      setShowBookingModal(false);
      setBookingSuccess(true);

      if (onBookingSuccess) {
        onBookingSuccess({
          ...bookingDetails,
          transport: selectedTransport,
        });
      }
    }, 1000);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Interactive Map */}
      <div className="h-[600px] relative">
        <InteractiveMap
          center={mapCenter}
          zoom={mapZoom}
          markers={transportPoints}
          height="600px"
        />
      </div>

      {/* Transport List */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Available Transport Options
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Select a transport option to book
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {transports.map((transport) => (
              <li key={transport._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {transport.type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transport.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transport.origin} to {transport.destination}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleBookNow(transport)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTransport && (
        <TransportBookingModal
          transport={selectedTransport}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Success Modal */}
      {bookingSuccess && bookingData && (
        <BookingSuccessModal
          booking={bookingData}
          onClose={() => setBookingSuccess(false)}
        />
      )}
    </div>
  );
};

export default LocationIQTransportMap;
