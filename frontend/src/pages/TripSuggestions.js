import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const TripSuggestions = () => {
  const { regionName } = useParams();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeRegionFilter, setActiveRegionFilter] = useState("all");
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneralPage, setIsGeneralPage] = useState(false);

  // Trip categories
  const categories = [
    { id: "all", name: "All Trips" },
    { id: "adventure", name: "Adventure" },
    { id: "cultural", name: "Cultural" },
    { id: "nature", name: "Nature" },
    { id: "family", name: "Family-Friendly" },
    { id: "luxury", name: "Luxury" },
  ];

  // Mock data for regions - in a real app, this would come from an API
  const regionsData = [
    {
      name: "The Northern Mountains",
      description:
        "Home to some of the world's highest peaks, including K2 (8,611m), the second-highest mountain on Earth. This region encompasses the Karakoram, Hindu Kush, and western Himalayan mountain ranges. The area is known for its stunning valleys, glaciers, and alpine meadows.",
      image:
        "https://images.unsplash.com/photo-1586325194227-7625ed95172b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Potwar Plateau",
      description:
        "Located in northern Punjab between the northern mountains and the Indus Plain. This region is characterized by its undulating landscape, dissected by numerous gullies and ravines. The plateau contains the twin cities of Islamabad and Rawalpindi.",
      image:
        "https://images.unsplash.com/photo-1567606940710-fa95fe99a584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Indus Plain",
      description:
        "A vast alluvial plain formed by the Indus River and its tributaries. This fertile region is the agricultural heartland of Pakistan, producing wheat, rice, cotton, and sugarcane. The plain is home to major cities like Lahore, Multan, and Hyderabad.",
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Balochistan Plateau",
      description:
        "A vast arid region in southwestern Pakistan characterized by its rugged mountains, highland valleys, and desert landscapes. The plateau is rich in minerals and natural resources but sparsely populated due to its harsh climate.",
      image:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Coastal Areas",
      description:
        "Pakistan's southern coastline along the Arabian Sea stretches about 1,050 km from India to Iran. The coast is divided between the Sindh and Balochistan provinces and features sandy beaches, mangrove forests, and the bustling port city of Karachi.",
      image:
        "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    },
  ];

  // Trip suggestions data - in a real app, this would come from an API
  const tripSuggestions = {
    "The Northern Mountains": [
      {
        id: 1,
        title: "K2 Base Camp Trek",
        description:
          "Experience the adventure of a lifetime with a trek to the base camp of the world's second-highest mountain. This challenging journey takes you through stunning landscapes, glaciers, and remote villages.",
        image: "/national-bird.jpg",
        category: "adventure",
        duration: "14-21 days",
        difficulty: "Challenging",
        bestSeason: "June to August",
        groupSize: "4-12 people",
        featured: true,
      },
      {
        id: 2,
        title: "Hunza Valley Cultural Tour",
        description:
          "Immerse yourself in the rich culture and traditions of the Hunza Valley. Visit ancient forts, traditional villages, and interact with the friendly locals known for their longevity and hospitality.",
        image: "/national-animal.jpg",
        category: "cultural",
        duration: "7-10 days",
        difficulty: "Moderate",
        bestSeason: "April to October",
        groupSize: "2-15 people",
      },
      {
        id: 3,
        title: "Fairy Meadows & Nanga Parbat View",
        description:
          "Visit the enchanting Fairy Meadows, a lush green plateau offering spectacular views of Nanga Parbat, the ninth-highest mountain in the world. Enjoy hiking, camping, and stargazing in this natural paradise.",
        image: "/logo.png",
        category: "nature",
        duration: "5-7 days",
        difficulty: "Moderate",
        bestSeason: "May to September",
        groupSize: "2-10 people",
      },
      {
        id: 4,
        title: "Deosai National Park Safari",
        description:
          "Explore the Deosai Plains, the second-highest plateau in the world and home to diverse wildlife including the Himalayan brown bear. Enjoy camping, photography, and nature walks in this pristine wilderness.",
        image: "/national-bird.jpg",
        category: "nature",
        duration: "4-6 days",
        difficulty: "Easy to Moderate",
        bestSeason: "July to September",
        groupSize: "2-8 people",
      },
      {
        id: 5,
        title: "Luxury Helicopter Tour",
        description:
          "Experience the Northern Mountains from a unique perspective with a luxury helicopter tour. Fly over majestic peaks, glaciers, and valleys, with stops at exclusive locations inaccessible by road.",
        image: "/national-animal.jpg",
        category: "luxury",
        duration: "1-3 days",
        difficulty: "Easy",
        bestSeason: "May to September",
        groupSize: "2-6 people",
      },
      {
        id: 6,
        title: "Family Adventure in Skardu",
        description:
          "A perfect family getaway to Skardu, featuring easy hikes, jeep safaris, and cultural activities suitable for all ages. Visit Shangrila Resort, Satpara Lake, and the ancient Buddha Rock.",
        image: "/logo.png",
        category: "family",
        duration: "5-7 days",
        difficulty: "Easy",
        bestSeason: "April to October",
        groupSize: "2-15 people",
      },
    ],
    "The Potwar Plateau": [
      {
        id: 1,
        title: "Islamabad & Rawalpindi City Tour",
        description:
          "Explore the twin cities of Islamabad and Rawalpindi, visiting landmarks such as the Pakistan Monument, Faisal Mosque, Lok Virsa Museum, and the vibrant Raja Bazaar.",
        image: "/national-bird.jpg",
        category: "cultural",
        duration: "2-3 days",
        difficulty: "Easy",
        bestSeason: "Year-round (best October to April)",
        groupSize: "1-20 people",
        featured: true,
      },
      {
        id: 2,
        title: "Rohtas Fort Historical Expedition",
        description:
          "Visit the UNESCO World Heritage Site of Rohtas Fort, one of the largest and most impressive military structures in South Asia, built in the 16th century.",
        image: "/national-animal.jpg",
        category: "cultural",
        duration: "1-2 days",
        difficulty: "Easy",
        bestSeason: "Year-round (best October to March)",
        groupSize: "2-15 people",
      },
      {
        id: 3,
        title: "Katas Raj Temples Pilgrimage",
        description:
          "Discover the ancient Hindu temple complex of Katas Raj, dating back to the Mahabharata era. Explore the sacred pond and multiple temple structures dedicated to Lord Shiva and other deities.",
        image: "/logo.png",
        category: "cultural",
        duration: "1-2 days",
        difficulty: "Easy",
        bestSeason: "October to March",
        groupSize: "2-15 people",
      },
    ],
    "The Indus Plain": [],
    "The Balochistan Plateau": [],
    "The Coastal Areas": [],
  };

  useEffect(() => {
    if (regionName) {
      // Specific region page
      const foundRegion = regionsData.find((r) => r.name === regionName);
      if (foundRegion) {
        setRegion(foundRegion);
      }
      setIsGeneralPage(false);
    } else {
      // General trip suggestions page
      setIsGeneralPage(true);
      setActiveRegionFilter("all");
    }
    setLoading(false);
  }, [regionName]);

  if (loading) {
    return <div className="container-custom py-12">Loading...</div>;
  }

  if (!isGeneralPage && !region) {
    return (
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold text-gray-900">Region not found</h1>
        <p className="mt-4 text-gray-600">
          The region you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/geography"
          className="mt-6 inline-block text-primary-600 hover:text-primary-700"
        >
          Return to Geography page
        </Link>
      </div>
    );
  }

  // Get all trips for general page or specific region trips
  let allTrips = [];

  if (isGeneralPage) {
    // Collect all trips from all regions for the general page
    Object.keys(tripSuggestions).forEach((regionKey) => {
      const regionTripsData = tripSuggestions[regionKey];
      if (regionTripsData.length > 0) {
        // Add region name to each trip for display
        const tripsWithRegion = regionTripsData.map((trip) => ({
          ...trip,
          regionName: regionKey,
        }));
        allTrips = [...allTrips, ...tripsWithRegion];
      }
    });
  } else {
    // Get trips for the specific region
    allTrips = tripSuggestions[regionName] || [];
  }

  // Filter trips based on active category and region filter
  let filteredTrips = allTrips;

  // Apply category filter
  if (activeFilter !== "all") {
    filteredTrips = filteredTrips.filter(
      (trip) => trip.category === activeFilter
    );
  }

  // Apply region filter (only for general page)
  if (isGeneralPage && activeRegionFilter !== "all") {
    filteredTrips = filteredTrips.filter(
      (trip) => trip.regionName === activeRegionFilter
    );
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div
        className="relative h-[50vh] min-h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${
            isGeneralPage
              ? "https://images.unsplash.com/photo-1586325194227-7625ed95172b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              : region.image
          })`,
        }}
      >
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isGeneralPage
              ? "Trip Suggestions"
              : `Trip Suggestions: ${region.name}`}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {isGeneralPage
              ? "Discover the best experiences and adventures across Pakistan"
              : "Discover the best experiences and adventures in this region"}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Home
              </Link>
            </li>
            {isGeneralPage ? (
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                    Trip Suggestions
                  </span>
                </div>
              </li>
            ) : (
              <>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <Link
                      to="/geography"
                      className="ml-1 text-sm text-gray-500 hover:text-gray-700 md:ml-2"
                    >
                      Geography
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                      Trip Suggestions
                    </span>
                  </div>
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* Main content */}
      <div className="container-custom py-8">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto mb-12">
          {isGeneralPage ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore Pakistan's Diverse Regions
              </h2>
              <p className="text-lg text-gray-600">
                Discover the best travel experiences across Pakistan's stunning
                landscapes, from the towering peaks of the Northern Mountains to
                the pristine beaches of the Coastal Areas. Browse our curated
                trip suggestions to find your perfect adventure.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore {region.name}
              </h2>
              <p className="text-lg text-gray-600">{region.description}</p>
            </>
          )}
        </div>

        {/* Filter tabs */}
        <div className="mb-8">
          {/* Category filters */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === category.id
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Region filters - only show on general page */}
          {isGeneralPage && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Filter by Region
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveRegionFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeRegionFilter === "all"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Regions
                </button>
                {regionsData.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => setActiveRegionFilter(region.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeRegionFilter === region.name
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Trip suggestions grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className={trip.featured ? "md:col-span-2" : ""}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                  <div
                    className={`relative overflow-hidden rounded-t-xl ${
                      trip.featured ? "h-80" : "h-60"
                    }`}
                  >
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {trip.category && (
                      <span className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {trip.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-grow">
                    <h3
                      className={`font-bold text-gray-900 mb-2 ${
                        trip.featured ? "text-2xl" : "text-xl"
                      }`}
                    >
                      {trip.title}
                    </h3>
                    {isGeneralPage && (
                      <div className="flex items-center text-sm text-primary-600 font-medium mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <Link
                          to={`/trip-suggestions/${encodeURIComponent(
                            trip.regionName
                          )}`}
                        >
                          {trip.regionName}
                        </Link>
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{trip.description}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2 text-primary-500" />
                        <span>Duration: {trip.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <StarIcon className="h-4 w-4 mr-2 text-primary-500" />
                        <span>Difficulty: {trip.difficulty}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2 text-primary-500" />
                        <span>Best Season: {trip.bestSeason}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-primary-500" />
                        <span>Group Size: {trip.groupSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      to="/vacations"
                      className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                    >
                      View Available Packages
                      <svg
                        className="ml-2 h-4 w-4"
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
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No trips available yet
            </h3>
            <p className="text-gray-600 mb-4">
              {isGeneralPage
                ? "We're working on adding exciting trip suggestions. Please check back soon!"
                : `We're working on adding exciting trip suggestions for ${region.name}. Please check back soon!`}
            </p>
            <Link
              to="/vacations"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse All Vacation Packages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripSuggestions;
