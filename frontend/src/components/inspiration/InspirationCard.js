import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

/**
 * InspirationCard - A card component for displaying inspiration items
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.image - Image URL
 * @param {string} props.link - Link URL (optional)
 * @param {string} props.linkText - Link text (optional, defaults to "Learn more")
 * @param {string} props.category - Category badge text (optional)
 * @param {string} props.location - Location text (optional)
 * @param {boolean} props.featured - Whether this is a featured card (larger)
 */
const InspirationCard = ({
  title,
  description,
  image,
  link,
  linkText = "Learn more",
  category,
  location,
  featured = false,
}) => {
  const cardContent = (
    <>
      <div
        className={`relative overflow-hidden rounded-t-xl ${
          featured ? "h-80" : "h-60"
        }`}
      >
        <img
          src={
            image
              ? image.includes(" ")
                ? image.replace(/ /g, "%20")
                : image
              : ""
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {category && (
          <span className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        )}
        {location && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-white flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {location}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3
          className={`font-bold text-gray-900 mb-2 ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        {link && (
          <div className="mt-auto">
            <span className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors">
              {linkText}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col ${
        featured ? "col-span-2" : ""
      }`}
    >
      {link ? (
        <Link to={link} className="flex flex-col h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default InspirationCard;
