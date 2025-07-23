import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageHelper";
import {
  openInGoogleMaps,
  openDirectionsInGoogleMaps,
} from "../utils/mapUtils";
import ImageFallback from "../components/ImageFallback";
import MapComponent from "../components/maps/GoogleMap";
import InteractiveMap from "../components/maps/InteractiveMap";
import WeatherWidget from "../components/weather/WeatherWidget";
import TransportOptions from "../components/transport/TransportOptions";
import PDFGenerator, { MapTemplate } from "../components/pdf/PDFGenerator";
import ARViewer from "../components/ar/ARViewer";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const pdfRef = useRef(null);

  const [destination, setDestination] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherLocationKey, setWeatherLocationKey] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mapData, setMapData] = useState(null);
  const [showMapPdfPreview, setShowMapPdfPreview] = useState(false);

  // Handle Book Now button click
  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to login page with a return URL
      navigate(`/login?redirect=/destinations/${id}`);
      return;
    }

    // Redirect to booking checkout page with destination ID and type
    navigate(`/checkout/${id}?type=destination`);
  };

  // Toggle Map PDF Preview
  const toggleMapPdfPreview = () => {
    setShowMapPdfPreview(!showMapPdfPreview);
  };

  // Generate Map PDF
  const generateMapPDF = async () => {
    try {
      setLoading(true);

      if (!destination || !mapData) {
        throw new Error("No destination or map data available");
      }

      // First, show the PDF preview
      setShowMapPdfPreview(true);

      // Create a direct PDF without using html2canvas
      const generateDirectPDF = () => {
        try {
          // Create PDF
          const pdf = new jsPDF("p", "mm", "a4");
          const pageWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const margin = 15; // margin in mm
          const contentWidth = pageWidth - margin * 2;

          // Add header
          pdf.setFontSize(20);
          pdf.setTextColor(0, 0, 0);
          pdf.text("Aurora Voyages", margin, margin + 5);

          pdf.setFontSize(12);
          pdf.setTextColor(100, 100, 100);
          pdf.text("Your Travel Companion in Pakistan", margin, margin + 12);

          pdf.setFontSize(16);
          pdf.setTextColor(0, 0, 0);
          pdf.text("Destination Map", pageWidth - margin - 40, margin + 5);

          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `Generated: ${new Date().toLocaleDateString()}`,
            pageWidth - margin - 40,
            margin + 12
          );

          // Add destination name and description
          pdf.setFontSize(16);
          pdf.setTextColor(0, 0, 0);
          pdf.text(destination.name, margin, margin + 30);

          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);

          // Handle description text wrapping
          const description =
            destination.description?.substring(0, 200) + "...";
          const splitDescription = pdf.splitTextToSize(
            description,
            contentWidth
          );
          pdf.text(splitDescription, margin, margin + 38);

          // Calculate position after description
          const descriptionHeight = splitDescription.length * 5; // Approximate height based on number of lines
          let yPosition = margin + 38 + descriptionHeight + 10;

          // Add map image
          // First, create the map URL
          const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=${
            process.env.REACT_APP_LOCATIONIQ_API_KEY
          }&center=${
            destination.coordinates?.latitude || mapData.center?.lat
          },${
            destination.coordinates?.longitude || mapData.center?.lng
          }&zoom=10&size=600x400&format=png&markers=icon:large-red-cutout|${
            destination.coordinates?.latitude || mapData.center?.lat
          },${destination.coordinates?.longitude || mapData.center?.lng}`;

          // Add a loading placeholder for the map
          pdf.setDrawColor(200, 200, 200);
          pdf.setFillColor(245, 245, 245);
          pdf.roundedRect(margin, yPosition, contentWidth, 80, 3, 3, "FD");

          pdf.setFontSize(12);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `Loading map of ${destination.name}...`,
            pageWidth / 2,
            yPosition + 40,
            { align: "center" }
          );

          // Use a more direct approach to add the map to the PDF
          // First, create a data URL for the map using fetch
          const addMapToPdf = async () => {
            try {
              // Create a direct URL with authentication in the URL (for static map)
              const directMapUrl = `https://maps.locationiq.com/v3/staticmap?key=${
                process.env.REACT_APP_LOCATIONIQ_API_KEY
              }&center=${
                destination.coordinates?.latitude || mapData.center?.lat
              },${
                destination.coordinates?.longitude || mapData.center?.lng
              }&zoom=10&size=600x400&format=png&markers=icon:large-red-cutout|${
                destination.coordinates?.latitude || mapData.center?.lat
              },${destination.coordinates?.longitude || mapData.center?.lng}`;

              // Fetch the image directly as a blob
              const response = await fetch(directMapUrl);

              if (!response.ok) {
                throw new Error(
                  `Failed to fetch map image: ${response.status} ${response.statusText}`
                );
              }

              const blob = await response.blob();

              // Convert blob to base64
              const reader = new FileReader();
              reader.onloadend = function () {
                try {
                  const base64data = reader.result;

                  // Calculate image dimensions
                  const imgWidth = contentWidth;
                  const imgHeight = (400 * imgWidth) / 600; // Based on the 600x400 size requested

                  // Add the image to the PDF
                  pdf.addImage(
                    base64data,
                    "PNG",
                    margin,
                    yPosition,
                    imgWidth,
                    imgHeight
                  );

                  // Continue with the rest of the PDF content
                  // Add coordinates section
                  yPosition += imgHeight + 10;

                  // Add coordinates
                  pdf.setFontSize(12);
                  pdf.setTextColor(0, 0, 0);
                  pdf.text("Coordinates", margin, yPosition);

                  pdf.setDrawColor(200, 200, 200);
                  pdf.setFillColor(245, 245, 245);
                  pdf.roundedRect(
                    margin,
                    yPosition + 5,
                    contentWidth,
                    15,
                    3,
                    3,
                    "FD"
                  );

                  pdf.setFontSize(10);
                  pdf.setTextColor(80, 80, 80);
                  pdf.text(
                    `Latitude: ${
                      destination.coordinates?.latitude ||
                      mapData.center?.lat ||
                      "N/A"
                    }, ` +
                      `Longitude: ${
                        destination.coordinates?.longitude ||
                        mapData.center?.lng ||
                        "N/A"
                      }`,
                    margin + 5,
                    yPosition + 14
                  );

                  yPosition += 30;

                  // Add attractions if available
                  if (
                    destination.attractions &&
                    destination.attractions.length > 0
                  ) {
                    pdf.setFontSize(12);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text("Attractions", margin, yPosition);

                    pdf.setDrawColor(200, 200, 200);
                    pdf.setFillColor(245, 245, 245);

                    const attractionsHeight = Math.min(
                      destination.attractions.length * 7 + 10,
                      60
                    );
                    pdf.roundedRect(
                      margin,
                      yPosition + 5,
                      contentWidth,
                      attractionsHeight,
                      3,
                      3,
                      "FD"
                    );

                    pdf.setFontSize(10);
                    pdf.setTextColor(80, 80, 80);

                    destination.attractions
                      .slice(0, 8)
                      .forEach((attraction, index) => {
                        pdf.text(
                          `• ${attraction}`,
                          margin + 5,
                          yPosition + 14 + index * 7
                        );
                      });

                    if (destination.attractions.length > 8) {
                      pdf.text(
                        `• And ${destination.attractions.length - 8} more...`,
                        margin + 5,
                        yPosition + 14 + 8 * 7
                      );
                    }

                    yPosition += attractionsHeight + 15;
                  }

                  // Add footer
                  pdf.setFontSize(8);
                  pdf.setTextColor(120, 120, 120);
                  pdf.text(
                    "This map is provided for reference purposes only.",
                    pageWidth / 2,
                    pageHeight - margin - 15,
                    { align: "center" }
                  );
                  pdf.text(
                    "For the most up-to-date information, please check with local authorities.",
                    pageWidth / 2,
                    pageHeight - margin - 10,
                    { align: "center" }
                  );
                  pdf.text(
                    `© Aurora Voyages ${new Date().getFullYear()}`,
                    pageWidth / 2,
                    pageHeight - margin - 5,
                    { align: "center" }
                  );

                  // Save the PDF
                  pdf.save(
                    `map-${destination.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}.pdf`
                  );

                  // Update UI state
                  setLoading(false);
                  setShowMapPdfPreview(false);
                } catch (err) {
                  console.error("Error adding map to PDF:", err);
                  fallbackPdfGeneration();
                }
              };

              reader.onerror = function () {
                console.error("Error reading blob as data URL");
                fallbackPdfGeneration();
              };

              reader.readAsDataURL(blob);
            } catch (err) {
              console.error("Error fetching map image:", err);
              fallbackPdfGeneration();
            }
          };

          // Fallback PDF generation without map image
          const fallbackPdfGeneration = () => {
            try {
              // Add a placeholder for the map
              pdf.setDrawColor(200, 200, 200);
              pdf.setFillColor(245, 245, 245);
              pdf.roundedRect(margin, yPosition, contentWidth, 80, 3, 3, "FD");

              pdf.setFontSize(12);
              pdf.setTextColor(100, 100, 100);
              pdf.text(
                `Map of ${destination.name} (Coordinates: ${
                  destination.coordinates?.latitude || mapData.center?.lat
                }, ${
                  destination.coordinates?.longitude || mapData.center?.lng
                })`,
                pageWidth / 2,
                yPosition + 40,
                { align: "center" }
              );

              yPosition += 90;

              // Add coordinates
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text("Coordinates", margin, yPosition);

              pdf.setDrawColor(200, 200, 200);
              pdf.setFillColor(245, 245, 245);
              pdf.roundedRect(
                margin,
                yPosition + 5,
                contentWidth,
                15,
                3,
                3,
                "FD"
              );

              pdf.setFontSize(10);
              pdf.setTextColor(80, 80, 80);
              pdf.text(
                `Latitude: ${
                  destination.coordinates?.latitude ||
                  mapData.center?.lat ||
                  "N/A"
                }, ` +
                  `Longitude: ${
                    destination.coordinates?.longitude ||
                    mapData.center?.lng ||
                    "N/A"
                  }`,
                margin + 5,
                yPosition + 14
              );

              // Add footer
              pdf.setFontSize(8);
              pdf.setTextColor(120, 120, 120);
              pdf.text(
                "This map is provided for reference purposes only.",
                pageWidth / 2,
                pageHeight - margin - 15,
                { align: "center" }
              );
              pdf.text(
                "For the most up-to-date information, please check with local authorities.",
                pageWidth / 2,
                pageHeight - margin - 10,
                { align: "center" }
              );
              pdf.text(
                `© Aurora Voyages ${new Date().getFullYear()}`,
                pageWidth / 2,
                pageHeight - margin - 5,
                { align: "center" }
              );

              // Save the PDF
              pdf.save(
                `map-${destination.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
              );

              // Update UI state
              setLoading(false);
              setShowMapPdfPreview(false);
            } catch (err) {
              console.error("Error in fallback PDF generation:", err);
              // Basic fallback - just save whatever we have
              pdf.save(
                `map-${destination.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
              );
              setLoading(false);
              setShowMapPdfPreview(false);
            }
          };

          // Start the process
          addMapToPdf();

          // Note: The rest of the PDF content is now handled inside the addMapToPdf function
          // so we don't need to add coordinates, attractions, or footer content here

          // Note: We don't save the PDF here anymore
          // It will be saved after the map image is loaded in addMapImageToPdf()
        } catch (err) {
          console.error("Error generating direct PDF:", err);
          // Fall back to html2canvas method
          generateHtml2CanvasPDF();
        }
      };

      // Fallback method using html2canvas
      const generateHtml2CanvasPDF = async () => {
        if (pdfRef.current) {
          try {
            // Create canvas from HTML content
            const canvas = await html2canvas(pdfRef.current, {
              scale: 2, // Higher scale for better quality
              useCORS: true, // Enable CORS for images
              allowTaint: true, // Allow tainted canvas
              logging: false,
              letterRendering: true,
              imageTimeout: 0, // No timeout for images
              onclone: (document) => {
                // This function runs on the cloned document before rendering
                // We can use it to ensure images are loaded
                const images = document.querySelectorAll("img");
                images.forEach((img) => {
                  // Force image to be loaded
                  if (img.complete) {
                    // If image is already loaded, do nothing
                  } else {
                    // If image is not loaded, set a simple event listener
                    img.addEventListener("load", () => {
                      // Image loaded
                    });
                    img.addEventListener("error", () => {
                      console.error("Error loading image for PDF");
                    });
                  }
                });
              },
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
            pdf.save(
              `map-${destination.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
            );

            setLoading(false);
          } catch (err) {
            console.error("Error generating PDF:", err);
            setError("Failed to generate PDF. Please try again.");
            setLoading(false);
          }
        } else {
          setError("PDF content not available. Please try again.");
          setLoading(false);
        }
      };

      // Use the direct PDF generation method
      setTimeout(() => {
        generateDirectPDF();
      }, 500);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        setLoading(true);
        // Fetch destination details
        const destResponse = await api.get(`/destinations/${id}`);
        setDestination(destResponse.data);

        // Fetch related vacation packages
        const packagesResponse = await api.get("/vacations", {
          params: { destination: id },
        });
        setRelatedPackages(packagesResponse.data);

        // Use the stored weatherLocationKey if available
        if (destResponse.data.weatherLocationKey) {
          setWeatherLocationKey(destResponse.data.weatherLocationKey);
        }
        // Otherwise, try to get it from the API if location is available
        else if (destResponse.data.location) {
          try {
            const weatherResponse = await api.get(
              `/weather/location?q=${destResponse.data.location}`
            );
            setWeatherLocationKey(weatherResponse.data.key);

            // Update the destination with the new weatherLocationKey
            if (weatherResponse.data.key) {
              try {
                await api.put(`/destinations/${id}`, {
                  weatherLocationKey: weatherResponse.data.key,
                });
                console.log("Updated destination with weather location key");
              } catch (updateErr) {
                console.error(
                  "Error updating destination with weather location key:",
                  updateErr
                );
              }
            }
          } catch (weatherErr) {
            console.error("Error fetching weather location:", weatherErr);
          }
        }

        // Fetch map data for the destination
        try {
          const mapResponse = await api.get(`/maps/region/${id}`);
          setMapData(mapResponse.data);
        } catch (mapErr) {
          console.error("Error fetching map data:", mapErr);
          // Create basic map data if API call fails
          if (destResponse.data.coordinates) {
            setMapData({
              id: destResponse.data._id,
              name: destResponse.data.name,
              center: {
                lat: destResponse.data.coordinates.latitude,
                lng: destResponse.data.coordinates.longitude,
              },
              zoom: 10,
              staticMapUrl: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&center=${destResponse.data.coordinates.latitude},${destResponse.data.coordinates.longitude}&zoom=10&size=600x400&format=png&markers=icon:large-red-cutout|${destResponse.data.coordinates.latitude},${destResponse.data.coordinates.longitude}`,
              pointsOfInterest: destResponse.data.attractions
                ? destResponse.data.attractions.map((attraction, index) => ({
                    id: `poi-${index}`,
                    name: attraction,
                    position: {
                      lat:
                        destResponse.data.coordinates.latitude +
                        (Math.random() - 0.5) * 0.05,
                      lng:
                        destResponse.data.coordinates.longitude +
                        (Math.random() - 0.5) * 0.05,
                    },
                  }))
                : [],
            });
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch destination details");
        setLoading(false);
        console.error("Error fetching destination details:", err);
      }
    };

    fetchDestinationData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error || "Destination not found"}</p>
        <Link
          to="/destinations"
          className="mt-2 inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Back to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <ImageFallback
            className="h-full w-full object-cover"
            src={getImageUrl(destination.images[0], destination.name)}
            alt={destination.name}
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {destination.name}
            </h1>
            <div className="mt-8">
              <button
                onClick={handleBookNow}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
              >
                {isAuthenticated ? "Book Now" : "Sign In to Book"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("attractions")}
                className={`${
                  activeTab === "attractions"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Attractions
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`${
                  activeTab === "map"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Map
              </button>
              <button
                onClick={() => setActiveTab("ar")}
                className={`${
                  activeTab === "ar"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                AR Experience
              </button>
              <button
                onClick={() => setActiveTab("weather")}
                className={`${
                  activeTab === "weather"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Weather
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="bg-white py-16">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                About {destination.name}
              </h2>
              <div className="mt-6 text-lg text-gray-600">
                <p>{destination.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {destination.images && destination.images.length > 1 && (
        <div className="bg-white pb-16">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {destination.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-[400px] overflow-hidden">
                  <ImageFallback
                    src={getImageUrl(image, `${destination.name}-${index + 1}`)}
                    alt={`${destination.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attractions Tab */}
      {activeTab === "attractions" &&
        destination.attractions &&
        destination.attractions.length > 0 && (
          <div className="bg-white py-16">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Top Attractions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {destination.attractions.map((attraction, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium text-gray-900">
                          {attraction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <div className="bg-white py-16">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Map of {destination.name}
                </h2>
                <button
                  onClick={toggleMapPdfPreview}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
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
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Download Map as PDF
                </button>
              </div>
              <div className="h-[500px] rounded-lg overflow-hidden mb-4">
                <InteractiveMap
                  center={{
                    lat: destination.coordinates?.latitude || 35.3753,
                    lng: destination.coordinates?.longitude || 75.1755,
                  }}
                  zoom={10}
                  markers={[
                    {
                      position: {
                        lat: destination.coordinates?.latitude || 35.3753,
                        lng: destination.coordinates?.longitude || 75.1755,
                      },
                      title: destination.name,
                    },
                  ]}
                  height="500px"
                />
              </div>

              {/* Google Maps Buttons */}
              <div className="flex space-x-2 mb-8">
                <button
                  onClick={() =>
                    openInGoogleMaps(
                      {
                        lat: destination.coordinates?.latitude || 35.3753,
                        lng: destination.coordinates?.longitude || 75.1755,
                      },
                      destination.name
                    )
                  }
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-center font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Open in Google Maps
                  </div>
                </button>

                <button
                  onClick={() =>
                    openDirectionsInGoogleMaps({
                      lat: destination.coordinates?.latitude || 35.3753,
                      lng: destination.coordinates?.longitude || 75.1755,
                    })
                  }
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-center font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Get Directions
                  </div>
                </button>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  How to Get There
                </h3>
                <p className="text-gray-600 mb-4">
                  {destination.howToGetThere ||
                    "Information on how to reach this destination will be added soon."}
                </p>

                {/* Transport Options */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Available Transport Options
                  </h4>
                  <TransportOptions destinationName={destination.name} />
                </div>
              </div>

              {/* Download Offline Map Button */}
              <div className="mt-8 text-center">
                <Link
                  to={`/maps/download/${destination._id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
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
                  Download Offline Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map PDF Preview Modal */}
      {showMapPdfPreview && destination && mapData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Map PDF Preview
              </h3>
              <button
                type="button"
                onClick={toggleMapPdfPreview}
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
              <div ref={pdfRef}>
                <MapTemplate
                  destination={destination}
                  mapData={mapData}
                  locationIqApiKey={process.env.REACT_APP_LOCATIONIQ_API_KEY}
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={toggleMapPdfPreview}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMapPdfPreview(false);
                  setTimeout(() => {
                    generateMapPDF();
                  }, 100);
                }}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AR Experience Tab */}
      {activeTab === "ar" && (
        <div className="bg-white py-16">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  AR Experience: {destination.name}
                </h2>
              </div>

              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Experience {destination.name} in augmented reality. Explore
                  the destination in 3D with interactive controls.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Tip:</strong> For the best experience, try switching
                  to Street View mode by dragging the yellow person icon onto
                  the map.
                </p>
              </div>

              {/* Add a key to force re-render when the destination changes */}
              <ARViewer
                key={destination._id || destination.name}
                coordinates={
                  destination.coordinates ||
                  (mapData && mapData.center
                    ? {
                        latitude: mapData.center.lat,
                        longitude: mapData.center.lng,
                      }
                    : { latitude: 35.3753, longitude: 75.1755 })
                }
                name={destination.name}
                attractions={destination.attractions || []}
                cesiumIonToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNmM0MTEyYy1iMWZmLTRlNDItYTQ1NC01YzYzNDYzMDQ3YWIiLCJpZCI6MzAwMDMxLCJpYXQiOjE3NDY1NDU1OTF9.4mabfJ8IhIdNcU2rUiOjs5OOJcIBPTZeW2aqg_SvjC8"
                tilesetId={354307}
              />
            </div>
          </div>
        </div>
      )}

      {/* Weather Tab */}
      {activeTab === "weather" && (
        <div className="bg-white py-16">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Weather in {destination.name}
              </h2>

              {weatherLocationKey ? (
                <div className="mb-12">
                  <WeatherWidget
                    locationKey={weatherLocationKey}
                    locationName={destination.name}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg mb-12 text-center">
                  <p className="text-gray-600">
                    Weather information is not available for this destination at
                    the moment.
                  </p>
                </div>
              )}

              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Seasonal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Winter (Dec - Feb)
                    </h4>
                    <p className="text-gray-600">
                      {destination.seasonalInfo?.winter ||
                        "Cold with heavy snowfall. Many roads may be closed."}
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Spring (Mar - May)
                    </h4>
                    <p className="text-gray-600">
                      {destination.seasonalInfo?.spring ||
                        "Mild temperatures with blooming flowers. Some roads may still be closed."}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Summer (Jun - Aug)
                    </h4>
                    <p className="text-gray-600">
                      {destination.seasonalInfo?.summer ||
                        "Warm days and cool nights. Ideal time for trekking and outdoor activities."}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Autumn (Sep - Nov)
                    </h4>
                    <p className="text-gray-600">
                      {destination.seasonalInfo?.autumn ||
                        "Cool temperatures with beautiful fall colors. Less crowded."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Travel Information Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Travel Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Best Time to Visit */}
              {destination.bestVisitingMonths &&
                destination.bestVisitingMonths.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Best Time to Visit
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {destination.bestVisitingMonths.map((month, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-800 bg-primary-100"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Destination Type */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Destination Type
                </h3>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-800 bg-primary-100">
                  {destination.type}
                </span>
              </div>
            </div>

            {/* Cultural Tips */}
            {destination.culturalTips &&
              destination.culturalTips.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Cultural Tips
                  </h3>
                  <ul className="space-y-4">
                    {destination.culturalTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Related Vacation Packages */}
      {relatedPackages.length > 0 && (
        <div className="bg-white py-16 border-t border-gray-200">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Vacation Packages
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Explore our curated vacation packages for {destination.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {relatedPackages.map((pkg) => (
                <Link
                  key={pkg._id}
                  to={`/vacations/${pkg._id}`}
                  className="group relative block"
                >
                  <div className="relative overflow-hidden h-[350px]">
                    <ImageFallback
                      src={getImageUrl(pkg.images[0], pkg.name)}
                      alt={pkg.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity duration-300"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-6">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-white text-sm mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                        <div className="flex justify-center items-center space-x-4">
                          <span className="text-white font-bold">
                            ${pkg.price}
                          </span>
                          <span className="text-white">
                            {pkg.duration} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/vacations"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base uppercase tracking-wider font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                View All Packages
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;
