import React, { useState } from "react";
import InspirationLayout from "../../components/inspiration/InspirationLayout";
import InspirationCard from "../../components/inspiration/InspirationCard";

const SustainableTravel = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Sustainable travel categories
  const categories = [
    { id: "all", name: "All Initiatives" },
    { id: "ecotourism", name: "Ecotourism" },
    { id: "conservation", name: "Conservation" },
    { id: "community", name: "Community-Based Tourism" },
    { id: "accommodation", name: "Eco-Friendly Stays" },
    { id: "transport", name: "Green Transportation" },
  ];

  // Sustainable travel initiatives data
  const sustainableInitiatives = [
    {
      id: 1,
      title: "Khunjerab National Park Conservation",
      description:
        "Support conservation efforts in Khunjerab National Park, home to endangered species like the snow leopard and Marco Polo sheep. Learn about the delicate alpine ecosystem and how tourism can contribute to its preservation.",
      image:
        "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "conservation",
      location: "Gilgit-Baltistan",
      link: "/destinations",
      featured: true,
    },
    {
      id: 2,
      title: "Kalash Valley Community Tourism",
      description:
        "Experience authentic cultural immersion with the Kalash people through a community-based tourism initiative that ensures tourism benefits go directly to preserving their unique culture and improving local livelihoods.",
      image: "/kalash-valley-culture.jpg",
      category: "community",
      location: "Chitral",
      link: "/destinations",
    },
    {
      id: 3,
      title: "Eco-Friendly Trekking in Fairy Meadows",
      description:
        "Join responsible trekking expeditions to Fairy Meadows that follow Leave No Trace principles, use local guides, and contribute to trail maintenance and waste management initiatives.",
      image:
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "ecotourism",
      location: "Fairy Meadows",
      link: "/destinations",
    },
    {
      id: 4,
      title: "Solar-Powered Mountain Lodges",
      description:
        "Stay at eco-friendly mountain lodges that operate on solar power, practice water conservation, and use locally-sourced materials and food to minimize their environmental footprint.",
      image:
        "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "accommodation",
      location: "Hunza Valley",
      link: "/destinations",
    },
    {
      id: 5,
      title: "Cycling Tours of Islamabad",
      description:
        "Explore Pakistan's capital on eco-friendly bicycle tours that showcase the city's green spaces, cultural sites, and local neighborhoods while reducing carbon emissions.",
      image: "/cyclic-tours.jpg",
      category: "transport",
      location: "Islamabad",
      link: "/destinations",
    },
    {
      id: 6,
      title: "Deosai National Park Biodiversity Project",
      description:
        "Participate in citizen science initiatives at Deosai National Park, helping researchers monitor biodiversity and collect data on climate change impacts in this unique high-altitude plateau.",
      image:
        "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "conservation",
      location: "Deosai Plains",
      link: "/destinations",
    },
    {
      id: 7,
      title: "Sustainable Fishing Village Experience",
      description:
        "Visit coastal communities practicing sustainable fishing methods and learn about marine conservation efforts while supporting local economies through responsible tourism.",
      image:
        "https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "community",
      location: "Sindh Coast",
      link: "/destinations",
    },
    {
      id: 8,
      title: "Electric Vehicle Tours",
      description:
        "Join eco-conscious tours using electric vehicles to explore urban centers and nearby attractions, reducing air pollution and noise while enjoying comfortable transportation.",
      image: "/electric-tours.jpg",
      category: "transport",
      location: "Lahore",
      link: "/destinations",
    },
  ];

  // Filter sustainable initiatives based on active category
  const filteredInitiatives =
    activeFilter === "all"
      ? sustainableInitiatives
      : sustainableInitiatives.filter(
          (initiative) => initiative.category === activeFilter
        );

  return (
    <InspirationLayout
      title="Sustainable Travel"
      subtitle="Explore Pakistan responsibly while preserving its natural beauty and cultural heritage"
      heroImage="/electric-tours.jpg"
      category="sustainable-travel"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Travel Sustainably in Pakistan
        </h2>
        <p className="text-lg text-gray-600">
          Pakistan's diverse landscapes and rich cultural heritage are precious
          resources that require protection. By choosing sustainable travel
          options, you can minimize your environmental impact, support local
          communities, and help preserve Pakistan's natural and cultural
          treasures for future generations.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                activeFilter === category.id
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sustainable initiatives grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredInitiatives.map((initiative) => (
          <div
            key={initiative.id}
            className={initiative.featured ? "md:col-span-2" : ""}
          >
            <InspirationCard
              title={initiative.title}
              description={initiative.description}
              image={initiative.image}
              link={initiative.link}
              category={initiative.category}
              location={initiative.location}
              featured={initiative.featured}
            />
          </div>
        ))}
      </div>

      {/* Sustainable travel tips */}
      <div className="mt-16 bg-green-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Sustainable Travel Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg
                className="h-6 w-6 text-green-600 mr-2"
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
              Reduce Plastic Waste
            </h4>
            <p className="text-gray-600">
              Bring a reusable water bottle, shopping bag, and food containers.
              Avoid single-use plastics, especially in mountain and coastal
              areas where waste management is challenging.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg
                className="h-6 w-6 text-green-600 mr-2"
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
              Support Local Communities
            </h4>
            <p className="text-gray-600">
              Stay in locally-owned accommodations, eat at local restaurants,
              buy souvenirs directly from artisans, and hire local guides to
              ensure tourism benefits reach local communities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg
                className="h-6 w-6 text-green-600 mr-2"
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
              Respect Wildlife
            </h4>
            <p className="text-gray-600">
              Observe animals from a distance, never feed them, and avoid
              activities that disturb or exploit wildlife. Choose operators that
              follow ethical wildlife viewing practices.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <svg
                className="h-6 w-6 text-green-600 mr-2"
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
              Conserve Water and Energy
            </h4>
            <p className="text-gray-600">
              Be mindful of your water and energy usage, especially in areas
              where these resources are scarce. Take short showers, reuse
              towels, and turn off lights and air conditioning when not needed.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainable travel pledge */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Take the Sustainable Travel Pledge
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Join fellow travelers in committing to responsible tourism practices
          that protect Pakistan's natural environment, respect its cultural
          heritage, and support local communities.
        </p>
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-full transition-colors">
          Sign the Pledge
        </button>
      </div>
    </InspirationLayout>
  );
};

export default SustainableTravel;
