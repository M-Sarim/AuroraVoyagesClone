import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import ImageFallback from "../../components/ImageFallback";

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedDestinations = async () => {
      try {
        setLoading(true);
        // Get destinations sorted by popularity
        const response = await api.get("/destinations", {
          params: { popularity: "desc" },
        });
        // Take only the top 3 destinations
        setDestinations(response.data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch featured destinations");
        setLoading(false);
        console.error("Error fetching featured destinations:", err);
      }
    };

    fetchFeaturedDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || destinations.length === 0) {
    return (
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold text-neutral-900 sm:text-4xl">
              Explore Destinations
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover amazing places to visit around Pakistan.
            </p>
            <div className="mt-8">
              <Link to="/destinations" className="btn-primary">
                View All Destinations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            The Regions
          </h2>
          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-lg text-neutral-600">
              Pakistan is typically divided into different geographical regions.
              Each region differs slightly regarding culture and landscapes, but
              all are uniquely Pakistani. Click on each region to learn about
              the defining qualities, attractions, and other highlights.
            </p>
          </div>
        </div>

        {/* Featured destinations with modern design */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination._id}
              to={`/destinations/${destination._id}`}
              className="group relative block rounded-3xl overflow-hidden shadow-elevated hover:shadow-card transition-all duration-300"
            >
              <div className="relative overflow-hidden h-[450px]">
                <ImageFallback
                  src={getImageUrl(destination.images[0], destination.name)}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>

                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-3">
                      Region
                    </span>
                    <h3 className="text-3xl font-heading font-semibold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {destination.description?.substring(0, 120)}...
                    </p>
                    <span className="inline-flex items-center text-white text-sm font-medium">
                      Explore
                      <svg
                        className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More destinations section */}
        <div className="mt-28 text-center">
          <div className="max-w-3xl mx-auto bg-primary-50 rounded-3xl px-8 py-12 shadow-soft">
            <h3 className="text-3xl font-heading font-semibold text-neutral-900">
              The Wonders of Pakistan
            </h3>
            <p className="mt-6 text-lg text-neutral-700">
              Discover your favorite part of Pakistan! From the majestic peaks
              of the Karakoram to the lush valleys of Swat, Pakistan offers
              diverse landscapes and rich cultural experiences for every
              traveler.
            </p>
            <div className="mt-8">
              <Link to="/destinations" className="btn-primary">
                View All Regions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDestinations;
