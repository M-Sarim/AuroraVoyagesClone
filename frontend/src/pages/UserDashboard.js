import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageHelper";
import ImageFallback from "../components/ImageFallback";

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get("/bookings/user");
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch your bookings");
        setLoading(false);
        console.error("Error fetching bookings:", err);
      }
    };

    fetchUserBookings();
  }, []);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startDate);
    const today = new Date();

    if (activeTab === "upcoming") {
      return bookingDate >= today && booking.status !== "cancelled";
    } else if (activeTab === "past") {
      return bookingDate < today || booking.status === "completed";
    } else if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Welcome, {user?.name}
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Manage your bookings and explore new destinations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming Bookings
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`${
              activeTab === "past"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Past Bookings
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`${
              activeTab === "cancelled"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Cancelled Bookings
          </button>
        </nav>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">
          <p>{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No bookings found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {activeTab === "upcoming"
              ? "You don't have any upcoming bookings."
              : activeTab === "past"
              ? "You don't have any past bookings."
              : "You don't have any cancelled bookings."}
          </p>
          <div className="mt-6">
            <Link
              to="/destinations"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              {/* Booking Image */}
              <div className="h-48 relative">
                {booking.vacationPackage ? (
                  <ImageFallback
                    src={getImageUrl(booking.vacationPackage.images?.[0])}
                    alt={booking.vacationPackage.name}
                    className="h-full w-full object-cover"
                  />
                ) : booking.destination ? (
                  <ImageFallback
                    src={getImageUrl(booking.destination.images?.[0])}
                    alt={booking.destination.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : booking.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {booking.vacationPackage
                    ? booking.vacationPackage.name
                    : booking.destination
                    ? booking.destination.name
                    : "Booking"}
                </h3>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>${booking.totalPrice}</span>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
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
                  <span>
                    Payment:{" "}
                    {booking.paymentStatus.charAt(0).toUpperCase() +
                      booking.paymentStatus.slice(1)}
                  </span>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to={`/bookings/${booking._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-16">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/destinations"
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Explore Destinations
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Discover new places to visit
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/vacations"
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Vacation Packages
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Browse curated travel experiences
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Your Profile
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account settings
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/contact"
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Contact Support
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Get help with your bookings
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
