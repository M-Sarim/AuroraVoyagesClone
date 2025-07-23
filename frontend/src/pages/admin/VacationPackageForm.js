import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ExclamationTriangleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const VacationPackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company: "",
    tourGuide: "",
    destinations: [],
    duration: "",
    price: "",
    activities: [],
    includedTransport: [],
    includedHotels: [],
    includedMeals: [],
    schedule: [],
    images: [],
    status: "approved", // Admin-created packages are auto-approved
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [newTransport, setNewTransport] = useState("");
  const [newHotel, setNewHotel] = useState("");
  const [newMeal, setNewMeal] = useState("");
  const [newImage, setNewImage] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  // Fetch necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch destinations
        const destinationsResponse = await api.get("/destinations");
        setDestinations(destinationsResponse.data);

        // Fetch companies
        const companiesResponse = await api.get("/companies");
        setCompanies(companiesResponse.data);

        // Fetch tour guides
        const tourGuidesResponse = await api.get("/tour-guides");
        setTourGuides(tourGuidesResponse.data);

        if (isEditMode) {
          // Fetch vacation package data if in edit mode
          const packageResponse = await api.get(`/vacations/${id}`);
          const packageData = packageResponse.data;

          // Set selected destinations
          if (packageData.destinations && packageData.destinations.length > 0) {
            setSelectedDestinations(packageData.destinations.map(dest => dest._id));
          }

          // Set form data
          setFormData({
            name: packageData.name || "",
            description: packageData.description || "",
            company: packageData.company?._id || packageData.company || "",
            tourGuide: packageData.tourGuide?._id || packageData.tourGuide || "",
            destinations: packageData.destinations?.map(dest => dest._id) || [],
            duration: packageData.duration || "",
            price: packageData.price || "",
            activities: packageData.activities || [],
            includedTransport: packageData.includedTransport || [],
            includedHotels: packageData.includedHotels || [],
            includedMeals: packageData.includedMeals || [],
            schedule: packageData.schedule || [],
            images: packageData.images || [],
            status: packageData.status || "approved",
          });
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load necessary data");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDestinationChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDestinations(selectedOptions);
    setFormData({
      ...formData,
      destinations: selectedOptions,
    });
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setFormData({
        ...formData,
        activities: [...formData.activities, newActivity.trim()],
      });
      setNewActivity("");
    }
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = [...formData.activities];
    updatedActivities.splice(index, 1);
    setFormData({
      ...formData,
      activities: updatedActivities,
    });
  };

  const handleAddTransport = () => {
    if (newTransport.trim()) {
      setFormData({
        ...formData,
        includedTransport: [...formData.includedTransport, newTransport.trim()],
      });
      setNewTransport("");
    }
  };

  const handleRemoveTransport = (index) => {
    const updatedTransport = [...formData.includedTransport];
    updatedTransport.splice(index, 1);
    setFormData({
      ...formData,
      includedTransport: updatedTransport,
    });
  };

  const handleAddHotel = () => {
    if (newHotel.trim()) {
      setFormData({
        ...formData,
        includedHotels: [...formData.includedHotels, newHotel.trim()],
      });
      setNewHotel("");
    }
  };

  const handleRemoveHotel = (index) => {
    const updatedHotels = [...formData.includedHotels];
    updatedHotels.splice(index, 1);
    setFormData({
      ...formData,
      includedHotels: updatedHotels,
    });
  };

  const handleAddMeal = () => {
    if (newMeal.trim()) {
      setFormData({
        ...formData,
        includedMeals: [...formData.includedMeals, newMeal.trim()],
      });
      setNewMeal("");
    }
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = [...formData.includedMeals];
    updatedMeals.splice(index, 1);
    setFormData({
      ...formData,
      includedMeals: updatedMeals,
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

  const handleAddScheduleDay = () => {
    const newDay = {
      day: formData.schedule.length + 1,
      morning: "",
      afternoon: "",
      evening: "",
    };
    setFormData({
      ...formData,
      schedule: [...formData.schedule, newDay],
    });
  };

  const handleRemoveScheduleDay = (index) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule.splice(index, 1);
    
    // Renumber days
    const renumberedSchedule = updatedSchedule.map((day, idx) => ({
      ...day,
      day: idx + 1,
    }));
    
    setFormData({
      ...formData,
      schedule: renumberedSchedule,
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await api.put(`/vacations/${id}`, formData);
      } else {
        await api.post("/vacations", formData);
      }
      navigate("/admin/packages");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} vacation package`
      );
      setSubmitting(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
        <p className="ml-2">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? "Edit Vacation Package" : "Add New Vacation Package"}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEditMode
            ? "Update the details of an existing vacation package"
            : "Create a new vacation package for customers"}
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
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Package Name *
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

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (USD) *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
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

              <div className="sm:col-span-3">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company *
                </label>
                <select
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="tourGuide"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tour Guide
                </label>
                <select
                  id="tourGuide"
                  name="tourGuide"
                  value={formData.tourGuide}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">None (Admin Package)</option>
                  {tourGuides.map((guide) => (
                    <option key={guide._id} value={guide._id}>
                      {guide.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="destinations"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destinations *
                </label>
                <select
                  id="destinations"
                  name="destinations"
                  multiple
                  value={selectedDestinations}
                  onChange={handleDestinationChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                  size={5}
                >
                  {destinations.map((destination) => (
                    <option key={destination._id} value={destination._id}>
                      {destination.name}, {destination.country}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple destinations
                </p>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (days) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  min="1"
                  required
                />
              </div>

              {/* Activities */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activities
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Enter activity"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{activity}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Transport */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Included Transport
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newTransport}
                    onChange={(e) => setNewTransport(e.target.value)}
                    placeholder="Enter transport option"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTransport}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.includedTransport.map((transport, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{transport}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTransport(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Hotels */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Included Hotels
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newHotel}
                    onChange={(e) => setNewHotel(e.target.value)}
                    placeholder="Enter hotel"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddHotel}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.includedHotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{hotel}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveHotel(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Meals */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Included Meals
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newMeal}
                    onChange={(e) => setNewMeal(e.target.value)}
                    placeholder="Enter meal"
                    className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddMeal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.includedMeals.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="truncate flex-1">{meal}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMeal(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
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
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Daily Schedule
                  </label>
                  <button
                    type="button"
                    onClick={handleAddScheduleDay}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Day
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.schedule.map((day, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Day {day.day}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleDay(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label
                            htmlFor={`morning-${index}`}
                            className="block text-xs font-medium text-gray-700"
                          >
                            Morning
                          </label>
                          <input
                            type="text"
                            id={`morning-${index}`}
                            value={day.morning}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "morning",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Morning activities"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`afternoon-${index}`}
                            className="block text-xs font-medium text-gray-700"
                          >
                            Afternoon
                          </label>
                          <input
                            type="text"
                            id={`afternoon-${index}`}
                            value={day.afternoon}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "afternoon",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Afternoon activities"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`evening-${index}`}
                            className="block text-xs font-medium text-gray-700"
                          >
                            Evening
                          </label>
                          <input
                            type="text"
                            id={`evening-${index}`}
                            value={day.evening}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "evening",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Evening activities"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.schedule.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No schedule days added yet. Click "Add Day" to create a daily schedule.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/packages")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEditMode ? "Update Package" : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VacationPackageForm;
