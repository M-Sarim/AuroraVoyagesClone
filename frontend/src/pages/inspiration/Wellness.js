import React, { useState } from "react";
import InspirationLayout from "../../components/inspiration/InspirationLayout";
import InspirationCard from "../../components/inspiration/InspirationCard";

const Wellness = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Wellness categories
  const categories = [
    { id: "all", name: "All Wellness" },
    { id: "spa", name: "Spa & Massage" },
    { id: "yoga", name: "Yoga & Meditation" },
    { id: "hotsprings", name: "Hot Springs" },
    { id: "retreat", name: "Wellness Retreats" },
    { id: "traditional", name: "Traditional Healing" },
  ];

  // Wellness experiences data
  const wellnessExperiences = [
    {
      id: 1,
      title: "Himalayan Salt Therapy",
      description:
        "Experience the healing properties of Himalayan salt in its place of origin. Salt therapy, also known as halotherapy, can help with respiratory issues, skin conditions, and overall wellness.",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "spa",
      location: "Khewra Salt Mine",
      link: "/destinations",
      featured: true,
    },
    {
      id: 2,
      title: "Meditation Retreat in Swat Valley",
      description:
        "Find inner peace amidst the serene mountains of Swat Valley. This meditation retreat offers guided sessions, mindfulness practices, and yoga in a tranquil natural setting.",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "yoga",
      location: "Swat Valley",
      link: "/destinations/swat-valley",
    },
    {
      id: 3,
      title: "Garam Chashma Hot Springs",
      description:
        "Soak in the natural hot springs of Garam Chashma, known for their mineral-rich waters that are believed to have therapeutic properties for various ailments.",
      image: "/garam-chashma-hot-springs.jpg",
      category: "hotsprings",
      location: "Chitral",
      link: "/destinations",
    },
    {
      id: 4,
      title: "Ayurvedic Wellness Center",
      description:
        "Experience traditional Ayurvedic treatments adapted to Pakistani traditions at this wellness center that focuses on holistic healing and balance.",
      image:
        "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "traditional",
      location: "Islamabad",
      link: "/destinations",
    },
    {
      id: 5,
      title: "Eco-Wellness Retreat in Hunza",
      description:
        "Rejuvenate at this eco-friendly wellness retreat in Hunza Valley, offering organic cuisine, yoga, meditation, and stunning mountain views.",
      image:
        "https://images.unsplash.com/photo-1532798442725-41036acc7489?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "retreat",
      location: "Hunza Valley",
      link: "/destinations",
    },
    {
      id: 6,
      title: "Traditional Hakeem Experience",
      description:
        "Learn about traditional Pakistani herbal medicine from a Hakeem (traditional healer) who uses ancient techniques and natural remedies.",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "traditional",
      location: "Lahore",
      link: "/destinations",
    },
    {
      id: 7,
      title: "Yoga by the Attabad Lake",
      description:
        "Practice yoga on the shores of the stunning turquoise Attabad Lake, surrounded by towering mountains and fresh air.",
      image:
        "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "yoga",
      location: "Hunza Valley",
      link: "/destinations",
    },
    {
      id: 8,
      title: "Luxury Spa Retreat",
      description:
        "Indulge in luxury spa treatments that blend international techniques with local ingredients and traditions at this premium wellness destination.",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "spa",
      location: "Bhurban",
      link: "/destinations",
    },
  ];

  // Filter wellness experiences based on active category
  const filteredExperiences =
    activeFilter === "all"
      ? wellnessExperiences
      : wellnessExperiences.filter(
          (experience) => experience.category === activeFilter
        );

  return (
    <InspirationLayout
      title="Wellness"
      subtitle="Rejuvenate your mind, body, and soul with Pakistan's unique wellness experiences"
      heroImage="/garam-chashma-hot-springs.jpg"
      category="wellness"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Wellness Journeys in Pakistan
        </h2>
        <p className="text-lg text-gray-600">
          Pakistan offers unique wellness experiences that combine natural
          healing elements, ancient traditions, and modern practices. From the
          mineral-rich hot springs of the north to traditional healing methods
          passed down through generations, discover how to rejuvenate your body
          and mind in this beautiful country.
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

      {/* Wellness experiences grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperiences.map((experience) => (
          <div
            key={experience.id}
            className={experience.featured ? "md:col-span-2" : ""}
          >
            <InspirationCard
              title={experience.title}
              description={experience.description}
              image={experience.image}
              link={experience.link}
              category={experience.category}
              location={experience.location}
              featured={experience.featured}
            />
          </div>
        ))}
      </div>

      {/* Wellness benefits section */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Benefits of Wellness Travel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Stress Reduction
            </h4>
            <p className="text-gray-600">
              Escape the daily grind and immerse yourself in peaceful
              environments that help reduce stress and anxiety.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Physical Health
            </h4>
            <p className="text-gray-600">
              Improve your physical wellbeing through activities, treatments,
              and natural remedies that promote healing and vitality.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Mental Clarity
            </h4>
            <p className="text-gray-600">
              Gain new perspectives and mental clarity through mindfulness
              practices and disconnecting from digital distractions.
            </p>
          </div>
        </div>
      </div>
    </InspirationLayout>
  );
};

export default Wellness;
