import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { format } from "date-fns";
import ComplianceChecker from "../components/itinerary/ComplianceChecker";
import PDFGenerator, {
  ItineraryTemplate,
} from "../components/pdf/PDFGenerator";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ItineraryDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const pdfRef = useRef(null);

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complianceResults, setComplianceResults] = useState(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [travelRequirements, setTravelRequirements] = useState([]);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [destination, setDestination] = useState(null);

  // Fetch itinerary details
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/itineraries/${id}`);
        setItinerary(response.data);

        // If there are items in the itinerary, fetch the first destination's details
        if (response.data.items && response.data.items.length > 0) {
          const firstDestination = response.data.items[0].destination;
          setDestination(firstDestination);

          // Fetch weather data for the first destination
          try {
            const weatherResponse = await api.get(`/weather/current`, {
              params: { city: firstDestination.name },
            });
            setWeatherData(weatherResponse.data);
          } catch (weatherErr) {
            console.error("Error fetching weather data:", weatherErr);
            // Don't set an error, just continue without weather data
          }

          // Fetch travel requirements for the first destination
          try {
            const requirementsResponse = await api.get(
              `/travel-requirements/destination/${firstDestination._id}`
            );
            setTravelRequirements(requirementsResponse.data);
          } catch (reqErr) {
            console.error("Error fetching travel requirements:", reqErr);
            // Don't set an error, just continue without requirements data
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError("Failed to load itinerary details. Please try again later.");
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchItinerary();
    }
  }, [isAuthenticated, id]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/itineraries/${id}` } });
    }
  }, [isAuthenticated, navigate, id]);

  // Check compliance with travel requirements
  const checkCompliance = async () => {
    try {
      setLoading(true);
      const response = await api.post("/itineraries/check-compliance", {
        items: itinerary.items.map((item) => ({
          destination: item.destination._id,
        })),
      });

      setComplianceResults(response.data);
      setShowComplianceModal(true);
      setLoading(false);
    } catch (err) {
      console.error("Error checking compliance:", err);
      setError("Failed to check travel requirements. Please try again.");
      setLoading(false);
    }
  };

  // Toggle PDF preview
  const togglePdfPreview = () => {
    setShowPdfPreview(!showPdfPreview);
  };

  // Generate PDF
  const generatePDF = async () => {
    try {
      setLoading(true);

      if (!itinerary || !itinerary.items || itinerary.items.length === 0) {
        throw new Error("No itinerary data available");
      }

      // Create a temporary div to render the PDF template
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Render the ItineraryTemplate component to the temporary div
      const ReactDOM = await import("react-dom/client");
      const React = await import("react");

      const root = ReactDOM.createRoot(tempDiv);
      root.render(
        React.createElement(ItineraryTemplate, {
          booking: {
            _id: itinerary._id,
            startDate: itinerary.startDate,
            endDate: itinerary.endDate,
            status: itinerary.isPublic ? "public" : "private",
          },
          vacationPackage: {
            name: itinerary.name,
            duration: Math.ceil(
              (new Date(itinerary.endDate) - new Date(itinerary.startDate)) /
                (1000 * 60 * 60 * 24)
            ),
            schedule: itinerary.items.map((item) => ({
              day: item.day,
              title: item.destination.name,
              morning:
                item.activities && item.activities.length > 0
                  ? item.activities[0]
                  : "Free time",
              afternoon:
                item.activities && item.activities.length > 1
                  ? item.activities[1]
                  : "Free time",
              evening:
                item.activities && item.activities.length > 2
                  ? item.activities[2]
                  : "Free time",
            })),
            includedTransport: itinerary.items
              .filter((item) => item.transportation)
              .map((item) => `Day ${item.day}: ${item.transportation}`),
            includedHotels: itinerary.items
              .filter((item) => item.accommodation)
              .map(
                (item) =>
                  `Day ${item.day}: ${item.accommodation} in ${item.destination.name}`
              ),
            activities: itinerary.items.flatMap((item) =>
              item.activities
                ? item.activities.map((act) => `Day ${item.day}: ${act}`)
                : []
            ),
          },
          destination,
          weatherData,
          travelRequirements,
        })
      );

      // Wait a moment for images to load (increased to 1.5 seconds for map rendering)
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
        allowTaint: true, // Allow cross-origin images
        imageTimeout: 5000, // Increase timeout for image loading
      });

      // A4 dimensions
      const pageWidth = 210;
      const pageHeight = 297;

      // Calculate dimensions to fit on one page
      const contentRatio = canvas.height / canvas.width;
      const imgWidth = pageWidth - 20; // Add 10mm margins on each side

      // Calculate height based on width, but ensure it fits on one page
      let imgHeight = imgWidth * contentRatio;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      // If the height exceeds the page height, scale it down to fit
      if (imgHeight > pageHeight - 20) {
        imgHeight = pageHeight - 20; // 10mm margins on top and bottom
        // Recalculate width to maintain aspect ratio
        const adjustedWidth = imgHeight / contentRatio;
        // Center the image horizontally
        const xPos = (pageWidth - adjustedWidth) / 2;
        const yPos = 10; // 10mm from top edge

        // Add image to PDF - fit to one page
        pdf.addImage(imgData, "PNG", xPos, yPos, adjustedWidth, imgHeight);
      } else {
        // Position in the center of the page
        const xPos = 10; // 10mm from left edge
        const yPos = (pageHeight - imgHeight) / 2; // Center vertically

        // Add image to PDF - fit to one page
        pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);
      }

      // Save PDF
      pdf.save(`itinerary-${itinerary._id || id}.pdf`);

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);

      // Show the PDF preview for user reference
      setShowPdfPreview(true);
      setLoading(false);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      setLoading(false);
    }
  };

  if (loading && !itinerary) {
    return <LoadingSpinner />;
  }

  if (error && !itinerary) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
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
            <div className="mt-6 text-center">
              <Link
                to="/itineraries"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Itineraries
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {itinerary.name}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {format(new Date(itinerary.startDate), "MMM d, yyyy")} -{" "}
                {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                <span className="ml-2">
                  {itinerary.isPublic ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Private
                    </span>
                  )}
                </span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to={`/itineraries/${itinerary._id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={checkCompliance}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Check Requirements
              </button>
              <button
                type="button"
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Generate PDF
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
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
          )}

          {/* Itinerary Timeline */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Itinerary Timeline
            </h2>

            <div className="flow-root">
              <ul className="-mb-8">
                {itinerary.items.map((item, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== itinerary.items.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            <span className="text-white font-medium">
                              {item.day}
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.destination.name}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.destination.type}
                              </span>
                            </div>

                            {item.destination.images &&
                              item.destination.images.length > 0 && (
                                <div className="mt-2 h-32 w-full overflow-hidden rounded-lg">
                                  <img
                                    src={`/images/${item.destination.images[0]}`}
                                    alt={item.destination.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}

                            <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-4">
                              {item.accommodation && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    Accommodation
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {item.accommodation}
                                  </p>
                                </div>
                              )}

                              {item.transportation && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    Transportation
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {item.transportation}
                                  </p>
                                </div>
                              )}
                            </div>

                            {item.activities && item.activities.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-500">
                                  Activities
                                </h4>
                                <ul className="mt-1 space-y-1">
                                  {item.activities.map((activity, actIndex) => (
                                    <li
                                      key={actIndex}
                                      className="text-sm text-gray-900 flex items-start"
                                    >
                                      <svg
                                        className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.notes && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-500">
                                  Notes
                                </h4>
                                <p className="mt-1 text-sm text-gray-900">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Checker Modal */}
      {showComplianceModal && complianceResults && (
        <ComplianceChecker
          results={complianceResults}
          onClose={() => setShowComplianceModal(false)}
        />
      )}

      {/* PDF Preview Modal */}
      {showPdfPreview && itinerary && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Itinerary PDF Preview
              </h3>
              <button
                type="button"
                onClick={togglePdfPreview}
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
              <div
                ref={pdfRef}
                className="border border-gray-200 rounded-lg shadow-sm"
              >
                <ItineraryTemplate
                  booking={{
                    _id: itinerary._id,
                    startDate: itinerary.startDate,
                    endDate: itinerary.endDate,
                    status: itinerary.isPublic ? "public" : "private",
                  }}
                  vacationPackage={{
                    name: itinerary.name,
                    duration: Math.ceil(
                      (new Date(itinerary.endDate) -
                        new Date(itinerary.startDate)) /
                        (1000 * 60 * 60 * 24)
                    ),
                    schedule: itinerary.items.map((item) => ({
                      day: item.day,
                      title: item.destination.name,
                      morning:
                        item.activities && item.activities.length > 0
                          ? item.activities[0]
                          : "Free time",
                      afternoon:
                        item.activities && item.activities.length > 1
                          ? item.activities[1]
                          : "Free time",
                      evening:
                        item.activities && item.activities.length > 2
                          ? item.activities[2]
                          : "Free time",
                    })),
                    includedTransport: itinerary.items
                      .filter((item) => item.transportation)
                      .map((item) => `Day ${item.day}: ${item.transportation}`),
                    includedHotels: itinerary.items
                      .filter((item) => item.accommodation)
                      .map(
                        (item) =>
                          `Day ${item.day}: ${item.accommodation} in ${item.destination.name}`
                      ),
                    activities: itinerary.items.flatMap((item) =>
                      item.activities
                        ? item.activities.map(
                            (act) => `Day ${item.day}: ${act}`
                          )
                        : []
                    ),
                  }}
                  destination={destination}
                  weatherData={weatherData}
                  travelRequirements={travelRequirements}
                />
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This is a preview of how your PDF will look. When you
                      download it, all content will be fitted to a single page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3 pdf-hide">
              <button
                type="button"
                onClick={togglePdfPreview}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Close
              </button>
              <button
                type="button"
                onClick={generatePDF}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDetail;
