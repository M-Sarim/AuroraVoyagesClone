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

const DestinationManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    name: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);

  // Destination types from the model
  const destinationTypes = [
    "all",
    "beach",
    "mountain",
    "city",
    "countryside",
    "historical",
    "adventure",
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/destinations");
      setDestinations(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load destinations");
      setLoading(false);
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      name: "",
    });
  };

  const handleDeleteDestination = async () => {
    try {
      await api.delete(`/destinations/${destinationToDelete}`);
      setShowDeleteModal(false);
      setDestinationToDelete(null);
      fetchDestinations();
    } catch (err) {
      setError("Failed to delete destination");
      console.error(err);
    }
  };

  const filteredDestinations = destinations.filter((destination) => {
    return (
      (filters.type === "" ||
        filters.type === "all" ||
        destination.type === filters.type) &&
      (filters.name === "" ||
        destination.name.toLowerCase().includes(filters.name.toLowerCase()))
    );
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Destination Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all destinations and regions for vacation packages.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/destinations/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Destination
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Filter Destinations
          </h2>
          {(filters.type || filters.name) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 flex items-center hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Filter */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Types</option>
              {destinationTypes.slice(1).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Name Filter */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Filter by name"
            />
          </div>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="text-center py-10">
                  <div className="spinner"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading destinations...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : filteredDestinations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No destinations found. Try adjusting your filters or add a new
                  destination.
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
                        Country
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
                        Popularity
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
                    {filteredDestinations.map((destination) => (
                      <tr key={destination._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {destination.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {destination.country}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                          {destination.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {destination.popularity || 0}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/destinations/edit/${destination._id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                Edit {destination.name}
                              </span>
                            </Link>
                            <button
                              onClick={() => {
                                setDestinationToDelete(destination._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                Delete {destination.name}
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
              onClick={() => setShowDeleteModal(false)}
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
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Delete Destination
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this destination? This
                      action cannot be undone. Deleting a destination may affect
                      vacation packages that include this destination.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteDestination}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
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

export default DestinationManagement;
