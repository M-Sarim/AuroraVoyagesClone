import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchHero = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    type: "destination",
    keyword: "",
    country: "",
    duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build query string based on search type
    let queryString = "";

    if (searchParams.type === "destination") {
      queryString = `/destinations?${
        searchParams.country ? `country=${searchParams.country}` : ""
      }`;
    } else {
      // For vacation packages
      queryString = `/vacations?${
        searchParams.country ? `destination=${searchParams.country}` : ""
      }${searchParams.duration ? `&duration=${searchParams.duration}` : ""}`;
    }

    navigate(queryString);
  };

  return (
    <div className="relative">
      {/* Full-width hero image with modern overlay */}
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover"
          src="/images/hunza_valley_1.jpg"
          alt="Pakistan Northern Areas"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
      </div>

      {/* Hero content */}
      <div className="relative min-h-[780px] flex items-center">
        <div className="container-custom py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading font-semibold tracking-tight text-white text-5xl sm:text-6xl lg:text-7xl mb-6 animate-fade-in">
              THE NORTHERN WAY
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto font-light animate-fade-in">
              Explore the awe-inspiring landscapes of Northern Pakistan
            </p>

            {/* Modern Search Form */}
            <div className="mt-16 bg-white/95 backdrop-blur-sm shadow-elevated rounded-3xl overflow-hidden max-w-3xl mx-auto animate-slide-up">
              <div className="bg-primary-600 py-3 px-2">
                <div className="flex flex-wrap justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      setSearchParams((prev) => ({
                        ...prev,
                        type: "destination",
                      }))
                    }
                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      searchParams.type === "destination"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-white hover:bg-primary-500/70"
                    }`}
                  >
                    Destinations
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSearchParams((prev) => ({ ...prev, type: "vacation" }))
                    }
                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      searchParams.type === "vacation"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-white hover:bg-primary-500/70"
                    }`}
                  >
                    Vacation Packages
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-1 sm:col-span-2">
                    <div className="relative rounded-xl shadow-sm">
                      <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        value={searchParams.keyword}
                        onChange={handleChange}
                        placeholder="What are you looking for?"
                        className="block w-full rounded-xl border-neutral-300 pl-5 pr-12 py-4 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-neutral-800 placeholder-neutral-400"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg
                          className="h-5 w-5 text-neutral-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <select
                      id="country"
                      name="country"
                      value={searchParams.country}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3.5 text-neutral-800"
                    >
                      <option value="">Any Region</option>
                      <option value="Hunza">Hunza Valley</option>
                      <option value="Skardu">Skardu</option>
                      <option value="Swat">Swat Valley</option>
                      <option value="Fairy Meadows">Fairy Meadows</option>
                      <option value="Naltar">Naltar Valley</option>
                    </select>
                  </div>

                  {searchParams.type === "vacation" ? (
                    <div>
                      <select
                        id="duration"
                        name="duration"
                        value={searchParams.duration}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3.5 text-neutral-800"
                      >
                        <option value="">Any Duration</option>
                        <option value="3">3 days</option>
                        <option value="5">5 days</option>
                        <option value="7">7 days</option>
                        <option value="10">10 days</option>
                        <option value="14">14 days</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <select
                        id="activity"
                        name="activity"
                        className="block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 py-3.5 text-neutral-800"
                      >
                        <option value="">Any Activity</option>
                        <option value="hiking">Hiking</option>
                        <option value="skiing">Skiing</option>
                        <option value="sightseeing">Sightseeing</option>
                        <option value="cultural">Cultural</option>
                        <option value="adventure">Adventure</option>
                      </select>
                    </div>
                  )}

                  <div className="col-span-1 sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-xl text-base font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
