import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const TransportOptions = ({ destinationName }) => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setLoading(true);
        // Fetch all transport options first
        const response = await api.get("/transport");

        // Filter transports that match the destination name (case insensitive)
        // or have the destination name as part of their destination string
        const filteredTransports = response.data.filter(
          (transport) =>
            transport.destination
              .toLowerCase()
              .includes(destinationName.toLowerCase()) ||
            destinationName
              .toLowerCase()
              .includes(transport.destination.toLowerCase())
        );

        setTransports(filteredTransports);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transport options:", err);
        setError("Failed to load transport options");
        setLoading(false);
      }
    };

    fetchTransports();
  }, [destinationName]);

  // Filter transports by type
  const filteredTransports =
    activeType === "all"
      ? transports
      : transports.filter((transport) => transport.type === activeType);

  // Get unique transport types
  const transportTypes = [
    "all",
    ...new Set(transports.map((transport) => transport.type)),
  ];

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
  const getTransportIcon = (type) => {
    switch (type) {
      case "flight":
        return (
          <svg
            className="h-5 w-5"
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
            className="h-5 w-5"
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
            className="h-5 w-5"
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
            className="h-5 w-5"
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
            className="h-5 w-5"
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
            className="h-5 w-5"
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-2">{error}</div>;
  }

  return (
    <div className="mt-4">
      {/* Transport type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {transportTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              activeType === type
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
          </button>
        ))}
      </div>

      {filteredTransports.length === 0 ? (
        <p className="text-gray-600 italic">
          No transport options available for this destination.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredTransports.map((transport) => (
            <div
              key={transport._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-800 mr-3">
                      {getTransportIcon(transport.type)}
                    </span>
                    <h4 className="text-lg font-medium text-gray-900">
                      {transport.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {transport.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Provider: {transport.provider}</p>
                    <p>
                      From: {transport.origin} • To: {transport.destination}
                    </p>
                    <p>Departure: {formatDate(transport.departureTime)}</p>
                    <p>Arrival: {formatDate(transport.arrivalTime)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary-600">
                    ${transport.price}
                  </span>
                  <p className="text-sm text-gray-500">
                    {transport.availableSeats} seats available
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransportOptions;
