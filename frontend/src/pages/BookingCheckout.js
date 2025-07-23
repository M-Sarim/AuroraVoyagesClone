import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StripeCheckout from "../components/payment/StripeCheckout";
import PDFGenerator, {
  BookingConfirmationTemplate,
} from "../components/pdf/PDFGenerator";
import api from "../utils/api";

const BookingCheckout = () => {
  const { id } = useParams(); // Vacation package or destination ID
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters to determine if this is a destination or package booking
  const queryParams = new URLSearchParams(location.search);
  const bookingType = queryParams.get("type") || "package";

  const [vacationPackage, setVacationPackage] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    travelerInfo: [{ name: "", email: "", phone: "" }],
  });
  const [step, setStep] = useState(1); // 1: Details, 2: Traveler Info, 3: Payment, 4: Confirmation
  const [totalPrice, setTotalPrice] = useState(0);
  const [booking, setBooking] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const confirmationRef = useRef(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);

        if (bookingType === "destination") {
          // Fetch destination details
          const response = await api.get(`/destinations/${id}`);
          setDestination(response.data);

          // Set a base price for destination bookings (could be customized)
          const basePrice = 500; // Example base price for direct destination bookings
          setTotalPrice(basePrice);
        } else {
          // Fetch vacation package details
          const response = await api.get(`/vacations/${id}`);
          setVacationPackage(response.data);

          // Calculate initial price
          setTotalPrice(response.data.price);
        }

        // Pre-fill traveler info with user data if available
        if (user) {
          setBookingData((prev) => ({
            ...prev,
            travelerInfo: [
              {
                name: user.name || "",
                email: user.email || "",
                phone: "",
              },
              ...prev.travelerInfo.slice(1),
            ],
          }));
        }

        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${bookingType} details:`, err);
        setError(`Failed to load ${bookingType} details`);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [id, user, bookingType]);

  // Update total price when booking data changes
  useEffect(() => {
    if (bookingType === "destination" && destination) {
      // For destination bookings, calculate price based on duration and number of travelers
      const basePrice = 500; // Base price per person
      const durationFactor = calculateDurationFactor(
        bookingData.startDate,
        bookingData.endDate
      );
      const adultPrice = basePrice * durationFactor;
      const childPrice = basePrice * 0.6 * durationFactor; // 40% discount for children

      const total =
        bookingData.adults * adultPrice + bookingData.children * childPrice;
      setTotalPrice(total);
    } else if (vacationPackage) {
      // For vacation packages, use the package price
      const basePrice = vacationPackage.price;
      const adultPrice = basePrice;
      const childPrice = basePrice * 0.7; // 30% discount for children

      const total =
        bookingData.adults * adultPrice + bookingData.children * childPrice;
      setTotalPrice(total);
    }
  }, [
    bookingData.adults,
    bookingData.children,
    bookingData.startDate,
    bookingData.endDate,
    vacationPackage,
    destination,
    bookingType,
  ]);

  // Helper function to calculate price factor based on duration
  const calculateDurationFactor = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Apply a discount for longer stays
    if (durationDays <= 3) return 1;
    if (durationDays <= 7) return 0.9; // 10% discount for 4-7 days
    if (durationDays <= 14) return 0.8; // 20% discount for 8-14 days
    return 0.7; // 30% discount for 15+ days
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTravelerInfoChange = (index, field, value) => {
    setBookingData((prev) => {
      const updatedTravelers = [...prev.travelerInfo];
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: value,
      };
      return {
        ...prev,
        travelerInfo: updatedTravelers,
      };
    });
  };

  const addTraveler = () => {
    setBookingData((prev) => ({
      ...prev,
      travelerInfo: [...prev.travelerInfo, { name: "", email: "", phone: "" }],
    }));
  };

  const removeTraveler = (index) => {
    if (bookingData.travelerInfo.length > 1) {
      setBookingData((prev) => {
        const updatedTravelers = [...prev.travelerInfo];
        updatedTravelers.splice(index, 1);
        return {
          ...prev,
          travelerInfo: updatedTravelers,
        };
      });
    }
  };

  const validateStep1 = () => {
    if (!bookingData.startDate) {
      alert("Please select a start date");
      return false;
    }
    if (!bookingData.endDate) {
      alert("Please select an end date");
      return false;
    }
    if (new Date(bookingData.startDate) >= new Date(bookingData.endDate)) {
      alert("End date must be after start date");
      return false;
    }
    if (bookingData.adults < 1) {
      alert("At least one adult is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < bookingData.travelerInfo.length; i++) {
      const traveler = bookingData.travelerInfo[i];
      if (!traveler.name || !traveler.email) {
        alert(`Please fill in name and email for all travelers`);
        return false;
      }
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(traveler.email)) {
        alert(`Please enter a valid email for traveler ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      // Create booking before proceeding to payment
      createBooking();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const createBooking = async () => {
    try {
      setLoading(true);

      // Create booking data based on booking type
      const bookingPayload = {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        adults: bookingData.adults,
        children: bookingData.children,
        specialRequests: bookingData.specialRequests,
        travelerInfo: bookingData.travelerInfo,
        totalPrice: totalPrice,
        paymentStatus: "pending",
      };

      // Add the appropriate ID based on booking type
      if (bookingType === "destination") {
        bookingPayload.destination = id;
      } else {
        bookingPayload.vacationPackage = id;
      }

      const response = await api.post("/bookings", bookingPayload);

      setBooking(response.data);
      setStep(3); // Proceed to payment step
      setLoading(false);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setPaymentProcessing(true);

      // Update booking with payment information
      await api.put(`/bookings/${booking._id}/payment`, {
        paymentId: paymentIntent.id,
        paymentStatus: "paid",
      });

      // Fetch updated booking
      const response = await api.get(`/bookings/${booking._id}`);
      setBooking(response.data);

      setPaymentSuccess(true);
      setStep(4); // Move to confirmation step
      setPaymentProcessing(false);
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError(
        "Payment was successful, but we had trouble updating your booking. Please contact support."
      );
      setPaymentProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    setError(
      "Payment failed. Please try again or use a different payment method."
    );
    setPaymentProcessing(false);
  };

  if (
    loading &&
    (bookingType === "destination" ? !destination : !vacationPackage)
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (
    error &&
    (bookingType === "destination" ? !destination : !vacationPackage)
  ) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Booking Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <ol className="flex items-center w-full">
              {[
                "Booking Details",
                "Traveler Information",
                "Payment",
                "Confirmation",
              ].map((stepName, index) => (
                <li
                  key={index}
                  className={`flex items-center ${index < 3 ? "w-full" : ""}`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step > index + 1
                        ? "bg-primary-600"
                        : step === index + 1
                        ? "bg-primary-500"
                        : "bg-gray-300"
                    } ${index < 3 ? "mr-2" : ""}`}
                  >
                    {step > index + 1 ? (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      step >= index + 1
                        ? "text-primary-600 font-medium"
                        : "text-gray-500"
                    } ${index < 3 ? "hidden md:inline" : ""}`}
                  >
                    {stepName}
                  </span>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step > index + 1 ? "bg-primary-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Package/Destination Summary */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {bookingType === "destination"
                  ? destination?.name
                  : vacationPackage?.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {bookingType === "destination"
                  ? "Direct Booking"
                  : `${vacationPackage?.duration || ""} days`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Base Price</p>
              <p className="text-xl font-bold text-gray-900">
                $
                {bookingType === "destination"
                  ? "500.00"
                  : vacationPackage?.price}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Booking Details */}
        {step === 1 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Booking Details
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Please select your travel dates and number of travelers
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
                      value={bookingData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={bookingData.endDate}
                      onChange={handleInputChange}
                      min={
                        bookingData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="adults"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adults
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="adults"
                      id="adults"
                      min="1"
                      value={bookingData.adults}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="children"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Children
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="children"
                      id="children"
                      min="0"
                      value={bookingData.children}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Special Requests
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Any special requirements or requests..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Traveler Information */}
        {step === 2 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Traveler Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Please provide details for all travelers
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {bookingData.travelerInfo.map((traveler, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Traveler {index + 1}
                    </h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTraveler(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor={`name-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id={`name-${index}`}
                          value={traveler.name}
                          onChange={(e) =>
                            handleTravelerInfoChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`email-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id={`email-${index}`}
                          value={traveler.email}
                          onChange={(e) =>
                            handleTravelerInfoChange(
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`phone-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id={`phone-${index}`}
                          value={traveler.phone}
                          onChange={(e) =>
                            handleTravelerInfoChange(
                              index,
                              "phone",
                              e.target.value
                            )
                          }
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={addTraveler}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="-ml-0.5 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Another Traveler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && booking && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Payment
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Please complete your payment to confirm your booking
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Booking Summary
                </h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      {bookingType === "destination"
                        ? "Destination:"
                        : "Package:"}
                    </span>
                    <span className="font-medium">
                      {bookingType === "destination"
                        ? destination?.name
                        : vacationPackage?.name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium">
                      {new Date(bookingData.startDate).toLocaleDateString()} -{" "}
                      {new Date(bookingData.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Travelers:</span>
                    <span className="font-medium">
                      {bookingData.adults}{" "}
                      {bookingData.adults === 1 ? "Adult" : "Adults"}
                      {bookingData.children > 0 &&
                        `, ${bookingData.children} ${
                          bookingData.children === 1 ? "Child" : "Children"
                        }`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Payment Method
                </h4>
                <StripeCheckout
                  amount={totalPrice * 100} // Convert to cents
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  bookingData={{
                    id: booking._id,
                    name: user?.name,
                    email: user?.email,
                    bookingType: bookingType,
                    description:
                      bookingType === "destination"
                        ? `Booking for ${destination?.name}`
                        : `Booking for ${vacationPackage?.name}`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && booking && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-green-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Booking Confirmed!
                </h3>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your booking has been successfully confirmed. A confirmation
                email has been sent to your email address.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div ref={confirmationRef}>
                <BookingConfirmationTemplate booking={booking} user={user} />
              </div>

              <div className="px-4 py-5 sm:p-6">
                <PDFGenerator
                  contentRef={confirmationRef}
                  fileName={`booking-confirmation-${booking._id}.pdf`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {step === 2 ? "Proceed to Payment" : "Next"}
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCheckout;
