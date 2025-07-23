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

const VacationPackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    destination: "",
    name: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [destinations, setDestinations] = useState([]);

  // Package statuses
  const packageStatuses = ["all", "approved", "pending", "rejected"];

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log("Fetching vacation packages...");

      // Get the auth token to check if we're authenticated as admin
      const token = localStorage.getItem("token");

      // Make the API call without specifying a status to get all packages
      // The backend will check the auth token and return all packages for admin users
      const response = await api.get("/admin/all-packages");

      console.log("Vacation packages response:", response.data);
      setPackages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load vacation packages:", err);
      setError(
        "Failed to load vacation packages: " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await api.get("/destinations");
      setDestinations(response.data);
    } catch (err) {
      console.error("Failed to load destinations", err);
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
      status: "",
      destination: "",
      name: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const handleDeletePackage = async () => {
    try {
      await api.delete(`/vacations/${packageToDelete}`);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      fetchPackages();
    } catch (err) {
      setError("Failed to delete vacation package");
      console.error(err);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    return (
      (filters.status === "" ||
        filters.status === "all" ||
        pkg.status === filters.status) &&
      (filters.destination === "" ||
        (pkg.destinations &&
          pkg.destinations.some(
            (dest) =>
              dest.name &&
              dest.name
                .toLowerCase()
                .includes(filters.destination.toLowerCase())
          ))) &&
      (filters.name === "" ||
        pkg.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.minPrice === "" || pkg.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === "" || pkg.price <= Number(filters.maxPrice))
    );
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Vacation Package Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all vacation packages including tours, activities, and
            experiences.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/packages/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Package
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Filter Packages
          </h2>
          {(filters.status ||
            filters.destination ||
            filters.name ||
            filters.minPrice ||
            filters.maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 flex items-center hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {packageStatuses.slice(1).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
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

          {/* Price Range Filters */}
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Min price"
              min="0"
            />
          </div>

          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Max price"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="text-center py-10">
                  <div className="spinner"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading vacation packages...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No vacation packages found. Try adjusting your filters or add
                  a new package.
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
                        Destinations
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Duration
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
                        Status
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
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {pkg.name}
                          <div className="text-xs text-gray-500">
                            {pkg.tourGuide?.name
                              ? `Guide: ${pkg.tourGuide.name}`
                              : "Admin Created"}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {pkg.destinations && pkg.destinations.length > 0 ? (
                            <div>
                              {pkg.destinations.slice(0, 2).map((dest) => (
                                <div key={dest._id} className="text-sm">
                                  {dest.name}, {dest.country}
                                </div>
                              ))}
                              {pkg.destinations.length > 2 && (
                                <div className="text-xs text-gray-400">
                                  +{pkg.destinations.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              No destinations
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pkg.duration} {pkg.duration === 1 ? "day" : "days"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${pkg.price.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              pkg.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : pkg.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pkg.status.charAt(0).toUpperCase() +
                              pkg.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/packages/edit/${pkg._id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="sr-only">Edit {pkg.name}</span>
                            </Link>
                            <button
                              onClick={() => {
                                setPackageToDelete(pkg._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <span className="sr-only">Delete {pkg.name}</span>
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
                    Delete Vacation Package
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this vacation package?
                      This action cannot be undone. All bookings associated with
                      this package will be affected.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeletePackage}
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

export default VacationPackageManagement;
