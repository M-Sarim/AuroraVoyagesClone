import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageHelper";

const VacationPackageDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [vacationPackage, setVacationPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vacations/${id}`);
        setVacationPackage(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch package details");
        setLoading(false);
        console.error("Error fetching package details:", err);
      }
    };

    fetchPackageData();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to login page with a return URL
      navigate(`/login?redirect=/vacations/${id}`);
      return;
    }

    // Redirect to booking page
    navigate(`/booking/new?package=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !vacationPackage) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error || "Package not found"}</p>
        <Link
          to="/vacations"
          className="mt-2 inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src={getImageUrl(
              vacationPackage.images && vacationPackage.images[0]
            )}
            alt={vacationPackage.name}
          />
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {vacationPackage.name}
          </h1>
          <div className="mt-6 flex flex-wrap items-center text-xl text-gray-300 gap-x-6 gap-y-2">
            <span className="flex items-center">
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {vacationPackage.duration} days
            </span>
            <span className="flex items-center">
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              ${vacationPackage.price}
            </span>
            {vacationPackage.destinations &&
              vacationPackage.destinations.length > 0 && (
                <span className="flex items-center">
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {vacationPackage.destinations.map((d) => d.name).join(", ")}
                </span>
              )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "itinerary"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab("inclusions")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "inclusions"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Inclusions
            </button>
            {vacationPackage.tourGuide && (
              <button
                onClick={() => setActiveTab("tourGuide")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "tourGuide"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tour Guide
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Overview
                  </h2>
                  <div className="mt-6 text-gray-500 space-y-6">
                    <p className="text-lg">{vacationPackage.description}</p>

                    {/* Activities */}
                    {vacationPackage.activities &&
                      vacationPackage.activities.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Activities
                          </h3>
                          <ul className="mt-4 space-y-2">
                            {vacationPackage.activities.map(
                              (activity, index) => (
                                <li key={index} className="flex items-start">
                                  <svg
                                    className="h-6 w-6 text-primary-500 mr-2"
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
                                  <span>{activity}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Image Gallery */}
                    {vacationPackage.images &&
                      vacationPackage.images.length > 1 && (
                        <div className="mt-8">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Gallery
                          </h3>
                          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {vacationPackage.images
                              .slice(1)
                              .map((image, index) => (
                                <div
                                  key={index}
                                  className="relative h-64 overflow-hidden rounded-lg"
                                >
                                  <img
                                    src={getImageUrl(image)}
                                    alt={`${vacationPackage.name} ${index + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === "itinerary" && (
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Itinerary
                  </h2>
                  {vacationPackage.schedule &&
                  vacationPackage.schedule.length > 0 ? (
                    <div className="mt-6 space-y-8">
                      {vacationPackage.schedule.map((day) => (
                        <div
                          key={day.day}
                          className="border-l-4 border-primary-500 pl-4"
                        >
                          <h3 className="text-xl font-bold text-gray-900">
                            Day {day.day}
                          </h3>
                          <div className="mt-4 space-y-4">
                            {day.morning && (
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                  Morning
                                </h4>
                                <p className="mt-1 text-gray-500">
                                  {day.morning}
                                </p>
                              </div>
                            )}
                            {day.afternoon && (
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                  Afternoon
                                </h4>
                                <p className="mt-1 text-gray-500">
                                  {day.afternoon}
                                </p>
                              </div>
                            )}
                            {day.evening && (
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                  Evening
                                </h4>
                                <p className="mt-1 text-gray-500">
                                  {day.evening}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-500">
                      Detailed itinerary will be provided upon booking.
                    </p>
                  )}
                </div>
              )}

              {/* Inclusions Tab */}
              {activeTab === "inclusions" && (
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Inclusions
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {/* Transport */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Transport
                      </h3>
                      {vacationPackage.includedTransport &&
                      vacationPackage.includedTransport.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                          {vacationPackage.includedTransport.map(
                            (item, index) => (
                              <li key={index} className="flex items-start">
                                <svg
                                  className="h-5 w-5 text-primary-500 mr-2"
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
                                <span className="text-gray-500">{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="mt-2 text-gray-500">
                          Transport details will be provided upon booking.
                        </p>
                      )}
                    </div>

                    {/* Accommodation */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Accommodation
                      </h3>
                      {vacationPackage.includedHotels &&
                      vacationPackage.includedHotels.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                          {vacationPackage.includedHotels.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-primary-500 mr-2"
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
                              <span className="text-gray-500">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-gray-500">
                          Accommodation details will be provided upon booking.
                        </p>
                      )}
                    </div>

                    {/* Meals */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Meals</h3>
                      {vacationPackage.includedMeals &&
                      vacationPackage.includedMeals.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                          {vacationPackage.includedMeals.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-primary-500 mr-2"
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
                              <span className="text-gray-500">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-gray-500">
                          Meal details will be provided upon booking.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tour Guide Tab */}
              {activeTab === "tourGuide" && vacationPackage.tourGuide && (
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Your Tour Guide
                  </h2>
                  <div className="mt-6 flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                      <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                        <img
                          src={
                            getImageUrl(vacationPackage.tourGuide.image) ||
                            "/images/pakistan_mountain_1.jpg"
                          }
                          alt={vacationPackage.tourGuide.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:w-2/3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {vacationPackage.tourGuide.name}
                      </h3>
                      <div className="mt-2 flex items-center">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <svg
                              key={rating}
                              className={`h-5 w-5 ${
                                rating <
                                Math.floor(
                                  vacationPackage.tourGuide.rating || 0
                                )
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            {vacationPackage.tourGuide.rating || 0} out of 5
                            stars
                          </span>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-500">
                        {vacationPackage.tourGuide.bio || "No bio available."}
                      </p>
                      {vacationPackage.tourGuide.experience && (
                        <div className="mt-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            Experience
                          </h4>
                          <p className="mt-1 text-gray-500">
                            {vacationPackage.tourGuide.experience} years
                          </p>
                        </div>
                      )}
                      {vacationPackage.tourGuide.languages &&
                        vacationPackage.tourGuide.languages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              Languages
                            </h4>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {vacationPackage.tourGuide.languages.map(
                                (language, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-primary-100 px-3 py-0.5 text-sm font-medium text-primary-800"
                                  >
                                    {language}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      {vacationPackage.tourGuide.specialties &&
                        vacationPackage.tourGuide.specialties.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              Specialties
                            </h4>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {vacationPackage.tourGuide.specialties.map(
                                (specialty, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800"
                                  >
                                    {specialty}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="mt-12 lg:mt-0">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Book This Package
                </h3>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Price</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${vacationPackage.price}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-900">
                      {vacationPackage.duration} days
                    </span>
                  </div>
                  {vacationPackage.company && (
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-gray-500">Provider</span>
                      <span className="text-gray-900">
                        {vacationPackage.company.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  {isAuthenticated ? (
                    <button
                      onClick={handleBookNow}
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Book Now
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={handleBookNow}
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Sign In to Book
                      </button>
                      <p className="mt-2 text-sm text-center text-gray-500">
                        You need to sign in to book this package
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Need Help?
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Have questions about this package? Contact our support team
                    for assistance.
                  </p>
                  <div className="mt-4">
                    <a
                      href="tel:+923001234567"
                      className="text-primary-600 hover:text-primary-500 flex items-center"
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      +92 300 123 4567
                    </a>
                  </div>
                  <div className="mt-2">
                    <a
                      href="mailto:auroravoyagesinfo@gmail.com"
                      className="text-primary-600 hover:text-primary-500 flex items-center"
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      auroravoyagesinfo@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationPackageDetail;
