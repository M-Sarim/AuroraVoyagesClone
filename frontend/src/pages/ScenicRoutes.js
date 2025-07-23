import React, { useState } from "react";
import { Link } from "react-router-dom";

const ScenicRoutes = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Route categories
  const categories = [
    { id: "all", name: "All Routes" },
    { id: "mountain", name: "Mountain Routes" },
    { id: "valley", name: "Valley Routes" },
  ];

  // Scenic routes data for northern Pakistan
  const scenicRoutes = [
    {
      id: 1,
      title: "Karakoram Highway",
      description:
        "Known as the Eighth Wonder of the World, this 1,300km highway connects Pakistan to China through some of the most spectacular mountain scenery. The route passes through the Karakoram mountain range, alongside the Indus and Hunza rivers, and reaches its highest point at Khunjerab Pass (4,693m).",
      image: "/karakoram-highway.jpg",
      category: "mountain",
      length: "1,300 km",
      difficulty: "Moderate",
      bestTime: "May to October",
      highlights: [
        "Khunjerab Pass - highest paved border crossing in the world",
        "Hunza Valley views",
        "Passu Cones",
        "Attabad Lake",
        "Rakaposhi viewpoint",
      ],
      featured: true,
    },
    {
      id: 2,
      title: "Fairy Meadows Road",
      description:
        "One of the most thrilling and dangerous roads in the world, this unpaved track leads to the Fairy Meadows, a spectacular alpine meadow near the base camp of Nanga Parbat, the ninth highest mountain in the world. The final part of the journey must be completed on foot or by pony.",
      image: "/Fairy-Meadows.jpg",
      category: "mountain",
      length: "16 km (road) + 5 km (trek)",
      difficulty: "Challenging",
      bestTime: "June to September",
      highlights: [
        "Breathtaking views of Nanga Parbat",
        "Fairy Meadows",
        "Alpine forests",
        "Traditional villages",
        "Stargazing opportunities",
      ],
    },
    {
      id: 3,
      title: "Shandur Pass",
      description:
        "Connecting Chitral to Gilgit, this high mountain pass at 3,700 meters is home to the highest polo ground in the world. The route offers spectacular views of the Hindu Kush mountains and passes through remote villages and pristine landscapes.",
      image: "/shandur-pass.jpg",
      category: "mountain",
      length: "250 km",
      difficulty: "Moderate to Challenging",
      bestTime: "June to August",
      highlights: [
        "Shandur Polo Festival (July)",
        "Phander Lake",
        "Mastuj Fort",
        "Hindu Kush mountain views",
        "Traditional Kalash villages",
      ],
    },
    {
      id: 4,
      title: "Kaghan Valley Route",
      description:
        "This scenic route through the Kaghan Valley takes you past alpine lakes, pine forests, and meadows. The journey from Balakot to Lake Saiful Muluk offers some of the most picturesque landscapes in Pakistan.",
      image: "/kaghan-valley-route.jpg",
      category: "valley",
      length: "155 km",
      difficulty: "Easy to Moderate",
      bestTime: "May to September",
      highlights: [
        "Lake Saiful Muluk",
        "Babusar Pass (4,173m)",
        "Lulusar Lake",
        "Naran town",
        "Kunhar River",
      ],
      featured: true,
    },
    {
      id: 5,
      title: "Deosai Plains Route",
      description:
        'The road to Deosai National Park, the second-highest plateau in the world at an average elevation of 4,114 meters. This route connects Skardu to Astore and crosses the "Land of Giants" with its unique alpine ecosystem.',
      image: "/karakoram-highway.jpg",
      category: "mountain",
      length: "120 km",
      difficulty: "Moderate",
      bestTime: "July to September",
      highlights: [
        "Sheosar Lake",
        "Himalayan brown bear sightings",
        "Wildflower meadows",
        "Bara Pani (Big Water)",
        "Stunning mountain panoramas",
      ],
    },
    {
      id: 6,
      title: "Gilgit to Hunza Valley",
      description:
        "This section of the Karakoram Highway offers some of the most spectacular mountain scenery in the world. The route passes ancient forts, traditional villages, and offers views of snow-capped peaks including Rakaposhi, Ultar Sar, and Diran.",
      image: "/gilgit-to-hunza.jpg",
      category: "valley",
      length: "100 km",
      difficulty: "Easy",
      bestTime: "April to October",
      highlights: [
        "Rakaposhi View Point",
        "Altit and Baltit Forts",
        "Eagle's Nest viewpoint",
        "Attabad Lake",
        "Karimabad town",
      ],
    },
  ];

  // Filter routes based on active category
  const filteredRoutes =
    activeFilter === "all"
      ? scenicRoutes
      : scenicRoutes.filter((route) => route.category === activeFilter);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="/karakoram-highway.jpg"
            alt="Scenic Routes in Pakistan"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Scenic Routes
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the most breathtaking drives and journeys through Northern
            Pakistan's majestic landscapes
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Unforgettable Journeys
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Northern Pakistan offers some of the world's most spectacular scenic
            routes, winding through towering mountains, lush valleys, and
            alongside crystal-clear lakes. These routes not only connect
            destinations but are destinations in themselves, offering
            unforgettable experiences and breathtaking vistas at every turn.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Routes Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                route.featured ? "md:col-span-2" : ""
              }`}
            >
              <div className="h-64 relative">
                <img
                  src={route.image}
                  alt={route.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {route.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {route.category === "mountain"
                      ? "Mountain Route"
                      : route.category === "valley"
                      ? "Valley Route"
                      : "Other Route"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {route.length}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {route.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{route.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Highlights:
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {route.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-gray-500">
                  Best time to visit:{" "}
                  <span className="font-medium">{route.bestTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenicRoutes;
