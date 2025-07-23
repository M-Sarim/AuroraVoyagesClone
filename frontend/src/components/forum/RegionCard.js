import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getConsistentDefaultImage } from "../../utils/imageHelper";

// Map region names to specific images in the public folder
const regionImageMap = {
  Karachi: "/Karachi.jpg",
  Lahore: "/Lahore.jpeg",
  Islamabad: "/islamabad.jpg",
  Peshawar: "/Peshawar.jpg",
  Quetta: "/Quetta.jpeg",
  Murree: "/Murree.jpg",
  Skardu: "/images/skardu_1.jpg",
  "Nathia Gali": "/NathiaGali.jpg",
  // Add more mappings as needed
};

const RegionCard = ({ region }) => {
  const [imageError, setImageError] = useState(false);

  // Try to get a city-specific image first, then use region images, then fallback
  let imageUrl;

  if (!imageError) {
    // First try to use the mapped image based on region name
    if (regionImageMap[region.name]) {
      imageUrl = regionImageMap[region.name];
    }
    // Then try to use the first image from the region's images array
    else if (region.images && region.images.length > 0) {
      imageUrl = region.images[0];
    }
    // Otherwise use a consistent fallback image based on region name
    else {
      imageUrl = getConsistentDefaultImage(region.name);
    }
  } else {
    // If there was an error loading the image, use a fallback
    imageUrl = getConsistentDefaultImage(region.name);
  }

  // We'll use the actual post count if available, but won't display mock data

  return (
    <Link
      to={`/forum/region/${region._id}`}
      className="card group hover:translate-y-[-4px] transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={region.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="text-xl font-bold">{region.name}</h3>
          <p className="text-sm text-white/90">{region.country}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-neutral-600 line-clamp-2 text-sm">
          {region.description
            ? region.description.length > 120
              ? `${region.description.substring(0, 120)}...`
              : region.description
            : "Explore discussions about this beautiful region of Pakistan."}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary-600 font-medium text-sm">
            View Discussions
          </span>
          <svg
            className="w-5 h-5 text-primary-600 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default RegionCard;
