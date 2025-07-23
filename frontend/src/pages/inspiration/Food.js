import React, { useState } from "react";
import InspirationLayout from "../../components/inspiration/InspirationLayout";
import InspirationCard from "../../components/inspiration/InspirationCard";

const Food = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Food categories
  const categories = [
    { id: "all", name: "All Culinary Experiences" },
    { id: "street", name: "Street Food" },
    { id: "traditional", name: "Traditional Cuisine" },
    { id: "sweets", name: "Desserts & Sweets" },
    { id: "tea", name: "Tea Culture" },
    { id: "cooking", name: "Cooking Classes" },
  ];

  // Food experiences data
  const foodExperiences = [
    {
      id: 1,
      title: "Food Street in Lahore",
      description:
        "Explore the famous Food Street in Old Lahore, where you can sample a wide variety of Pakistani dishes while enjoying the historic architecture and vibrant atmosphere.",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      category: "street",
      location: "Lahore",
      link: "/destinations",
      featured: true,
    },
    {
      id: 2,
      title: "Traditional Hunza Cuisine",
      description:
        "Taste the unique cuisine of Hunza Valley, known for its organic ingredients, apricot-based dishes, and traditional breads that contribute to the legendary longevity of Hunza people.",
      image: "/hunza-cuisine.jpg",
      category: "traditional",
      location: "Hunza Valley",
      link: "/destinations",
    },
    {
      id: 3,
      title: "Karachi Seafood Experience",
      description:
        "Savor the fresh seafood of Karachi, prepared with local spices and cooking techniques that highlight the coastal flavors of Pakistan's largest city.",
      image:
        "https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      category: "traditional",
      location: "Karachi",
      link: "/destinations",
    },
    {
      id: 4,
      title: "Pakistani Sweets Workshop",
      description:
        "Learn to make traditional Pakistani sweets like jalebi, gulab jamun, and barfi in this hands-on workshop led by expert confectioners.",
      image: "/pakistani-sweet-workshop.jpg",
      category: "sweets",
      location: "Islamabad",
      link: "/destinations",
    },
    {
      id: 5,
      title: "Tea Culture Experience",
      description:
        "Discover Pakistan's rich tea culture, from the pink Kashmiri chai to the strong and aromatic Pashtun kahwah, and learn about the social significance of tea in Pakistani society.",
      image:
        "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "tea",
      location: "Peshawar",
      link: "/destinations",
    },
    {
      id: 6,
      title: "Biryani Cooking Class",
      description:
        "Master the art of making authentic Pakistani biryani, learning the secrets of spice blending, rice preparation, and the slow-cooking technique that makes this dish special.",
      image: "/hunza-cuisine.jpg",
      category: "cooking",
      location: "Karachi",
      link: "/destinations",
    },
    {
      id: 7,
      title: "Street Food Tour of Peshawar",
      description:
        "Take a guided tour of Peshawar's vibrant street food scene, sampling chapli kebabs, Peshawari karahi, and other local specialties in the historic city.",
      image: "/chapli-kabab.jpg",
      category: "street",
      location: "Peshawar",
      link: "/destinations",
    },
    {
      id: 8,
      title: "Balochi Sajji Experience",
      description:
        "Try the traditional Balochi sajji, a whole lamb or chicken stuffed with rice and slow-roasted over an open fire, served with special sauces and flatbread.",
      image: "/balochi-sajji.jpg",
      category: "traditional",
      location: "Quetta",
      link: "/destinations",
    },
  ];

  // Filter food experiences based on active category
  const filteredExperiences =
    activeFilter === "all"
      ? foodExperiences
      : foodExperiences.filter(
          (experience) => experience.category === activeFilter
        );

  return (
    <InspirationLayout
      title="Food & Beverages"
      subtitle="Savor the rich flavors and culinary traditions of Pakistan"
      heroImage="/pakistani-sweet-workshop.jpg"
      category="food"
    >
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          A Feast for the Senses
        </h2>
        <p className="text-lg text-gray-600">
          Pakistani cuisine is a vibrant tapestry of flavors, influenced by the
          country's diverse regions, history, and neighboring culinary
          traditions. From aromatic biryanis and rich curries to delicate sweets
          and refreshing beverages, Pakistan offers a wealth of gastronomic
          experiences for food lovers.
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

      {/* Food experiences grid */}
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

      {/* Must-try dishes section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Must-Try Pakistani Dishes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <img
              src="/hunza-cuisine.jpg"
              alt="Biryani"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-gray-900">Biryani</h4>
              <p className="text-sm text-gray-600">
                Fragrant rice dish cooked with meat, spices, and herbs
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <img
              src="/chapli-kabab.jpg"
              alt="Chapli Kebab"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-gray-900">Chapli Kebab</h4>
              <p className="text-sm text-gray-600">
                Spicy minced meat patties, a specialty of Peshawar
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <img
              src="/balochi-sajji.jpg"
              alt="Nihari"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-gray-900">Nihari</h4>
              <p className="text-sm text-gray-600">
                Slow-cooked stew of meat, bone marrow, and spices
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <img
              src="/pakistani-sweet-workshop.jpg"
              alt="Jalebi"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-gray-900">Jalebi</h4>
              <p className="text-sm text-gray-600">
                Deep-fried sweet pretzel soaked in sugar syrup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dining etiquette section */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Pakistani Dining Etiquette
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
                Eating with Your Hand
              </h4>
              <p className="mt-1 text-gray-600">
                Traditionally, Pakistanis eat with their right hand. If you're
                not comfortable with this, it's perfectly acceptable to ask for
                cutlery.
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
                Communal Dining
              </h4>
              <p className="mt-1 text-gray-600">
                Many meals are served family-style, with everyone sharing from
                communal dishes. Take food from the portion of the dish closest
                to you.
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
                Accepting Food
              </h4>
              <p className="mt-1 text-gray-600">
                It's polite to accept food when offered, even if just a small
                amount. Refusing can be seen as impolite.
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
                Complimenting the Food
              </h4>
              <p className="mt-1 text-gray-600">
                It's customary to compliment the host on the food. The phrase
                "Bohat mazaydar hai" (It's very delicious) is always
                appreciated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </InspirationLayout>
  );
};

export default Food;
