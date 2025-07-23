import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

const PDFGenerator = ({
  contentRef,
  fileName = "document.pdf",
  onGenerateStart,
  onGenerateEnd,
  children,
}) => {
  const containerRef = useRef(contentRef || null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!containerRef.current) {
      console.error("No content reference provided");
      return;
    }

    setIsGenerating(true);
    onGenerateStart && onGenerateStart();

    try {
      // Hide all buttons and UI elements that shouldn't be in the PDF
      const buttonsToHide = containerRef.current.querySelectorAll(".pdf-hide");
      buttonsToHide.forEach((button) => {
        button.style.display = "none";
      });

      const content = containerRef.current;

      // Create canvas from HTML content
      const canvas = await html2canvas(content, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false,
        letterRendering: true,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        x: 0,
        y: 0,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        x: 0,
        y: 0,
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // If content is longer than one page, add more pages
      let position = 0;

      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(fileName);

      // Show the buttons again
      buttonsToHide.forEach((button) => {
        button.style.display = "";
      });

      // Show the buttons again
      buttonsToHide.forEach((button) => {
        button.style.display = "";
      });

      onGenerateEnd && onGenerateEnd(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      onGenerateEnd && onGenerateEnd(false, error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div ref={containerRef}>{children}</div>
      <div className="mt-4 flex justify-end pdf-hide">
        <button
          type="button"
          onClick={generatePDF}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              Generating...
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5 mr-2"
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
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Booking Confirmation PDF Template
export const BookingConfirmationTemplate = ({ booking, user }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aurora Voyages</h1>
          <p className="text-gray-600">Your Travel Companion in Pakistan</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900">
            Booking Confirmation
          </h2>
          <p className="text-gray-600">
            Booking #: {booking._id || booking.id}
          </p>
          <p className="text-gray-600">
            Date:{" "}
            {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name:</p>
            <p className="font-medium">{user?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-medium">{user?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name:</p>
            <p className="font-medium">{user?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-medium">{user?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Package:</p>
              <p className="font-medium">
                {booking.vacationPackage?.name || "Custom Itinerary"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Destination:</p>
              <p className="font-medium">
                {booking.destination?.name || "Multiple Destinations"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Start Date:</p>
              <p className="font-medium">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">End Date:</p>
              <p className="font-medium">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Duration:</p>
              <p className="font-medium">
                {Math.ceil(
                  (new Date(booking.endDate) - new Date(booking.startDate)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </p>
            </div>
            <div>
              <p className="text-gray-600">Status:</p>
              <p className="font-medium capitalize">{booking.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Itinerary PDF Template - Compact Single Page Version
export const ItineraryTemplate = ({
  booking,
  vacationPackage,
  destination,
  weatherData,
  travelRequirements,
}) => {
  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aurora Voyages</h1>
          <p className="text-xs text-gray-600">
            Your Travel Companion in Pakistan
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-gray-900">
            Travel Itinerary
          </h2>
          <p className="text-xs text-gray-600">
            Booking #: {booking._id || booking.id}
          </p>
          <p className="text-xs text-gray-600">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Trip Overview</h3>
        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs text-gray-600">Package:</p>
              <p className="text-xs font-medium">{vacationPackage.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Duration:</p>
              <p className="text-xs font-medium">
                {vacationPackage.duration} days
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Status:</p>
              <p className="text-xs font-medium capitalize">{booking.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Start Date:</p>
              <p className="text-xs font-medium">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">End Date:</p>
              <p className="text-xs font-medium">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Destination:</p>
              <p className="text-xs font-medium">
                {destination?.name ||
                  vacationPackage.destination?.name ||
                  "Multiple Destinations"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// eTicket PDF Template - Compact Single Page Version
export const TicketTemplate = ({ ticket, user, destination }) => {
  // Generate a unique ticket ID if not provided
  const ticketId =
    ticket.id ||
    `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  // Generate verification URL
  const verificationUrl = `${window.location.origin}/verify-ticket/${ticketId}`;

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aurora Voyages</h1>
          <p className="text-xs text-gray-600">
            Your Travel Companion in Pakistan
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-gray-900">e-Ticket</h2>
          <p className="text-xs text-gray-600">Ticket #: {ticketId}</p>
          <p className="text-xs text-gray-600">
            Issued: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Booking PDF Template - Compact Single Page Version
export const BookingPDFTemplate = ({ booking, user }) => {
  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aurora Voyages</h1>
          <p className="text-xs text-gray-600">
            Your Travel Companion in Pakistan
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-gray-900">
            Booking Details
          </h2>
          <p className="text-xs text-gray-600">
            Booking #: {booking._id || booking.id}
          </p>
          <p className="text-xs text-gray-600">
            Date:{" "}
            {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Map PDF Template - For destination maps
export const MapTemplate = ({ destination, mapData, locationIqApiKey }) => {
  // Generate static map URL
  const staticMapUrl = `https://maps.locationiq.com/v3/staticmap?key=${locationIqApiKey}&center=${
    destination.coordinates?.latitude || mapData.center?.lat
  },${
    destination.coordinates?.longitude || mapData.center?.lng
  }&zoom=10&size=600x400&format=png&markers=icon:large-red-cutout|${
    destination.coordinates?.latitude || mapData.center?.lat
  },${destination.coordinates?.longitude || mapData.center?.lng}`;

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aurora Voyages</h1>
          <p className="text-xs text-gray-600">
            Your Travel Companion in Pakistan
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-gray-900">
            Destination Map
          </h2>
          <p className="text-xs text-gray-600">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Destination Information */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1">{destination.name}</h3>
        <p className="text-xs text-gray-600 mb-2">
          {destination.description?.substring(0, 200)}
          {destination.description?.length > 200 ? "..." : ""}
        </p>
      </div>

      {/* Map Image */}
      <div className="mb-4">
        <img
          src={staticMapUrl}
          alt={`Map of ${destination.name}`}
          className="w-full h-auto rounded-lg border border-gray-200"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      </div>

      {/* Coordinates */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-1">Coordinates</h4>
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-xs">
            Latitude:{" "}
            {destination.coordinates?.latitude || mapData.center?.lat || "N/A"},
            Longitude:{" "}
            {destination.coordinates?.longitude || mapData.center?.lng || "N/A"}
          </p>
        </div>
      </div>

      {/* Attractions */}
      {destination.attractions && destination.attractions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1">Attractions</h4>
          <div className="bg-gray-50 p-2 rounded-lg">
            <ul className="text-xs space-y-1">
              {destination.attractions.slice(0, 8).map((attraction, index) => (
                <li key={index}>• {attraction}</li>
              ))}
              {destination.attractions.length > 8 && (
                <li>• And {destination.attractions.length - 8} more...</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          This map is provided for reference purposes only.
        </p>
        <p className="text-xs text-gray-500">
          For the most up-to-date information, please check with local
          authorities.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          © Aurora Voyages {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default PDFGenerator;
