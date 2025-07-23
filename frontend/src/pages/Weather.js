import React from "react";
import AboutPakistanLayout from "../components/layout/AboutPakistanLayout";
import {
  SunIcon,
  CloudIcon,
  FireIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Weather = () => {
  // Seasons in Pakistan
  const seasons = [
    {
      name: "Spring (March to April)",
      icon: <SunIcon className="h-6 w-6 text-yellow-500" />,
      description:
        "A brief but pleasant season with moderate temperatures and blooming flowers. Spring is an excellent time to visit most parts of Pakistan before the summer heat arrives.",
      temperature:
        "Average temperatures range from 15°C to 30°C (59°F to 86°F), depending on the region.",
      precipitation:
        "Some rainfall, particularly in the northern areas. The plains may experience occasional thunderstorms.",
      clothing:
        "Light to medium-weight clothing with a light jacket for evenings.",
      bestFor: [
        "Visiting cities",
        "Exploring gardens and parks",
        "Outdoor activities",
        "Cultural festivals",
      ],
    },
    {
      name: "Summer (May to September)",
      icon: <FireIcon className="h-6 w-6 text-red-500" />,
      description:
        "Hot and humid in most parts of the country, with the plains experiencing very high temperatures. The northern mountainous regions offer a pleasant escape from the heat.",
      temperature:
        "Plains: 30°C to 45°C (86°F to 113°F). Northern areas: 15°C to 30°C (59°F to 86°F).",
      precipitation:
        "Monsoon rains occur from July to September, bringing heavy rainfall to many parts of the country, particularly the eastern regions.",
      clothing:
        "Lightweight, breathable clothing. Sun protection is essential. In northern areas, a light jacket may be needed for evenings.",
      bestFor: [
        "Visiting northern mountains",
        "Trekking in Gilgit-Baltistan",
        "Exploring hill stations",
        "Summer fruits and festivals",
      ],
    },
    {
      name: "Autumn (October to November)",
      icon: <CloudIcon className="h-6 w-6 text-orange-500" />,
      description:
        "A pleasant season with cooling temperatures and clear skies. The landscape takes on golden hues, especially in the northern regions where trees change color.",
      temperature:
        "Average temperatures range from 10°C to 25°C (50°F to 77°F), depending on the region.",
      precipitation: "Generally dry with occasional light rainfall.",
      clothing:
        "Medium-weight clothing with layers for changing temperatures throughout the day.",
      bestFor: [
        "Sightseeing in cities",
        "Photography",
        "Hiking",
        "Cultural exploration",
      ],
    },
    {
      name: "Winter (December to February)",
      icon: <SparklesIcon className="h-6 w-6 text-blue-500" />,
      description:
        "Cold in the northern areas with snowfall in the mountains. The plains experience mild to cool temperatures, while coastal areas remain relatively warm.",
      temperature:
        "Northern areas: -10°C to 10°C (14°F to 50°F). Plains: 5°C to 20°C (41°F to 68°F). Coastal areas: 10°C to 25°C (50°F to 77°F).",
      precipitation:
        "Snowfall in the mountains. The plains may experience some rainfall, while coastal areas remain mostly dry.",
      clothing:
        "Heavy winter clothing for northern areas. Medium to light layers for plains and coastal regions.",
      bestFor: [
        "Snow sports in northern areas",
        "Desert excursions in Cholistan and Thar",
        "Cultural events and festivals",
        "City exploration in pleasant temperatures",
      ],
    },
  ];

  // Regional climate information
  const regionalClimates = [
    {
      region: "Northern Mountains (Gilgit-Baltistan, Northern KPK)",
      description:
        "Alpine climate with cold winters and mild summers. The high-altitude areas experience heavy snowfall in winter, while valleys have more moderate temperatures.",
      seasonalNotes: [
        {
          season: "Spring",
          note: "Melting snow, blooming wildflowers, and moderate temperatures make this a beautiful time to visit.",
        },
        {
          season: "Summer",
          note: "Pleasant temperatures between 15-30°C make this the peak tourist season. Occasional rainfall.",
        },
        {
          season: "Autumn",
          note: "Clear skies, stunning fall colors, and cool temperatures. An excellent time for photography and trekking.",
        },
        {
          season: "Winter",
          note: "Heavy snowfall, especially at higher elevations. Many passes close, and access to remote areas becomes limited. Ideal for snow sports.",
        },
      ],
    },
    {
      region: "Punjab and Northern Sindh",
      description:
        "Semi-arid climate with hot summers and mild winters. This region experiences significant temperature variations between seasons.",
      seasonalNotes: [
        {
          season: "Spring",
          note: "Pleasant temperatures and blooming landscapes. A good time to visit cities like Lahore and Islamabad.",
        },
        {
          season: "Summer",
          note: "Very hot with temperatures often exceeding 40°C. Monsoon rains provide some relief from July to September.",
        },
        {
          season: "Autumn",
          note: "Gradually cooling temperatures and clear skies make this a comfortable time for sightseeing.",
        },
        {
          season: "Winter",
          note: "Mild days and cool nights. Occasional fog can affect visibility and transportation, especially in December and January.",
        },
      ],
    },
    {
      region: "Balochistan Plateau",
      description:
        "Arid climate with hot summers and cold winters. This region experiences extreme temperature variations between day and night.",
      seasonalNotes: [
        {
          season: "Spring",
          note: "Brief but pleasant with moderate temperatures. Some areas see wildflower blooms if there has been winter rainfall.",
        },
        {
          season: "Summer",
          note: "Extremely hot and dry with daytime temperatures often exceeding 40°C. Not recommended for tourism.",
        },
        {
          season: "Autumn",
          note: "Cooling temperatures make this a better time to visit, though still warm during the day.",
        },
        {
          season: "Winter",
          note: "Cold nights but generally sunny days. The best season to visit most parts of Balochistan.",
        },
      ],
    },
    {
      region: "Coastal Areas (Karachi, Makran Coast)",
      description:
        "Tropical desert climate with hot, humid summers and mild winters. The sea moderates temperature extremes compared to inland areas.",
      seasonalNotes: [
        {
          season: "Spring",
          note: "Warming temperatures with low humidity make this a comfortable time to visit.",
        },
        {
          season: "Summer",
          note: "Hot and humid with temperatures between 30-40°C. Monsoon brings some rainfall, particularly in July and August.",
        },
        {
          season: "Autumn",
          note: "Gradually decreasing humidity and temperatures. Pleasant for beach activities and city exploration.",
        },
        {
          season: "Winter",
          note: "The most pleasant season with temperatures between 15-25°C and low humidity. Ideal for tourism.",
        },
      ],
    },
  ];

  // Best time to visit different destinations
  const bestTimeToVisit = [
    {
      destination: "Islamabad & Rawalpindi",
      bestMonths: "October to April",
      notes:
        "Spring (March-April) and autumn (October-November) offer the most pleasant weather for sightseeing and outdoor activities.",
    },
    {
      destination: "Lahore",
      bestMonths: "October to March",
      notes:
        "Winter months provide comfortable temperatures for exploring the city's rich cultural heritage and historical sites.",
    },
    {
      destination: "Karachi",
      bestMonths: "November to February",
      notes:
        "Winter offers mild temperatures and low humidity, ideal for city exploration and beach visits.",
    },
    {
      destination: "Gilgit-Baltistan (Hunza, Skardu)",
      bestMonths: "May to October",
      notes:
        "Summer and early autumn provide access to high mountain passes and trekking routes. Cherry blossoms in April and fall colors in October are spectacular.",
    },
    {
      destination: "Swat Valley",
      bestMonths: "April to October",
      notes:
        "Spring brings blooming flowers, summer offers lush green landscapes, and autumn showcases beautiful fall colors.",
    },
    {
      destination: "Chitral & Kalash Valleys",
      bestMonths: "May to September",
      notes:
        "Summer is the only time when mountain passes are reliably open. The Kalash festivals in spring and winter are cultural highlights.",
    },
    {
      destination: "Murree & Galliyat",
      bestMonths: "March to June and September to November",
      notes:
        "Spring and autumn offer pleasant weather. Winter (December-February) attracts visitors for snowfall and winter sports.",
    },
    {
      destination: "Quetta",
      bestMonths: "April to October",
      notes:
        "Summer months are surprisingly pleasant due to the high elevation, while spring brings blooming fruit orchards.",
    },
  ];

  // Weather-related travel tips
  const weatherTips = [
    "Check seasonal weather forecasts before planning your trip to Pakistan, as conditions can vary significantly by region.",
    "If traveling during monsoon season (July-September), be prepared for potential travel disruptions due to heavy rainfall, especially in mountainous areas.",
    "When visiting northern areas in winter, check road conditions as many high-altitude passes close due to snow.",
    "Pack appropriate clothing for your destination and season. Temperature variations between day and night can be significant, especially in desert and mountainous regions.",
    "For summer travel to hot regions, schedule outdoor activities for early morning or late afternoon to avoid the midday heat.",
    "During winter, fog can affect visibility and transportation in Punjab and parts of Sindh. Allow extra time for travel.",
    "UV radiation can be intense, especially at high altitudes. Bring sun protection regardless of the season.",
    "The best overall months for traveling throughout Pakistan are October and March, when most regions have pleasant weather.",
  ];

  return (
    <AboutPakistanLayout
      title="Weather & Seasons"
      subtitle="Understanding Pakistan's diverse climate patterns to plan your perfect trip"
      heroImage="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pakistan's Climate Overview
        </h2>
        <p className="text-gray-600 mb-6">
          Pakistan experiences a diverse range of climates due to its varied
          topography, from the snow-capped mountains in the north to the warm
          coastal areas in the south. The country generally has four distinct
          seasons, but their characteristics vary significantly across different
          regions. Understanding these climate patterns will help you plan your
          visit during the most favorable conditions for your chosen
          destinations.
        </p>
      </div>

      {/* Seasons */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Seasons in Pakistan
        </h3>
        <div className="space-y-6">
          {seasons.map((season, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">{season.icon}</div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {season.name}
                  </h4>
                  <p className="text-gray-600 mt-2">{season.description}</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        Temperature
                      </h5>
                      <p className="text-sm text-gray-600">
                        {season.temperature}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        Precipitation
                      </h5>
                      <p className="text-sm text-gray-600">
                        {season.precipitation}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        Recommended Clothing
                      </h5>
                      <p className="text-sm text-gray-600">{season.clothing}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        Best For
                      </h5>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {season.bestFor.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Climate Information */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Regional Climate Variations
        </h3>
        <div className="space-y-6">
          {regionalClimates.map((region, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {region.region}
              </h4>
              <p className="text-gray-600 mb-4">{region.description}</p>

              <h5 className="text-base font-medium text-gray-800 mb-3">
                Seasonal Notes:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {region.seasonalNotes.map((note, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-900">
                      {note.season}:{" "}
                    </span>
                    <span className="text-gray-600">{note.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Time to Visit */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Best Time to Visit Popular Destinations
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Destination
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Best Months
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bestTimeToVisit.map((destination, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {destination.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {destination.bestMonths}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {destination.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monsoon Season */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Monsoon Season in Pakistan
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 mb-4">
            The monsoon season in Pakistan typically runs from July to
            September, bringing significant rainfall to many parts of the
            country. While the monsoon provides relief from summer heat and is
            vital for agriculture, it can also cause flooding and travel
            disruptions.
          </p>

          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Regional Impact:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-4">
            <li>
              <span className="font-medium">Eastern Punjab and Sindh:</span>{" "}
              Receive the heaviest monsoon rainfall, sometimes leading to
              flooding.
            </li>
            <li>
              <span className="font-medium">Khyber Pakhtunkhwa:</span> Moderate
              to heavy rainfall, with mountainous areas at risk of landslides.
            </li>
            <li>
              <span className="font-medium">Northern Areas:</span> Less affected
              by the monsoon but can experience heavy rainfall and landslides.
            </li>
            <li>
              <span className="font-medium">Balochistan:</span> Generally
              receives minimal monsoon rainfall, though flash floods can occur.
            </li>
            <li>
              <span className="font-medium">Coastal Areas:</span> May experience
              high humidity and occasional heavy downpours.
            </li>
          </ul>

          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Travel During Monsoon:
          </h4>
          <p className="text-gray-600">
            If traveling during monsoon season, be prepared for potential delays
            and plan flexible itineraries. Mountain roads may be affected by
            landslides, and some trekking routes become dangerous. However, the
            monsoon also brings lush green landscapes and reduced tourist crowds
            in many areas.
          </p>
        </div>
      </div>

      {/* Weather-Related Travel Tips */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Weather-Related Travel Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weatherTips.map((tip, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Resources */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Weather Resources
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 mb-4">
            Stay updated on Pakistan's weather conditions with these reliable
            resources:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>
              <a
                href="https://www.pmd.gov.pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800"
              >
                Pakistan Meteorological Department (PMD)
              </a>{" "}
              - Official weather forecasts and warnings
            </li>
            <li>
              <a
                href="https://www.accuweather.com/en/pk/pakistan-weather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800"
              >
                AccuWeather - Pakistan
              </a>{" "}
              - Detailed forecasts for cities across Pakistan
            </li>
            <li>
              <a
                href="https://www.windy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800"
              >
                Windy.com
              </a>{" "}
              - Interactive weather maps with detailed forecasts
            </li>
            <li>
              <a
                href="https://www.yr.no/en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800"
              >
                Yr.no
              </a>{" "}
              - Reliable weather service with good coverage of remote areas
            </li>
          </ul>
        </div>
      </div>
    </AboutPakistanLayout>
  );
};

export default Weather;
