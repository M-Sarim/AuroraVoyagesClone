import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const TransportBookingModal = ({
  transport,
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    specialRequests: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Payment
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setBookingData((prev) => ({
        ...prev,
        contactName: user.name || "",
        contactEmail: user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  // Calculate total price when passengers change
  useEffect(() => {
    if (transport) {
      setTotalPrice(transport.price * bookingData.passengers);
    }
  }, [transport, bookingData.passengers]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (bookingData.passengers < 1) {
      setError("Please select at least 1 passenger");
      return false;
    }

    if (bookingData.passengers > transport.availableSeats) {
      setError(`Only ${transport.availableSeats} seats available`);
      return false;
    }

    if (!bookingData.contactName.trim()) {
      setError("Please enter contact name");
      return false;
    }

    if (!bookingData.contactEmail.trim()) {
      setError("Please enter contact email");
      return false;
    }

    if (!bookingData.contactPhone.trim()) {
      setError("Please enter contact phone");
      return false;
    }

    if (step === 2 && !bookingData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return false;
    }

    setError(null);
    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

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

  // Handle booking submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!isAuthenticated) {
      // Save booking data to session storage and redirect to login
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          type: "transport",
          transportId: transport._id,
          bookingData,
        })
      );
      navigate("/login?redirect=/how-to-get-there");
      return;
    }

    try {
      setLoading(true);

      // Create booking
      const response = await api.post("/bookings", {
        transport: [transport._id],
        startDate: transport.departureTime,
        endDate: transport.arrivalTime,
        totalPrice: totalPrice,
        passengers: bookingData.passengers,
        contactName: bookingData.contactName,
        contactEmail: bookingData.contactEmail,
        contactPhone: bookingData.contactPhone,
        specialRequests: bookingData.specialRequests,
      });

      setLoading(false);

      if (response.data) {
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }

        // Close modal
        onClose();

        // Redirect to booking details
        navigate(`/bookings/${response.data._id}`);
      }
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "Failed to create booking";
      setError(errorMessage);
      console.error("Booking error:", err);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen || !transport) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-white">
                {step === 1 && "Book Transport"}
                {step === 2 && "Review Booking"}
                {step === 3 && "Payment"}
              </h3>
              <button
                type="button"
                className="bg-primary-600 rounded-md text-white hover:text-gray-200 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Transport info */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  {transport.type === "flight" && (
                    <svg
                      className="h-6 w-6"
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
                  )}
                  {transport.type === "bus" && (
                    <svg
                      className="h-6 w-6"
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
                  )}
                  {transport.type === "train" && (
                    <svg
                      className="h-6 w-6"
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
                  )}
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {transport.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {transport.origin} to {transport.destination} •{" "}
                  {formatDate(transport.departureTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Step 1: Booking Details */}
          {step === 1 && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="space-y-4">
                {/* Number of passengers */}
                <div>
                  <label
                    htmlFor="passengers"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Passengers
                  </label>
                  <select
                    id="passengers"
                    name="passengers"
                    value={bookingData.passengers}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    {[
                      ...Array(Math.min(10, transport.availableSeats)).keys(),
                    ].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="contactName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={bookingData.contactName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={bookingData.contactEmail}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={bookingData.contactPhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows="3"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Any special requirements or requests..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review Booking */}
          {step === 2 && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Booking Summary
                </h4>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Transport:</span>
                    <span className="text-sm font-medium">
                      {transport.name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Route:</span>
                    <span className="text-sm font-medium">
                      {transport.origin} to {transport.destination}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Departure:</span>
                    <span className="text-sm font-medium">
                      {formatDate(transport.departureTime)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Arrival:</span>
                    <span className="text-sm font-medium">
                      {formatDate(transport.arrivalTime)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Passengers:</span>
                    <span className="text-sm font-medium">
                      {bookingData.passengers}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      Price per passenger:
                    </span>
                    <span className="text-sm font-medium">
                      ${transport.price}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      Total Price:
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </h5>
                  <div className="space-y-1">
                    <p className="text-sm">{bookingData.contactName}</p>
                    <p className="text-sm">{bookingData.contactEmail}</p>
                    <p className="text-sm">{bookingData.contactPhone}</p>
                  </div>
                  {bookingData.specialRequests && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </h5>
                      <p className="text-sm">{bookingData.specialRequests}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={bookingData.agreeToTerms}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
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
                        By proceeding with this booking, you agree to our terms
                        of service and cancellation policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Demo Mode
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          This is a demo application. No actual payment will be
                          processed. Click "Complete Booking" to simulate a
                          successful payment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Payment Summary
                  </h4>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Total Amount:</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Secure Payment
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          All payments are secure and encrypted. Your payment
                          information is never stored on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 px-4 py-3 sm:px-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 1 && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleNextStep}
              >
                Continue to Review
              </button>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleNextStep}
                  disabled={!bookingData.agreeToTerms}
                >
                  Continue to Payment
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handlePrevStep}
                >
                  Back
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
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
                      Processing...
                    </>
                  ) : (
                    "Complete Booking"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  Back
                </button>
              </>
            )}

            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportBookingModal;
