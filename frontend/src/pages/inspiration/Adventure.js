import React, { useState } from "react";
import InspirationLayout from "../../components/inspiration/InspirationLayout";
import InspirationCard from "../../components/inspiration/InspirationCard";

const Adventure = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Adventure categories
  const categories = [
    { id: "all", name: "All Adventures" },
    { id: "trekking", name: "Trekking & Hiking" },
    { id: "mountaineering", name: "Mountaineering" },
    { id: "skiing", name: "Skiing" },
    { id: "rafting", name: "White Water Rafting" },
    { id: "paragliding", name: "Paragliding" },
    { id: "camping", name: "Camping" },
  ];

  // Adventure experiences data
  const adventures = [
    {
      id: 1,
      title: "K2 Base Camp Trek",
      description:
        "Embark on an epic journey to the base of the world's second-highest mountain. This challenging trek takes you through stunning landscapes, glaciers, and remote villages of Baltistan.",
      image: "/k2_base_camp_trek24.jpg",
      category: "trekking",
      location: "Baltistan",
      link: "/destinations/skardu",
      featured: true,
    },
    {
      id: 2,
      title: "Fairy Meadows & Nanga Parbat Base Camp",
      description:
        'Visit the enchanting Fairy Meadows and trek to the base camp of Nanga Parbat, the ninth highest mountain in the world, also known as the "Killer Mountain".',
      image: "/Fairy-Meadows.jpg",
      category: "trekking",
      location: "Gilgit-Baltistan",
      link: "/destinations/fairy-meadows",
    },
    {
      id: 3,
      title: "Skiing in Malam Jabba",
      description:
        "Experience winter sports at Pakistan's premier ski resort. Malam Jabba offers excellent slopes for both beginners and experienced skiers with breathtaking views of the Swat Valley.",
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "skiing",
      location: "Swat Valley",
      link: "/destinations/swat-valley",
    },
    {
      id: 4,
      title: "White Water Rafting in Indus River",
      description:
        "Navigate the thrilling rapids of the mighty Indus River. This adventure offers an adrenaline-pumping experience through some of the most spectacular gorges in the world.",
      image:
        "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "rafting",
      location: "Gilgit-Baltistan",
      link: "/destinations",
    },
    {
      id: 5,
      title: "Paragliding in Khanpur",
      description:
        "Soar above the beautiful Khanpur Lake and surrounding landscapes. This paragliding experience offers a bird's eye view of the stunning scenery below.",
      image: "/paragliding.jpg",
      category: "paragliding",
      location: "Khanpur",
      link: "/destinations",
    },
    {
      id: 6,
      title: "Camping at Saif-ul-Mulook Lake",
      description:
        "Camp under the stars at one of Pakistan's most beautiful alpine lakes. Legend has it that a prince fell in love with a fairy princess at this magical spot.",
      image:
        "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "camping",
      location: "Kaghan Valley",
      link: "/destinations",
    },
    {
      id: 7,
      title: "Climbing Broad Peak",
      description:
        "For experienced mountaineers, the challenge of climbing Broad Peak (8,051m) awaits. As the 12th highest mountain in the world, it offers a serious high-altitude climbing experience.",
      image:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1103&q=80",
      category: "mountaineering",
      location: "Karakoram Range",
      link: "/destinations",
    },
    {
      id: 8,
      title: "Deosai Plains Trek",
      description:
        'Trek across the Deosai National Park, known as the "Land of Giants". At an average elevation of 4,114 meters, it\'s one of the highest plateaus in the world and home to the Himalayan brown bear.',
      image:
        "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "trekking",
      location: "Skardu",
      link: "/destinations/skardu",
    },
  ];

  // Filter adventures based on active category
  const filteredAdventures =
    activeFilter === "all"
      ? adventures
      : adventures.filter((adventure) => adventure.category === activeFilter);

  return (
    <InspirationLayout
      title="Adventure"
      subtitle="Discover thrilling experiences and outdoor activities across Pakistan's diverse landscapes"
      heroImage="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      category="adventure"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Unleash Your Adventurous Spirit
        </h2>
        <p className="text-lg text-gray-600">
          Pakistan is a paradise for adventure enthusiasts, offering everything
          from towering peaks and vast glaciers to rushing rivers and lush
          valleys. Whether you're an experienced mountaineer or a casual
          trekker, there's an adventure waiting for you.
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

      {/* Adventure cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAdventures.map((adventure) => (
          <div
            key={adventure.id}
            className={adventure.featured ? "md:col-span-2" : ""}
          >
            <InspirationCard
              title={adventure.title}
              description={adventure.description}
              image={adventure.image}
              link={adventure.link}
              category={adventure.category}
              location={adventure.location}
              featured={adventure.featured}
            />
          </div>
        ))}
      </div>

      {/* Adventure tips */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Adventure Tips for Pakistan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Best Time to Visit
              </h4>
              <p className="mt-1 text-gray-600">
                The summer months (May to September) are ideal for most mountain
                adventures, while winter (December to February) is perfect for
                skiing.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">Permits</h4>
              <p className="mt-1 text-gray-600">
                Some areas require special permits. Always check requirements
                before planning your adventure.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Local Guides
              </h4>
              <p className="mt-1 text-gray-600">
                Hiring local guides is highly recommended for most adventures,
                especially in remote areas.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-lg font-medium text-gray-900">
                Altitude Sickness
              </h4>
              <p className="mt-1 text-gray-600">
                Be aware of altitude sickness when trekking or climbing at high
                elevations. Acclimatize properly and stay hydrated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </InspirationLayout>
  );
};

export default Adventure;
