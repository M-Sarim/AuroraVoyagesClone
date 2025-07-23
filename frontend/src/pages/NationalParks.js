import React, { useState } from "react";
import { Link } from "react-router-dom";

const NationalParks = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Park categories
  const categories = [
    { id: "all", name: "All Parks" },
    { id: "mountain", name: "Mountain Parks" },
    { id: "forest", name: "Forest Parks" },
    { id: "wildlife", name: "Wildlife Sanctuaries" },
    { id: "marine", name: "Marine Parks" },
  ];

  // National parks data for northern Pakistan
  const nationalParks = [
    {
      id: 1,
      name: "Deosai National Park",
      description:
        'Known as the "Land of Giants," Deosai is the second-highest plateau in the world at an average elevation of 4,114 meters. This alpine wilderness spans over 3,000 square kilometers and is home to the endangered Himalayan brown bear, snow leopards, and golden marmots. In summer, the plains transform into a carpet of wildflowers.',
      image: "/deosai-national-park.jpg",
      category: "mountain",
      location: "Gilgit-Baltistan",
      area: "3,000 sq km",
      established: "1993",
      bestTime: "July to September",
      highlights: [
        "Sheosar Lake - one of the highest lakes in the world",
        "Himalayan brown bear sightings",
        "Vast wildflower meadows",
        "Stunning mountain panoramas",
        "Unique alpine ecosystem",
      ],
      activities: [
        "Wildlife watching",
        "Camping",
        "Photography",
        "Hiking",
        "Fishing",
      ],
      featured: true,
    },
    {
      id: 2,
      name: "Khunjerab National Park",
      description:
        "Located at the Pakistan-China border, Khunjerab is one of the highest national parks in the world, with elevations ranging from 3,200 to 6,000 meters. The park was established primarily to protect the endangered Marco Polo sheep and snow leopards. It includes the Khunjerab Pass, the highest paved international border crossing in the world at 4,693 meters.",
      image: "/khunjerab-national-park.jpg",
      category: "mountain",
      location: "Gilgit-Baltistan",
      area: "2,269 sq km",
      established: "1975",
      bestTime: "May to October",
      highlights: [
        "Khunjerab Pass (4,693m)",
        "Marco Polo sheep",
        "Snow leopard habitat",
        "Himalayan ibex",
        "Spectacular mountain scenery",
      ],
      activities: [
        "Wildlife watching",
        "Photography",
        "Trekking",
        "Cultural experiences",
        "Scenic drives",
      ],
    },
    {
      id: 3,
      name: "Central Karakoram National Park",
      description:
        "Home to some of the world's highest peaks, including K2 (8,611m), this park encompasses an area of over 10,000 square kilometers. It contains the greatest concentration of high mountains on Earth, with four peaks above 8,000 meters and 60 above 7,000 meters. The park also features massive glaciers, including the Siachen and Baltoro.",
      image: "/central-karakoram-national-park.jpg",
      category: "mountain",
      location: "Gilgit-Baltistan",
      area: "10,557 sq km",
      established: "1993",
      bestTime: "June to September",
      highlights: [
        "K2 (8,611m) - second highest mountain in the world",
        "Baltoro Glacier",
        "Concordia - meeting point of multiple glaciers",
        "Gasherbrum peaks",
        "Broad Peak",
      ],
      activities: [
        "Mountaineering",
        "Trekking",
        "Camping",
        "Photography",
        "Glacier exploration",
      ],
      featured: true,
    },
    {
      id: 4,
      name: "Chitral Gol National Park",
      description:
        "Located in the Hindu Kush range, this park was established to protect the endangered markhor, Pakistan's national animal. The park covers a steep valley with elevations ranging from 1,500 to 4,979 meters. Its diverse landscape includes coniferous forests, alpine meadows, and snow-covered peaks.",
      image: "/chitral-gol-national-park.jpg",
      category: "wildlife",
      location: "Khyber Pakhtunkhwa",
      area: "77.5 sq km",
      established: "1984",
      bestTime: "April to October",
      highlights: [
        "Markhor - Pakistan's national animal",
        "Snow leopard habitat",
        "Himalayan lynx",
        "Diverse bird species",
        "Tirich Mir views (7,708m)",
      ],
      activities: [
        "Wildlife watching",
        "Bird watching",
        "Hiking",
        "Photography",
        "Cultural experiences",
      ],
    },
    {
      id: 5,
      name: "Saiful Muluk National Park",
      description:
        "Named after the famous Lake Saiful Muluk, this park is located in the Kaghan Valley. The lake, at an altitude of 3,224 meters, is surrounded by snow-capped mountains and alpine meadows. According to legend, a prince fell in love with a fairy princess at this lake, giving it a romantic mystique.",
      image: "/saif-ul-maloook-park.jpg",
      category: "mountain",
      location: "Khyber Pakhtunkhwa",
      area: "220 sq km",
      established: "2003",
      bestTime: "May to September",
      highlights: [
        "Lake Saiful Muluk",
        "Malika Parbat (5,290m)",
        "Alpine flowers",
        "Ansoo Lake",
        "Lulusar Lake",
      ],
      activities: [
        "Boating",
        "Hiking",
        "Camping",
        "Photography",
        "Jeep safaris",
      ],
    },
    {
      id: 6,
      name: "Hingol National Park",
      description:
        "Pakistan's largest national park covers an area of over 6,000 square kilometers and features a remarkable diversity of landscapes, from arid mountains to coastal areas. The park is home to the Hingol River, mud volcanoes, and unique rock formations including the Princess of Hope and the Sphinx.",
      image: "/hingol-park.jpg",
      category: "marine",
      location: "Balochistan",
      area: "6,190 sq km",
      established: "1997",
      bestTime: "October to March",
      highlights: [
        "Mud volcanoes",
        "Princess of Hope rock formation",
        "Hingol River",
        "Kund Malir beach",
        "Diverse wildlife including marsh crocodiles",
      ],
      activities: [
        "Jeep safaris",
        "Beach activities",
        "Photography",
        "Camping",
        "Wildlife watching",
      ],
    },
  ];

  // Filter parks based on active category
  const filteredParks =
    activeFilter === "all"
      ? nationalParks
      : nationalParks.filter((park) => park.category === activeFilter);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="/deosai-national-park.jpg"
            alt="National Parks in Pakistan"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            National Parks
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Explore Pakistan's protected wilderness areas, from towering
            mountains to pristine coastlines
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Pristine Wilderness
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Pakistan's national parks protect some of the world's most
            spectacular landscapes and endangered species. From the roof of the
            world in the Karakoram to the coastal ecosystems of the Arabian Sea,
            these parks offer unparalleled opportunities to experience nature at
            its most magnificent.
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

        {/* Parks Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredParks.map((park) => (
            <div
              key={park.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                park.featured ? "md:col-span-2" : ""
              }`}
            >
              <div className="h-64 relative">
                <img
                  src={park.image}
                  alt={park.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {park.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {park.category === "mountain"
                      ? "Mountain Park"
                      : park.category === "forest"
                      ? "Forest Park"
                      : park.category === "wildlife"
                      ? "Wildlife Sanctuary"
                      : "Marine Park"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {park.location}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Est. {park.established}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{park.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Highlights:
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {park.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-gray-500">
                  Best time to visit:{" "}
                  <span className="font-medium">{park.bestTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NationalParks;
