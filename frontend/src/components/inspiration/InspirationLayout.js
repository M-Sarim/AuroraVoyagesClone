import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

/**
 * InspirationLayout - A common layout for all inspiration pages
 *
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {string} props.subtitle - The page subtitle
 * @param {string} props.heroImage - URL of the hero image
 * @param {string} props.category - Current category (adventure, culture, wellness, food, sustainable-travel, events)
 * @param {React.ReactNode} props.children - The page content
 */
const InspirationLayout = ({
  title,
  subtitle,
  heroImage,
  category,
  children,
}) => {
  // Navigation categories for the inspiration section
  const inspirationCategories = [
    {
      name: "Adventure",
      href: "/adventure",
      description: "Thrilling experiences in Pakistan",
    },
    {
      name: "Culture",
      href: "/culture",
      description: "Rich cultural heritage and traditions",
    },
    {
      name: "Wellness",
      href: "/wellness",
      description: "Rejuvenate your mind, body and soul",
    },
    {
      name: "Food & Beverages",
      href: "/food",
      description: "Culinary delights and local cuisine",
    },
    {
      name: "Sustainable Travel",
      href: "/sustainable-travel",
      description: "Eco-friendly travel options",
    },
    {
      name: "Events",
      href: "/events",
      description: "Festivals, celebrations and gatherings",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div
        className="relative h-[50vh] min-h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${
            heroImage
              ? heroImage.includes(" ")
                ? heroImage.replace(/ /g, "%20")
                : heroImage
              : ""
          })`,
        }}
      >
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">{subtitle}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <Link
                  to="/destinations"
                  className="ml-1 text-sm text-gray-500 hover:text-gray-700 md:ml-2"
                >
                  Inspiration
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                  {title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200">
        <div className="container-custom">
          <nav
            className="-mb-px flex space-x-8 overflow-x-auto"
            aria-label="Inspiration categories"
          >
            {inspirationCategories.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    item.href.includes(category)
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-12">{children}</div>
    </div>
  );
};

export default InspirationLayout;
