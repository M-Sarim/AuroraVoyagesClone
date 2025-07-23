import React from "react";
import { Link } from "react-router-dom";
import AboutPakistanLayout from "../components/layout/AboutPakistanLayout";
import {
  GlobeAsiaAustraliaIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

const Geography = () => {
  // Geographic regions of Pakistan
  const regions = [
    {
      name: "The Northern Mountains",
      description:
        "Home to some of the world's highest peaks, including K2 (8,611m), the second-highest mountain on Earth. This region encompasses the Karakoram, Hindu Kush, and western Himalayan mountain ranges. The area is known for its stunning valleys, glaciers, and alpine meadows.",
      keyFeatures: [
        "K2 (8,611m) - second highest peak in the world",
        "Nanga Parbat (8,126m) - ninth highest peak in the world",
        "Hunza Valley - known for its natural beauty and longevity of its inhabitants",
        "Baltoro Glacier - one of the longest glaciers outside the polar regions",
        "Deosai Plains - second highest plateau in the world",
      ],
      image:
        "https://images.unsplash.com/photo-1586325194227-7625ed95172b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Potwar Plateau",
      description:
        "Located in northern Punjab between the northern mountains and the Indus Plain. This region is characterized by its undulating landscape, dissected by numerous gullies and ravines. The plateau contains the twin cities of Islamabad and Rawalpindi.",
      keyFeatures: [
        "Islamabad - the capital city of Pakistan",
        "Rawalpindi - major urban center and military headquarters",
        "Katas Raj Temples - ancient Hindu temple complex",
        "Salt Range - contains one of the oldest salt mines in the world",
        "Rohtas Fort - UNESCO World Heritage Site",
      ],
      image:
        "https://images.unsplash.com/photo-1567606940710-fa95fe99a584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Indus Plain",
      description:
        "A vast alluvial plain formed by the Indus River and its tributaries. This fertile region is the agricultural heartland of Pakistan, producing wheat, rice, cotton, and sugarcane. The plain is home to major cities like Lahore, Multan, and Hyderabad.",
      keyFeatures: [
        "Indus River - one of the longest rivers in Asia",
        "Punjab - the most populous province of Pakistan",
        "Lahore - cultural capital of Pakistan",
        "Extensive canal irrigation system - one of the largest in the world",
        "Archaeological sites of the ancient Indus Valley Civilization",
      ],
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Balochistan Plateau",
      description:
        "A vast arid region in southwestern Pakistan characterized by its rugged mountains, highland valleys, and desert landscapes. The plateau is rich in minerals and natural resources but sparsely populated due to its harsh climate.",
      keyFeatures: [
        "Quetta - the largest city and provincial capital of Balochistan",
        "Hingol National Park - Pakistan's largest national park",
        "Makran Coastal Highway - scenic route along the Arabian Sea",
        "Chagai Hills - site of Pakistan's nuclear tests",
        "Mehrgarh - one of the most important Neolithic sites in archaeology",
      ],
      image:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "The Coastal Areas",
      description:
        "Pakistan's southern coastline along the Arabian Sea stretches about 1,050 km from India to Iran. The coast is divided between the Sindh and Balochistan provinces and features sandy beaches, mangrove forests, and the bustling port city of Karachi.",
      keyFeatures: [
        "Karachi - Pakistan's largest city and economic hub",
        "Gwadar Port - deep-sea port being developed as part of CPEC",
        "Mangrove forests in the Indus Delta",
        "Astola Island - Pakistan's first marine protected area",
        "Kund Malir Beach - one of the most beautiful beaches in Pakistan",
      ],
      image:
        "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    },
  ];

  // Major rivers of Pakistan
  const rivers = [
    {
      name: "Indus River",
      description:
        "The longest and most important river in Pakistan, flowing 3,180 km from Tibet through the entire length of Pakistan before emptying into the Arabian Sea. The Indus and its tributaries form one of the largest irrigation systems in the world.",
      length: "3,180 km in total, 2,900 km within Pakistan",
    },
    {
      name: "Jhelum River",
      description:
        "A major tributary of the Indus River, originating from the southeastern part of Kashmir. It flows through the Kashmir Valley and enters Pakistan in the Punjab province.",
      length: "725 km",
    },
    {
      name: "Chenab River",
      description:
        "Formed by the confluence of the Chandra and Bhaga rivers in the Indian state of Himachal Pradesh. It flows through Jammu and Kashmir and enters Pakistan in Punjab.",
      length: "960 km",
    },
    {
      name: "Ravi River",
      description:
        "A transboundary river flowing through northwestern India and eastern Pakistan. It is one of the six rivers of the Punjab region.",
      length: "720 km",
    },
    {
      name: "Sutlej River",
      description:
        "The easternmost tributary of the Indus River. It originates in Tibet and flows through India before entering Pakistan.",
      length: "1,450 km",
    },
  ];

  // Geographic facts about Pakistan
  const geographicFacts = [
    "Pakistan covers an area of 881,913 square kilometers, making it the 33rd-largest country in the world.",
    "Pakistan shares borders with four countries: India to the east, China to the northeast, Afghanistan to the northwest, and Iran to the west.",
    "The highest point in Pakistan is K2 (Mount Godwin-Austen) at 8,611 meters, the second-highest mountain peak in the world.",
    "The lowest point is the Arabian Sea at 0 meters.",
    "Pakistan has five of the world's 14 highest peaks (those over 8,000 meters).",
    "The Thar Desert in southeastern Pakistan is an extension of the Great Indian Desert.",
    "The Indus River basin is one of the largest groundwater aquifers in the world.",
    "Pakistan has over 7,000 glaciers, more than anywhere outside the polar regions.",
  ];

  return (
    <AboutPakistanLayout
      title="Geography of Pakistan"
      subtitle="Explore the diverse landscapes and natural features of Pakistan"
      heroImage="https://images.unsplash.com/photo-1663439149009-76d6b8cbad9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          The Land of Diverse Landscapes
        </h2>
        <p className="text-gray-600 mb-6">
          Pakistan is a country of remarkable geographical diversity, featuring
          towering mountain ranges, fertile river valleys, vast deserts, and a
          coastline along the Arabian Sea. This geographical variety has shaped
          the country's history, culture, and economy, creating distinct
          regional identities and lifestyles.
        </p>
      </div>

      {/* Geographic Facts */}
      <div className="mt-10 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <GlobeAsiaAustraliaIcon className="h-6 w-6 mr-2 text-primary-600" />
          Geographic Facts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {geographicFacts.map((fact, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <p className="text-gray-700">{fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Regions */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <MapPinIcon className="h-6 w-6 mr-2 text-primary-600" />
          Major Geographic Regions
        </h3>
        <div className="space-y-8">
          {regions.map((region, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="h-full w-full object-cover"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {region.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{region.description}</p>
                  <h5 className="text-base font-medium text-gray-800 mb-2">
                    Key Features:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 mb-4">
                    {region.keyFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <Link
                    to={`/trip-suggestions/${encodeURIComponent(region.name)}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Trip Suggestions
                    <svg
                      className="ml-2 -mr-1 h-4 w-4"
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
      </div>

      {/* Major Rivers */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <ArrowsPointingOutIcon className="h-6 w-6 mr-2 text-blue-600" />
          Major Rivers
        </h3>
        <p className="text-gray-600 mb-6">
          Pakistan's river system is dominated by the Indus River and its
          tributaries. These rivers are vital for agriculture, power generation,
          and sustaining ecosystems throughout the country.
        </p>
        <div className="space-y-4">
          {rivers.map((river, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <h4 className="text-lg font-medium text-gray-900 mb-1">
                {river.name}
              </h4>
              <p className="text-sm text-blue-600 mb-3">
                Length: {river.length}
              </p>
              <p className="text-gray-600">{river.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Zones */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Climate Zones</h3>
        <p className="text-gray-600 mb-6">
          Pakistan's diverse geography results in a wide range of climate zones,
          from arid deserts to tropical coastal areas and alpine conditions in
          the mountains.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Highland Climate
            </h4>
            <p className="text-gray-600">
              Found in the northern mountainous regions. Characterized by cold
              winters with heavy snowfall and mild summers. Temperature
              decreases with altitude, with permanent snow and ice at the
              highest elevations.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Continental Climate
            </h4>
            <p className="text-gray-600">
              Prevalent in the northern and northwestern parts of the country.
              Features extreme temperature variations between seasons, with hot
              summers and very cold winters.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Arid and Semi-Arid Climate
            </h4>
            <p className="text-gray-600">
              Dominates in Balochistan, southern Punjab, and Sindh.
              Characterized by low rainfall, high evaporation rates, and large
              temperature variations between day and night.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Tropical Climate
            </h4>
            <p className="text-gray-600">
              Found along the coastal areas of the Arabian Sea. Features high
              humidity, moderate temperature variations, and influence from
              monsoon rains during summer months.
            </p>
          </div>
        </div>
      </div>

      {/* Natural Resources */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Natural Resources
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 mb-4">
            Pakistan is endowed with various natural resources that contribute
            to its economy and development:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>
              <span className="font-medium">Minerals:</span> Coal, copper, gold,
              chromite, mineral salt, bauxite, and limestone
            </li>
            <li>
              <span className="font-medium">Energy resources:</span> Natural
              gas, limited petroleum, and hydropower potential
            </li>
            <li>
              <span className="font-medium">Agricultural land:</span>{" "}
              Approximately 25% of Pakistan's land is arable, with the Indus
              basin being particularly fertile
            </li>
            <li>
              <span className="font-medium">Water resources:</span> The Indus
              River system provides water for the world's largest contiguous
              irrigation system
            </li>
            <li>
              <span className="font-medium">Forests:</span> Though limited
              (covering only about 4% of the land area), they provide timber and
              other forest products
            </li>
            <li>
              <span className="font-medium">Fisheries:</span> The coastline
              along the Arabian Sea supports a significant fishing industry
            </li>
          </ul>
        </div>
      </div>
    </AboutPakistanLayout>
  );
};

export default Geography;
