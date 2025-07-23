import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const BookingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [vacationPackage, setVacationPackage] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    numberOfTravelers: 1,
    specialRequests: "",
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get package ID or destination ID from URL query params if not in route params
  const queryParams = new URLSearchParams(location.search);
  const packageId = id || queryParams.get("package");
  const destinationId = queryParams.get("destination");

  useEffect(() => {
    const fetchData = async () => {
      // Set default start date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        startDate: tomorrow.toISOString().split("T")[0],
      }));

      if (packageId) {
        // Fetch vacation package data
        try {
          setLoading(true);
          const response = await api.get(`/vacations/${packageId}`);
          setVacationPackage(response.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch package details");
          setLoading(false);
          console.error("Error fetching package details:", err);
        }
      } else if (destinationId) {
        // Fetch destination data
        try {
          setLoading(true);
          const response = await api.get(`/destinations/${destinationId}`);
          setDestination(response.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch destination details");
          setLoading(false);
          console.error("Error fetching destination details:", err);
        }
      } else {
        setError("No package or destination specified");
        setLoading(false);
      }
    };

    fetchData();
  }, [packageId, destinationId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      if (selectedDate <= today) {
        errors.startDate = "Start date must be in the future";
      }
    }

    if (formData.numberOfTravelers < 1) {
      errors.numberOfTravelers = "At least 1 traveler is required";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking data based on whether it's a package or destination booking
      let bookingData = {
        user: user.id,
        startDate: formData.startDate,
        numberOfTravelers: formData.numberOfTravelers,
        specialRequests: formData.specialRequests,
        status: "pending",
      };

      // Add package-specific or destination-specific data
      if (packageId && vacationPackage) {
        bookingData.vacationPackage = packageId;
        bookingData.totalPrice =
          vacationPackage.price * formData.numberOfTravelers;
        // Calculate end date based on package duration
        const endDate = new Date(formData.startDate);
        endDate.setDate(endDate.getDate() + vacationPackage.duration);
        bookingData.endDate = endDate.toISOString().split("T")[0];
      } else if (destinationId && destination) {
        bookingData.destination = destinationId;
        // For destination-only bookings, set a default price (you may want to adjust this)
        const basePrice = 100; // Default base price for destination bookings
        bookingData.totalPrice = basePrice * formData.numberOfTravelers;
        // Set a default duration of 3 days for destination-only bookings
        const endDate = new Date(formData.startDate);
        endDate.setDate(endDate.getDate() + 3);
        bookingData.endDate = endDate.toISOString().split("T")[0];
      }

      await api.post("/bookings", bookingData);

      setBookingSuccess(true);
      // Redirect to booking confirmation after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error("Error creating booking:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Error
          </h1>
          <p className="mt-4 text-base text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Booking Successful!
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Your booking has been confirmed. You will be redirected to your
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center">
            Book Your Vacation
          </h1>

          {/* Package or Destination Summary */}
          {vacationPackage && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Package Summary
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Package Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {vacationPackage.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Destination
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {vacationPackage.destinations &&
                        vacationPackage.destinations
                          .map((d) => d.name)
                          .join(", ")}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Duration
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {vacationPackage.duration} days
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Price per person
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      ${vacationPackage.price}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {destination && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Destination Summary
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Destination Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {destination.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Country
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {destination.country}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {destination.type}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Price per person
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      $100 (Base price)
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm ${
                          formErrors.startDate
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                        } sm:text-sm`}
                      />
                    </div>
                    {formErrors.startDate && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="numberOfTravelers"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Number of Travelers
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="numberOfTravelers"
                        id="numberOfTravelers"
                        min="1"
                        value={formData.numberOfTravelers}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm ${
                          formErrors.numberOfTravelers
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                        } sm:text-sm`}
                      />
                    </div>
                    {formErrors.numberOfTravelers && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.numberOfTravelers}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="specialRequests"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Special Requests (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        rows={4}
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Any dietary requirements, accessibility needs, or other special requests"
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className={`h-4 w-4 rounded ${
                          formErrors.agreeToTerms
                            ? "border-red-300 focus:ring-red-500 text-primary-600"
                            : "border-gray-300 focus:ring-primary-500 text-primary-600"
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="agreeToTerms"
                        className="font-medium text-gray-700"
                      >
                        I agree to the terms and conditions
                      </label>
                      <p className="text-gray-500">
                        By checking this box, you agree to our{" "}
                        <a
                          href="/terms"
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Privacy Policy
                        </a>
                        .
                      </p>
                      {formErrors.agreeToTerms && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.agreeToTerms}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        Total Price
                      </h3>
                      <p className="text-2xl font-bold text-primary-600">
                        $
                        {vacationPackage
                          ? (
                              vacationPackage.price * formData.numberOfTravelers
                            ).toFixed(2)
                          : destination
                          ? (100 * formData.numberOfTravelers).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.numberOfTravelers}{" "}
                      {formData.numberOfTravelers === 1
                        ? "traveler"
                        : "travelers"}{" "}
                      x $
                      {vacationPackage?.price ||
                        (destination ? "100.00" : "0.00")}
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        isSubmitting
                          ? "bg-primary-400 cursor-not-allowed"
                          : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      }`}
                    >
                      {isSubmitting ? "Processing..." : "Complete Booking"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
