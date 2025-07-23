import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import TransportSearch from "../components/transport/TransportSearch";
import TransportList from "../components/transport/TransportList";
import TransportTypeFilter from "../components/transport/TransportTypeFilter";
import TransportMap from "../components/transport/TransportMap";
import BookingNotification from "../components/transport/BookingNotification";
import TransportCard from "../components/transport/TransportCard";
import TransportBookingModal from "../components/transport/TransportBookingModal";
import BookingSuccessModal from "../components/transport/BookingSuccessModal";

const HowToGetThere = () => {
  const navigate = useNavigate();
  const [transports, setTransports] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("all");
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
  });
  const [destinations, setDestinations] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Fetch all transport options and destinations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all transport options
        const transportResponse = await api.get("/transport");
        setTransports(transportResponse.data);
        setFilteredTransports(transportResponse.data);

        // Fetch all destinations for search dropdown
        const destinationsResponse = await api.get("/destinations");
        setDestinations(destinationsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load transport options");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Build query parameters
      const params = {};
      if (searchParams.origin) params.origin = searchParams.origin;
      if (searchParams.destination)
        params.destination = searchParams.destination;
      if (searchParams.departureDate)
        params.departureDate = searchParams.departureDate;

      // Fetch filtered transport options
      const response = await api.get("/transport", { params });

      // Apply type filter if active
      if (activeType !== "all") {
        setFilteredTransports(
          response.data.filter((transport) => transport.type === activeType)
        );
      } else {
        setFilteredTransports(response.data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error searching transport options:", err);
      setError("Failed to search transport options");
      setLoading(false);
    }
  };

  // Handle input change in search form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle transport type filter change
  const handleTypeChange = (type) => {
    setActiveType(type);

    if (type === "all") {
      setFilteredTransports(transports);
    } else {
      setFilteredTransports(
        transports.filter((transport) => transport.type === type)
      );
    }
  };

  // Toggle map view
  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  // Handle book now button click
  const handleBookNow = (transport) => {
    setSelectedTransport(transport);
    setShowBookingModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How to Get There
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Find the best transportation options to reach your desired
              destinations in Pakistan. Search for flights, buses, trains, and
              more to plan your journey.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link
              to="/transport-bookings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="mr-2 h-5 w-5"
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
              My Transport Bookings
            </Link>
          </div>
        </div>

        {/* Search Form */}
        <TransportSearch
          searchParams={searchParams}
          destinations={destinations}
          handleInputChange={handleInputChange}
          handleSearch={handleSearch}
        />

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleMapView}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showMap ? (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                List View
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
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
                Map View
              </>
            )}
          </button>
        </div>

        {/* Transport Type Filter */}
        <TransportTypeFilter
          activeType={activeType}
          handleTypeChange={handleTypeChange}
          transports={transports}
        />

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Transport Results */}
        {!loading && !error && (
          <>
            {showMap ? (
              <TransportMap
                transports={filteredTransports}
                onBookingSuccess={() => {
                  setNotification({
                    show: true,
                    message:
                      "Booking successful! Check your email for confirmation.",
                    type: "success",
                  });
                }}
                onBookingError={(errorMsg) => {
                  setNotification({
                    show: true,
                    message: errorMsg || "Booking failed. Please try again.",
                    type: "error",
                  });
                }}
              />
            ) : (
              <div className="space-y-6">
                {filteredTransports.map((transport) => (
                  <TransportCard
                    key={transport._id}
                    transport={transport}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* No Results Message */}
        {!loading && !error && filteredTransports.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No transport options found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-16 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Transportation in Pakistan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Domestic Flights
              </h3>
              <p className="text-gray-600 mb-4">
                Pakistan has several domestic airlines connecting major cities.
                Flights are available from Islamabad, Lahore, and Karachi to
                northern areas like Gilgit, Skardu, and Chitral.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Buses and Coaches
              </h3>
              <p className="text-gray-600">
                Extensive bus networks connect all major cities and towns.
                Luxury bus services like Daewoo Express and Faisal Movers offer
                comfortable travel options with air conditioning and onboard
                amenities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trains
              </h3>
              <p className="text-gray-600 mb-4">
                Pakistan Railways operates throughout the country, connecting
                major cities. Different classes of service are available, from
                economy to air-conditioned sleeper cabins.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Car Rentals
              </h3>
              <p className="text-gray-600">
                Rental cars with drivers are widely available in major cities.
                Self-drive options are limited but available through
                international agencies in larger cities.
              </p>
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="mt-12 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <svg
                  className="h-6 w-6 text-primary-600 mr-2"
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Best Time to Travel
                </h3>
              </div>
              <p className="text-gray-600">
                For northern areas, summer (May-September) is ideal. Southern
                regions are best visited during winter (October-February) when
                temperatures are mild.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <svg
                  className="h-6 w-6 text-primary-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Safety</h3>
              </div>
              <p className="text-gray-600">
                Check travel advisories before your trip. Major tourist
                destinations are generally safe, but it's advisable to travel
                with local guides in remote areas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <svg
                  className="h-6 w-6 text-primary-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Tips
                </h3>
              </div>
              <p className="text-gray-600">
                Book transportation in advance during peak tourist seasons. For
                flights to northern areas, book several weeks ahead as they fill
                up quickly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <BookingNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

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
          setNotification({
            show: true,
            message: "Booking successful! Check your email for confirmation.",
            type: "success",
          });
        }}
        onError={(errorMsg) => {
          setNotification({
            show: true,
            message: errorMsg || "Booking failed. Please try again.",
            type: "error",
          });
        }}
      />

      {/* Success Modal */}
      <BookingSuccessModal
        booking={bookingData}
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          setBookingData(null);
          navigate("/transport-bookings");
        }}
      />
    </div>
  );
};

export default HowToGetThere;
