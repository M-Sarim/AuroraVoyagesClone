import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageHelper";
import ImageFallback from "../components/ImageFallback";
import PDFGenerator, {
  TicketTemplate,
  BookingPDFTemplate,
} from "../components/pdf/PDFGenerator";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const bookingRef = useRef(null);
  const ticketRef = useRef(null);
  const [travelRequirements, setTravelRequirements] = useState([]);
  const [showTicketPdfPreview, setShowTicketPdfPreview] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);

        // Fetch travel requirements for the destination
        if (response.data.destination && response.data.destination._id) {
          try {
            const requirementsResponse = await api.get(
              `/travel-requirements/destination/${response.data.destination._id}`
            );
            setTravelRequirements(requirementsResponse.data);
          } catch (reqErr) {
            console.error("Error fetching travel requirements:", reqErr);
            // Don't set an error, just continue without requirements data
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch booking details");
        setLoading(false);
        console.error("Error fetching booking details:", err);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    try {
      setIsCancelling(true);
      await api.put(`/bookings/${id}/cancel`, { cancellationReason });

      // Update booking status locally
      setBooking((prev) => ({
        ...prev,
        status: "cancelled",
        cancellationReason,
      }));

      setCancelModalOpen(false);
      setIsCancelling(false);
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
      setIsCancelling(false);
      console.error("Error cancelling booking:", err);
    }
  };

  const generatePDF = async () => {
    try {
      // Create a temporary div to render the PDF template
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Render the BookingPDFTemplate component to the temporary div
      const ReactDOM = await import("react-dom/client");
      const React = await import("react");

      const root = ReactDOM.createRoot(tempDiv);
      root.render(React.createElement(BookingPDFTemplate, { booking, user }));

      // Wait a moment for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate PDF from the rendered template - optimized for single page
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5, // Reduced scale for better fit
        logging: false,
        useCORS: true,
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight,
        x: 0,
        y: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 dimensions
      const pageWidth = 210;
      const pageHeight = 297;

      // Calculate dimensions to fit on one page
      const contentRatio = canvas.height / canvas.width;
      const imgWidth = pageWidth - 20; // Add 10mm margins on each side
      const imgHeight = imgWidth * contentRatio;

      // Position in the center of the page
      const xPos = 10; // 10mm from left edge
      const yPos = 10; // 10mm from top edge

      // Add image to PDF - fit to one page
      pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);

      pdf.save(`booking-${id}.pdf`);

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Toggle Ticket PDF Preview
  const toggleTicketPdfPreview = (requirement = null) => {
    if (requirement) {
      setSelectedRequirement(requirement);
    } else {
      setSelectedRequirement(null);
    }
    setShowTicketPdfPreview(!showTicketPdfPreview);
  };

  // Generate Ticket PDF
  const generateTicketPDF = async () => {
    try {
      if (!selectedRequirement || !booking.destination) {
        throw new Error("No ticket content available");
      }

      // Create a temporary div to render the PDF template
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Render the TicketTemplate component to the temporary div
      const ReactDOM = await import("react-dom/client");
      const React = await import("react");

      const root = ReactDOM.createRoot(tempDiv);
      root.render(
        React.createElement(TicketTemplate, {
          ticket: selectedRequirement,
          user,
          destination: booking.destination,
        })
      );

      // Wait a moment for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate PDF from the rendered template - optimized for single page
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5, // Reduced scale for better fit
        useCORS: true, // Enable CORS for images
        logging: false,
        letterRendering: true,
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight,
        x: 0,
        y: 0,
      });

      // A4 dimensions
      const pageWidth = 210;
      const pageHeight = 297;

      // Calculate dimensions to fit on one page
      const contentRatio = canvas.height / canvas.width;
      const imgWidth = pageWidth - 20; // Add 10mm margins on each side
      const imgHeight = imgWidth * contentRatio;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      // Position in the center of the page
      const xPos = 10; // 10mm from left edge
      const yPos = 10; // 10mm from top edge

      // Add image to PDF - fit to one page
      pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);

      // Save PDF
      pdf.save(
        `ticket-${selectedRequirement.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`
      );

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error("Error generating ticket PDF:", err);
      alert("Failed to generate ticket PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Error
          </h1>
          <p className="mt-4 text-base text-gray-500">
            {error || "Booking not found"}
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determine what to display based on whether it's a package or destination booking
  const bookingTitle = booking.vacationPackage
    ? booking.vacationPackage.name
    : booking.destination
    ? booking.destination.name
    : "Booking";

  const bookingImage = booking.vacationPackage
    ? booking.vacationPackage.images?.[0]
    : booking.destination
    ? booking.destination.images?.[0]
    : null;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Booking Details Card */}
      <div
        ref={bookingRef}
        className="bg-white shadow overflow-hidden sm:rounded-lg"
      >
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Booking Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Booking ID: {booking._id}
            </p>
          </div>
          <div className="flex space-x-3 pdf-hide">
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
            {booking.status === "pending" && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {/* Booking Image */}
        {bookingImage && (
          <div className="h-64 overflow-hidden">
            <ImageFallback
              src={getImageUrl(bookingImage)}
              alt={bookingTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Status Badge */}
        <div className="px-4 py-3 bg-gray-50 border-t border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : booking.status === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Booking Information */}
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Booking Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {booking.vacationPackage
                  ? "Vacation Package"
                  : "Destination Only"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {bookingTitle}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Travel Dates
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Price</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ${booking.totalPrice.toFixed(2)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Payment Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : booking.paymentStatus === "refunded"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.paymentStatus.charAt(0).toUpperCase() +
                    booking.paymentStatus.slice(1)}
                </span>
              </dd>
            </div>

            {/* Traveler Information */}
            <div className="bg-white px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-500">
                Traveler Information
              </h4>
              <div className="mt-4 border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.travelerInfo && booking.travelerInfo.length > 0 ? (
                      booking.travelerInfo.map((traveler, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {traveler.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {traveler.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {traveler.phone || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          No traveler information available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Special Requests
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.specialRequests}
                </dd>
              </div>
            )}

            {/* Cancellation Reason (if cancelled) */}
            {booking.status === "cancelled" && booking.cancellationReason && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Cancellation Reason
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.cancellationReason}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Package/Destination Details */}
      {booking.vacationPackage && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Package Details
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.vacationPackage.duration} days
                </dd>
              </div>
              {booking.vacationPackage.activities &&
                booking.vacationPackage.activities.length > 0 && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Activities
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {booking.vacationPackage.activities.map(
                          (activity, index) => (
                            <li
                              key={index}
                              className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                            >
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">
                                  {activity}
                                </span>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </dd>
                  </div>
                )}
            </dl>
          </div>
        </div>
      )}

      {booking.destination && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Destination Details
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.destination.country}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.destination.type}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Travel Requirements Section */}
      {travelRequirements && travelRequirements.length > 0 && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Travel Requirements
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Required permits and documents for your trip
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {travelRequirements.map((requirement, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {requirement.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {requirement.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {requirement.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            requirement.isRequired
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {requirement.isRequired ? "Required" : "Optional"}
                        </span>
                        {requirement.cost && requirement.cost.amount > 0 && (
                          <span className="ml-2">
                            Cost: {requirement.cost.amount}{" "}
                            {requirement.cost.currency}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => toggleTicketPdfPreview(requirement)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Generate eTicket
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex justify-between pdf-hide">
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>

        {booking.status === "confirmed" && booking.paymentStatus === "paid" && (
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            onClick={() => navigate(`/ar-navigation/${id}`)}
          >
            View Offline Map
          </button>
        )}
      </div>

      {/* Ticket PDF Preview Modal */}
      {showTicketPdfPreview && selectedRequirement && booking.destination && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                eTicket Preview
              </h3>
              <button
                type="button"
                onClick={() => toggleTicketPdfPreview()}
                className="text-gray-400 hover:text-gray-500"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div ref={ticketRef}>
                <TicketTemplate
                  ticket={selectedRequirement}
                  user={user}
                  destination={booking.destination}
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3 pdf-hide">
              <button
                type="button"
                onClick={() => toggleTicketPdfPreview()}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Close
              </button>
              <button
                type="button"
                onClick={generateTicketPDF}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel this booking? This
                        action cannot be undone.
                      </p>
                      <div className="mt-4">
                        <label
                          htmlFor="cancellationReason"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reason for Cancellation
                        </label>
                        <textarea
                          id="cancellationReason"
                          name="cancellationReason"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={cancellationReason}
                          onChange={(e) =>
                            setCancellationReason(e.target.value)
                          }
                          placeholder="Please provide a reason for cancellation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isCancelling ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setCancelModalOpen(false)}
                  disabled={isCancelling}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
