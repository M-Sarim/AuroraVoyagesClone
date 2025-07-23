import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageHelper";

const VacationPackages = () => {
  const { isAuthenticated } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    duration: "",
    destination: "",
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await api.get("/vacations", {
          params: {
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            duration: filters.duration || undefined,
            destination: filters.destination || undefined,
          },
        });
        setPackages(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch vacation packages");
        setLoading(false);
        console.error("Error fetching vacation packages:", err);
      }
    };

    fetchPackages();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
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
            src="/deosai-national-park.jpg"
            alt="Vacation Packages"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            VACATION PACKAGES
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our carefully curated vacation packages for unforgettable
            experiences
          </p>
          <div className="mt-10">
            <Link
              to="#packages"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              EXPLORE PACKAGES
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Find Your Perfect Vacation
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="minPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Min Price ($)
                </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Min Price"
                />
              </div>
              <div>
                <label
                  htmlFor="maxPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Price ($)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Max Price"
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (days)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Any Duration</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                  <option value="10">10 days</option>
                  <option value="14">14 days</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={filters.destination}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Any Destination</option>
                  {/* This would ideally be populated from an API call */}
                  <option value="hunza">Hunza Valley</option>
                  <option value="swat">Swat Valley</option>
                  <option value="skardu">Skardu</option>
                  <option value="murree">Murree</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div id="packages" className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {packages.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No packages found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try changing your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white overflow-hidden rounded-lg shadow transition-all duration-200 hover:shadow-lg"
                >
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(pkg.images && pkg.images[0])}
                      alt={pkg.name}
                      className="h-full w-full object-cover"
                    />
                    {pkg.company && pkg.company.logo && (
                      <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                        <img
                          src={pkg.company.logo}
                          alt={pkg.company.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900">
                        {pkg.name}
                      </h3>
                      <span className="text-lg font-bold text-primary-600">
                        ${pkg.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {pkg.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
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
                      <span>{pkg.duration} days</span>
                    </div>
                    {pkg.destinations && pkg.destinations.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
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
                        <span>
                          {pkg.destinations.map((d) => d.name).join(", ")}
                        </span>
                      </div>
                    )}
                    <div className="mt-6">
                      {isAuthenticated ? (
                        <Link
                          to={`/vacations/${pkg._id}`}
                          className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                          View Details
                        </Link>
                      ) : (
                        <div>
                          <Link
                            to={`/vacations/${pkg._id}`}
                            className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                          >
                            View Details
                          </Link>
                          <p className="mt-2 text-xs text-center text-gray-500">
                            Sign in required to book this package
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready for your next adventure?</span>
            <span className="block text-primary-300">
              Join us today and start exploring.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {!isAuthenticated && (
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <div
              className={`${
                !isAuthenticated ? "ml-3" : ""
              } inline-flex rounded-md shadow`}
            >
              <Link
                to="/destinations"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationPackages;
