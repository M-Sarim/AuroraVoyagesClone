import React from "react";
import { Link } from "react-router-dom";

const Sitemap = () => {
  // Define site structure
  const siteStructure = [
    {
      category: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Destinations", path: "/destinations" },
        { name: "Vacation Packages", path: "/vacations" },
        { name: "Scenic Routes", path: "/scenic-routes" },
        { name: "National Parks", path: "/national-parks" },
        { name: "How to Get There", path: "/how-to-get-there" },
      ],
    },
    {
      category: "About Pakistan",
      links: [
        { name: "Safe Travel", path: "/safe-travel" },
        { name: "Visa Information", path: "/visa-info" },
        { name: "Geography of Pakistan", path: "/geography" },
        { name: "General Information", path: "/info" },
        { name: "Weather & Seasons", path: "/weather" },
        { name: "Regulations & Culture Hub", path: "/regulations-culture" },
      ],
    },
    {
      category: "Inspiration",
      links: [
        { name: "Adventure", path: "/adventure" },
        { name: "Culture", path: "/culture" },
        { name: "Wellness", path: "/wellness" },
        { name: "Food", path: "/food" },
        { name: "Sustainable Travel", path: "/sustainable-travel" },
        { name: "Events", path: "/events" },
      ],
    },
    {
      category: "Community",
      links: [
        { name: "Forum Home", path: "/forum" },
        { name: "All Discussions", path: "/forum/all-discussions" },
      ],
    },
    {
      category: "Travel Tools",
      links: [
        { name: "Itinerary Planner", path: "/itinerary-planner" },
        { name: "Download Maps", path: "/download-maps" },
        { name: "Offline Maps", path: "/offline-maps" },
        { name: "AR Navigation", path: "/ar-navigation" },
      ],
    },
    {
      category: "User Account",
      links: [
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Profile", path: "/profile" },
        { name: "My Bookings", path: "/bookings" },
        { name: "Transport Bookings", path: "/transport-bookings" },
      ],
    },
    {
      category: "Tour Guide",
      links: [
        { name: "Become a Tour Guide", path: "/tour-guide/register" },
        { name: "Tour Guide Dashboard", path: "/tour-guide/dashboard" },
        { name: "Submit Package", path: "/tour-guide/submit-package" },
        { name: "My Submissions", path: "/tour-guide/my-submissions" },
        { name: "Tour Guide Bookings", path: "/tour-guide/bookings" },
      ],
    },
    {
      category: "Legal & Support",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "FAQ", path: "/faq" },
        { name: "Cancellation Policy", path: "/cancellation" },
      ],
    },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero section */}
      <div className="relative bg-primary-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/pakistan_landscape.jpg"
            alt="Pakistan landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sitemap
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Find your way around the Aurora Voyages website.
          </p>
        </div>
      </div>

      {/* Sitemap content */}
      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteStructure.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {section.category}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional information */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Can't find what you're looking for?{" "}
              <a
                href="mailto:auroravoyagesinfo@gmail.com"
                className="text-primary-600 hover:underline"
              >
                Contact our support team
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
