import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DestinationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    images: [],
    attractions: [],
    bestVisitingMonths: [],
    culturalTips: [],
    type: "beach",
    location: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    weatherLocationKey: "",
    seasonalInfo: {
      winter: "",
      spring: "",
      summer: "",
      autumn: "",
    },
    howToGetThere: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState("");
  const [newAttraction, setNewAttraction] = useState("");
  const [newCulturalTip, setNewCulturalTip] = useState("");
  const [months, setMonths] = useState([]);

  // Destination types from the model
  const destinationTypes = [
    "beach",
    "mountain",
    "city",
    "countryside",
    "historical",
    "adventure",
  ];

  // All months for selection
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch destination data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchDestination = async () => {
        try {
          const response = await api.get(`/destinations/${id}`);
          const destination = response.data;
          
          // Set months from bestVisitingMonths
          setMonths(destination.bestVisitingMonths || []);
          
          // Set form data
          setFormData({
            name: destination.name || "",
            country: destination.country || "",
            description: destination.description || "",
            images: destination.images || [],
            attractions: destination.attractions || [],
            bestVisitingMonths: destination.bestVisitingMonths || [],
            culturalTips: destination.culturalTips || [],
            type: destination.type || "beach",
            location: destination.location || "",
            coordinates: {
              latitude: destination.coordinates?.latitude || "",
              longitude: destination.coordinates?.longitude || "",
            },
            weatherLocationKey: destination.weatherLocationKey || "",
            seasonalInfo: {
              winter: destination.seasonalInfo?.winter || "",
              spring: destination.seasonalInfo?.spring || "",
              summer: destination.seasonalInfo?.summer || "",
              autumn: destination.seasonalInfo?.autumn || "",
            },
            howToGetThere: destination.howToGetThere || "",
          });
          
          setLoading(false);
        } catch (err) {
          setError("Failed to load destination data");
          setLoading(false);
          console.error(err);
        }
      };

      fetchDestination();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMonthChange = (month) => {
    const updatedMonths = months.includes(month)
      ? months.filter((m) => m !== month)
      : [...months, month];
    
    setMonths(updatedMonths);
    setFormData({
      ...formData,
      bestVisitingMonths: updatedMonths,
    });
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      });
      setNewImage("");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleAddAttraction = () => {
    if (newAttraction.trim()) {
      setFormData({
        ...formData,
        attractions: [...formData.attractions, newAttraction.trim()],
      });
      setNewAttraction("");
    }
  };

  const handleRemoveAttraction = (index) => {
    const updatedAttractions = [...formData.attractions];
    updatedAttractions.splice(index, 1);
    setFormData({
      ...formData,
      attractions: updatedAttractions,
    });
  };

  const handleAddCulturalTip = () => {
    if (newCulturalTip.trim()) {
      setFormData({
        ...formData,
        culturalTips: [...formData.culturalTips, newCulturalTip.trim()],
      });
      setNewCulturalTip("");
    }
  };

  const handleRemoveCulturalTip = (index) => {
    const updatedCulturalTips = [...formData.culturalTips];
    updatedCulturalTips.splice(index, 1);
    setFormData({
      ...formData,
      culturalTips: updatedCulturalTips,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await api.put(`/destinations/${id}`, formData);
      } else {
        await api.post("/destinations", formData);
      }
      navigate("/admin/destinations");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} destination`
      );
      setSubmitting(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
        <p className="ml-2">Loading destination data...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? "Edit Destination" : "Add New Destination"}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEditMode
            ? "Update the details of an existing destination"
            : "Create a new destination for vacation packages"}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Basic Information */}
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

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  {destinationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="howToGetThere"
                  className="block text-sm font-medium text-gray-700"
                >
                  How to Get There
                </label>
                <textarea
                  id="howToGetThere"
                  name="howToGetThere"
                  rows={3}
                  value={formData.howToGetThere}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              {/* Best Visiting Months */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Visiting Months
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {allMonths.map((month) => (
                    <div key={month} className="flex items-center">
                      <input
                        id={`month-${month}`}
                        name={`month-${month}`}
                        type="checkbox"
                        checked={months.includes(month)}
                        onChange={() => handleMonthChange(month)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`month-${month}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {month}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{image}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attractions */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attractions
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newAttraction}
                    onChange={(e) => setNewAttraction(e.target.value)}
                    placeholder="Enter attraction"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttraction}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.attractions.map((attraction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{attraction}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttraction(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Tips */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Tips
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newCulturalTip}
                    onChange={(e) => setNewCulturalTip(e.target.value)}
                    placeholder="Enter cultural tip"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCulturalTip}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.culturalTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{tip}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCulturalTip(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/destinations")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEditMode ? "Update Destination" : "Create Destination"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
