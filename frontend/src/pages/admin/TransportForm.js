import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const TransportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    type: "flight",
    name: "",
    description: "",
    provider: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    availableSeats: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [destinations, setDestinations] = useState([]);

  // Transport types from the model
  const transportTypes = ["flight", "bus", "car_rental", "shuttle", "train"];

  // Fetch transport data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch destinations for autocomplete
        const destinationsResponse = await api.get("/destinations");
        setDestinations(destinationsResponse.data);

        // If in edit mode, fetch the transport data
        if (isEditMode) {
          const transportResponse = await api.get(`/transport/${id}`);
          const transport = transportResponse.data;

          // Format dates for form inputs
          const formatDateForInput = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
          };

          setFormData({
            type: transport.type || "flight",
            name: transport.name || "",
            description: transport.description || "",
            provider: transport.provider || "",
            origin: transport.origin || "",
            destination: transport.destination || "",
            departureTime: formatDateForInput(transport.departureTime),
            arrivalTime: formatDateForInput(transport.arrivalTime),
            price: transport.price || "",
            availableSeats: transport.availableSeats || "",
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data for API
      const transportData = {
        ...formData,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats, 10),
      };

      if (isEditMode) {
        // Update existing transport
        await api.put(`/transport/${id}`, transportData);
      } else {
        // Create new transport
        await api.post("/transport", transportData);
      }

      setSubmitting(false);

      // Redirect to transport management page
      navigate("/admin/transport");
    } catch (err) {
      console.error("Error saving transport:", err);
      setError("Failed to save transport");
      setSubmitting(false);
    }
  };

  // Validate form
  const validateForm = () => {
    // Check required fields
    if (
      !formData.name ||
      !formData.type ||
      !formData.origin ||
      !formData.destination ||
      !formData.departureTime ||
      !formData.arrivalTime ||
      !formData.price
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate price
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Price must be a positive number");
      return false;
    }

    // Validate available seats
    if (
      isNaN(parseInt(formData.availableSeats, 10)) ||
      parseInt(formData.availableSeats, 10) < 0
    ) {
      setError("Available seats must be a non-negative number");
      return false;
    }

    // Validate departure and arrival times
    const departureTime = new Date(formData.departureTime);
    const arrivalTime = new Date(formData.arrivalTime);

    if (departureTime >= arrivalTime) {
      setError("Departure time must be before arrival time");
      return false;
    }

    return true;
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit Transport" : "Add New Transport"}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Transport Type */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Transport Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  required
                >
                  {transportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              {/* Provider */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="provider"
                  className="block text-sm font-medium text-gray-700"
                >
                  Provider
                </label>
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (PKR) *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">PKR</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Origin */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Origin *
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  list="originList"
                  required
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

              {/* Destination */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination *
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  list="destinationList"
                  required
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

              {/* Departure Time */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="departureTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departure Time *
                </label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              {/* Arrival Time */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="arrivalTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Arrival Time *
                </label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              {/* Available Seats */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="availableSeats"
                  className="block text-sm font-medium text-gray-700"
                >
                  Available Seats
                </label>
                <input
                  type="number"
                  id="availableSeats"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  min="0"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/transport")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransportForm;
