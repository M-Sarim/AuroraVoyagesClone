import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import { useAuth } from "../../context/AuthContext";
import TransportBookingModal from "./TransportBookingModal";
import BookingSuccessModal from "./BookingSuccessModal";

const TransportMap = ({ transports, onBookingSuccess, onBookingError }) => {
  const { isAuthenticated } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 30.3753, lng: 69.3451 }); // Center of Pakistan
  const [mapZoom, setMapZoom] = useState(5);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  // Generate markers for origins and destinations
  const generateMarkers = () => {
    const markers = [];

    transports.forEach((transport) => {
      // We need to convert string locations to coordinates
      // For demo purposes, we'll use random coordinates around Pakistan
      // In a real app, you would use geocoding or store coordinates in the database

      const originLat = 30.3753 + (Math.random() - 0.5) * 5;
      const originLng = 69.3451 + (Math.random() - 0.5) * 5;
      const destLat = 30.3753 + (Math.random() - 0.5) * 5;
      const destLng = 69.3451 + (Math.random() - 0.5) * 5;

      markers.push({
        id: `${transport._id}-origin`,
        transport,
        position: { lat: originLat, lng: originLng },
        title: `${transport.origin} (${transport.type})`,
        isOrigin: true,
      });

      markers.push({
        id: `${transport._id}-dest`,
        transport,
        position: { lat: destLat, lng: destLng },
        title: `${transport.destination} (${transport.type})`,
        isOrigin: false,
      });
    });

    return markers;
  };

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

  // Get icon for transport type
  const getMarkerIcon = (type, isOrigin) => {
    // Define colors for different transport types
    const colors = {
      flight: "#3B82F6", // blue
      bus: "#10B981", // green
      train: "#F59E0B", // amber
      car_rental: "#6366F1", // indigo
      shuttle: "#EC4899", // pink
      default: "#6B7280", // gray
    };

    const color = colors[type] || colors.default;

    return {
      path: isOrigin
        ? "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        : "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: "#FFFFFF",
      scale: 1.5,
    };
  };

  // Get polyline options for transport type
  const getPolylineOptions = (type) => {
    // Define colors for different transport types
    const colors = {
      flight: "#3B82F6", // blue
      bus: "#10B981", // green
      train: "#F59E0B", // amber
      car_rental: "#6366F1", // indigo
      shuttle: "#EC4899", // pink
      default: "#6B7280", // gray
    };

    const color = colors[type] || colors.default;

    return {
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 3,
      geodesic: type === "flight", // Curved lines for flights, straight for others
    };
  };

  // Generate polylines between origins and destinations
  const generatePolylines = () => {
    const polylines = [];

    transports.forEach((transport) => {
      // We need to convert string locations to coordinates
      // For demo purposes, we'll use random coordinates around Pakistan
      // In a real app, you would use geocoding or store coordinates in the database

      const originLat = 30.3753 + (Math.random() - 0.5) * 5;
      const originLng = 69.3451 + (Math.random() - 0.5) * 5;
      const destLat = 30.3753 + (Math.random() - 0.5) * 5;
      const destLng = 69.3451 + (Math.random() - 0.5) * 5;

      polylines.push({
        id: transport._id,
        transport,
        path: [
          { lat: originLat, lng: originLng },
          { lat: destLat, lng: destLng },
        ],
        options: getPolylineOptions(transport.type),
      });
    });

    return polylines;
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
  };

  const markers = generateMarkers();
  const polylines = generatePolylines();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {/* Polylines */}
        {polylines.map((polyline) => (
          <Polyline
            key={polyline.id}
            path={polyline.path}
            options={polyline.options}
          />
        ))}

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            icon={getMarkerIcon(marker.transport.type, marker.isOrigin)}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="text-base font-semibold mb-1">
                {selectedMarker.transport.name}
              </h3>
              <div className="text-sm mb-2">
                <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded mr-1">
                  {formatTypeName(selectedMarker.transport.type)}
                </span>
                <span className="text-gray-600">
                  {selectedMarker.transport.provider}
                </span>
              </div>
              <div className="text-sm">
                <p>
                  <strong>
                    {selectedMarker.isOrigin ? "Departure" : "Arrival"}:
                  </strong>{" "}
                  {formatDate(
                    selectedMarker.isOrigin
                      ? selectedMarker.transport.departureTime
                      : selectedMarker.transport.arrivalTime
                  )}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedMarker.isOrigin
                    ? selectedMarker.transport.origin
                    : selectedMarker.transport.destination}
                </p>
                <p>
                  <strong>Price:</strong> ${selectedMarker.transport.price}
                </p>
                <p>
                  <strong>Available Seats:</strong>{" "}
                  {selectedMarker.transport.availableSeats}
                </p>
              </div>
              <div className="mt-2 text-right">
                <button
                  onClick={() => {
                    setSelectedTransport(selectedMarker.transport);
                    setShowBookingModal(true);
                  }}
                  className="inline-block px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

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

export default TransportMap;
