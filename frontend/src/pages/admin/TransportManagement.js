import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const TransportManagement = () => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    origin: "",
    destination: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transportToDelete, setTransportToDelete] = useState(null);
  const [destinations, setDestinations] = useState([]);

  // Transport types from the model
  const transportTypes = [
    "all",
    "flight",
    "bus",
    "car_rental",
    "shuttle",
    "train",
  ];

  // Fetch all transports and destinations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all transports
        const transportResponse = await api.get("/transport");
        setTransports(transportResponse.data);

        // Fetch all destinations for filter dropdowns
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "",
      origin: "",
      destination: "",
    });
  };

  // Apply filters
  const filteredTransports = transports.filter((transport) => {
    // Filter by type
    if (
      filters.type &&
      filters.type !== "all" &&
      transport.type !== filters.type
    ) {
      return false;
    }

    // Filter by origin
    if (
      filters.origin &&
      !transport.origin.toLowerCase().includes(filters.origin.toLowerCase())
    ) {
      return false;
    }

    // Filter by destination
    if (
      filters.destination &&
      !transport.destination
        .toLowerCase()
        .includes(filters.destination.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle delete transport
  const handleDeleteTransport = async () => {
    if (!transportToDelete) return;

    try {
      await api.delete(`/transport/${transportToDelete}`);

      // Remove from state
      setTransports(
        transports.filter((transport) => transport._id !== transportToDelete)
      );

      // Close modal
      setShowDeleteModal(false);
      setTransportToDelete(null);
    } catch (err) {
      console.error("Error deleting transport:", err);
      setError("Failed to delete transport");
    }
  };

  // Get color for transport type
  const getTypeColor = (type) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "bus":
        return "bg-green-100 text-green-800";
      case "car_rental":
        return "bg-purple-100 text-purple-800";
      case "shuttle":
        return "bg-pink-100 text-pink-800";
      case "train":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Transport Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all transport options including flights, buses, trains, and
            more.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/transport/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Transport
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Filters
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Transport Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              {transportTypes
                .filter((type) => type !== "all")
                .map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("_", " ")}
                  </option>
                ))}
            </select>
          </div>

          {/* Origin Filter */}
          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700"
            >
              Origin
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={filters.origin}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Filter by origin"
              list="originList"
            />
            <datalist id="originList">
              {destinations.map((destination) => (
                <option
                  key={`origin-${destination._id}`}
                  value={destination.name}
                />
              ))}
            </datalist>
          </div>

          {/* Destination Filter */}
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700"
            >
              Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={filters.destination}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Filter by destination"
              list="destinationList"
            />
            <datalist id="destinationList">
              {destinations.map((destination) => (
                <option
                  key={`dest-${destination._id}`}
                  value={destination.name}
                />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {/* Transport List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : filteredTransports.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-sm text-gray-500">
                    No transport options found matching your filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Route
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Departure
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Seats
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredTransports.map((transport) => (
                      <tr key={transport._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {transport.name}
                          <div className="text-xs text-gray-500">
                            {transport.provider}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                              transport.type
                            )}`}
                          >
                            {transport.type.charAt(0).toUpperCase() +
                              transport.type.slice(1).replace("_", " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{transport.origin}</div>
                          <div className="text-xs">to</div>
                          <div>{transport.destination}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(transport.departureTime)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          PKR {transport.price.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {transport.availableSeats}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/transport/edit/${transport._id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                Edit {transport.name}
                              </span>
                            </Link>
                            <button
                              onClick={() => {
                                setTransportToDelete(transport._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                Delete {transport.name}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Transport
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this transport option?
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteTransport}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTransportToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportManagement;
