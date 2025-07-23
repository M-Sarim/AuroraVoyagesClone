import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageHelper";
import ImageFallback from "../components/ImageFallback";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    country: "",
    type: "",
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/destinations", {
          params: {
            country: filters.country || undefined,
            type: filters.type || undefined,
            popularity: "desc",
          },
        });
        setDestinations(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch destinations");
        setLoading(false);
        console.error("Error fetching destinations:", err);
      }
    };

    fetchDestinations();
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
      <div className="bg-white py-16">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              The Regions
            </h1>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white pb-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600">
              Pakistan is typically divided into seven different geographical
              regions. Each region differs slightly regarding culture and
              landscapes, but all are uniquely Pakistani. The regions are
              Northern Areas, Khyber Pakhtunkhwa, Punjab, Sindh, Balochistan,
              Azad Kashmir, and Gilgit-Baltistan.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Click on each of the regions to learn about the defining
              qualities, history, attractions, and other highlights. Discover
              your favorite part of Pakistan!
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white py-6 border-t border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            <div className="flex flex-col sm:flex-row gap-6">
              <select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="block w-full pl-4 pr-10 py-3 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-none"
              >
                <option value="">All Regions</option>
                <option value="Northern Areas">Northern Areas</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="Balochistan">Balochistan</option>
              </select>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full pl-4 pr-10 py-3 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-none"
              >
                <option value="">All Types</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
                <option value="countryside">Countryside</option>
                <option value="historical">Historical</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div id="destinations" className="bg-white py-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {destinations.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No destinations found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try changing your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
              {destinations.map((destination) => (
                <Link
                  key={destination._id}
                  to={`/destinations/${destination._id}`}
                  className="group relative block"
                >
                  <div className="relative overflow-hidden h-[400px]">
                    <ImageFallback
                      src={getImageUrl(destination.images[0], destination.name)}
                      alt={destination.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">
                          {destination.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explore More Section */}
      <div className="bg-white py-24 border-t border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">
              The wonders of Pakistan
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Pakistan is a land of diverse landscapes, rich cultural heritage,
              and warm hospitality. From the towering peaks of the Karakoram
              Range to the ancient ruins of the Indus Valley Civilization,
              Pakistan offers a wealth of experiences for travelers seeking
              adventure, history, and natural beauty.
            </p>
            <div className="mt-10">
              <Link
                to="/trip-suggestions"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base uppercase tracking-wider font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Trip Suggestions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
