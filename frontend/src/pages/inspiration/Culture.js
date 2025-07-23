import React, { useState } from "react";
import { Link } from "react-router-dom";
import InspirationLayout from "../../components/inspiration/InspirationLayout";
import InspirationCard from "../../components/inspiration/InspirationCard";

const Culture = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Culture categories
  const categories = [
    { id: "all", name: "All Cultural Experiences" },
    { id: "heritage", name: "Heritage Sites" },
    { id: "traditions", name: "Traditions" },
    { id: "arts", name: "Arts & Crafts" },
    { id: "music", name: "Music & Dance" },
    { id: "festivals", name: "Festivals" },
  ];

  // Cultural experiences data
  const culturalExperiences = [
    {
      id: 1,
      title: "Lahore Fort & Shalimar Gardens",
      description:
        "Explore the magnificent Lahore Fort and Shalimar Gardens, both UNESCO World Heritage sites that showcase the splendor of Mughal architecture and garden design.",
      image: "/lahore-fort.jpg",
      category: "heritage",
      location: "Lahore",
      link: "/destinations",
      featured: true,
    },
    {
      id: 2,
      title: "Kalash Valley Cultural Experience",
      description:
        "Visit the unique Kalash Valley to witness the distinct culture, traditions, and colorful festivals of the Kalash people, one of Pakistan's smallest ethnic and religious minorities.",
      image: "/kalash-valley-culture.jpg",
      category: "traditions",
      location: "Chitral",
      link: "/destinations",
    },
    {
      id: 3,
      title: "Truck Art Workshops",
      description:
        "Learn about the vibrant tradition of Pakistani truck art and try your hand at this unique form of folk art under the guidance of skilled artisans.",
      image: "/truck-art-workshop.jpg",
      category: "arts",
      location: "Karachi",
      link: "/destinations",
    },
    {
      id: 4,
      title: "Sufi Music Experience",
      description:
        "Immerse yourself in the spiritual world of Sufi music at a traditional qawwali performance, where mystical poetry is sung to create a transcendent experience.",
      image:
        "https://images.unsplash.com/photo-1508025690966-2a9a1957da31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      category: "music",
      location: "Shrine of Data Ganj Bakhsh, Lahore",
      link: "/destinations",
    },
    {
      id: 5,
      title: "Basant Kite Festival",
      description:
        "Experience the joy and excitement of Basant, the traditional spring kite festival where the sky is filled with colorful kites and the air buzzes with festive energy.",
      image: "/kite-festival.jpg",
      category: "festivals",
      location: "Lahore",
      link: "/destinations",
    },
    {
      id: 6,
      title: "Mohenjo-daro Archaeological Site",
      description:
        "Step back in time at Mohenjo-daro, one of the world's earliest major urban settlements and a remarkable example of Indus Valley Civilization, dating back to 2500 BCE.",
      image: "/kalash-valley-culture.jpg",
      category: "heritage",
      location: "Sindh",
      link: "/destinations",
    },
    {
      id: 7,
      title: "Traditional Pottery Making",
      description:
        "Learn the ancient art of pottery making from master craftsmen in Multan, known for its distinctive blue pottery tradition that has been passed down through generations.",
      image:
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "arts",
      location: "Multan",
      link: "/destinations",
    },
    {
      id: 8,
      title: "Shandur Polo Festival",
      description:
        "Witness the world's highest polo tournament at Shandur Pass, where teams from Chitral and Gilgit compete in this traditional sport played at an altitude of 3,700 meters.",
      image: "/shandur-festival.jpg",
      category: "festivals",
      location: "Shandur Pass",
      link: "/destinations",
    },
  ];

  // Filter cultural experiences based on active category
  const filteredExperiences =
    activeFilter === "all"
      ? culturalExperiences
      : culturalExperiences.filter(
          (experience) => experience.category === activeFilter
        );

  return (
    <InspirationLayout
      title="Culture"
      subtitle="Immerse yourself in Pakistan's rich cultural heritage, traditions, and artistic expressions"
      heroImage="/lahore-fort.jpg"
      category="culture"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Discover Pakistan's Cultural Tapestry
        </h2>
        <p className="text-lg text-gray-600">
          Pakistan boasts a rich cultural heritage shaped by its diverse
          history, geography, and people. From ancient civilizations to Mughal
          splendor, from vibrant folk traditions to contemporary arts, Pakistan
          offers a wealth of cultural experiences for curious travelers.
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

      {/* Cultural experiences grid */}
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

      {/* Cultural etiquette section */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Cultural Etiquette in Pakistan
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
                Dress Modestly
              </h4>
              <p className="mt-1 text-gray-600">
                Both men and women should dress modestly, especially when
                visiting religious sites. Women may want to carry a scarf to
                cover their heads when necessary.
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
              <h4 className="text-lg font-medium text-gray-900">Greetings</h4>
              <p className="mt-1 text-gray-600">
                The traditional greeting is "Assalamu alaikum" (peace be upon
                you). When meeting someone, a handshake is common among men,
                while a nod of acknowledgment is appropriate between men and
                women.
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
              <h4 className="text-lg font-medium text-gray-900">Hospitality</h4>
              <p className="mt-1 text-gray-600">
                Pakistanis are known for their hospitality. If invited to
                someone's home, it's customary to bring a small gift. Always
                accept offered food or tea, even if just a small amount.
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
              <h4 className="text-lg font-medium text-gray-900">Photography</h4>
              <p className="mt-1 text-gray-600">
                Always ask permission before photographing people, especially
                women. Some religious sites may prohibit photography.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/regulations-culture"
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
          >
            Learn more about Pakistani culture and customs
            <svg
              className="ml-2 h-5 w-5"
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
    </InspirationLayout>
  );
};

export default Culture;
