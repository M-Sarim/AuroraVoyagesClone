/**
 * Helper function to determine if a string is a URL or a local file path
 * @param {string} src - The image source string
 * @returns {boolean} - True if the string is a URL
 */
export const isUrl = (src) => {
  return src && (src.startsWith("http://") || src.startsWith("https://"));
};

// Default images to use when no image is available
const DEFAULT_IMAGES = [
  "/images/pakistan_mountain_1.jpg",
  "/images/pakistan_landscape_2.jpg",
  "/images/hunza_valley_1.jpg",
  "/images/skardu_1.jpg",
  "/images/fairy_meadows_1.jpg",
  "/images/swat_valley_1.jpg",
  "/images/naltar_valley_1.jpg",
  "/islamabad.jpg",
  "/Murree.jpg",
  "/NathiaGali.jpg",
];

// Map of destination names to specific default images
const DESTINATION_DEFAULT_IMAGES = {
  "Hunza Valley": "/images/hunza_valley_1.jpg",
  Skardu: "/images/skardu_1.jpg",
  "Fairy Meadows": "/images/fairy_meadows_1.jpg",
  "Swat Valley": "/images/swat_valley_1.jpg",
  "Naltar Valley": "/images/naltar_valley_1.jpg",
  Islamabad: "/islamabad.jpg",
  Murree: "/Murree.jpg",
  "Nathia Gali": "/NathiaGali.jpg",
};

// Get a consistent default image based on string hash
export const getConsistentDefaultImage = (str) => {
  if (!str) return DEFAULT_IMAGES[0];

  // If we have a specific image for this destination name, use it
  if (DESTINATION_DEFAULT_IMAGES[str]) {
    return DESTINATION_DEFAULT_IMAGES[str];
  }

  // Otherwise use a hash of the string to get a consistent index
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % DEFAULT_IMAGES.length;
  return DEFAULT_IMAGES[index];
};

/**
 * Helper function to get the correct image URL
 * @param {string} src - The image source string
 * @param {string} name - Optional name to use for consistent fallback selection
 * @returns {string} - The correct image URL
 */
export const getImageUrl = (src, name) => {
  // If no source is provided, use a consistent default image based on name
  if (!src) {
    return getConsistentDefaultImage(name);
  }

  // If the source is already a URL, return it as is
  if (isUrl(src)) {
    return src;
  }

  // If the source already starts with /images, it's a local path
  if (src.startsWith("/images/")) {
    // Encode spaces in the URL if present
    return src.includes(" ") ? src.replace(/ /g, "%20") : src;
  }

  // Otherwise, assume it's a local file and prepend the /images path
  const path = `/images/${src}`;
  // Encode spaces in the URL if present
  return path.includes(" ") ? path.replace(/ /g, "%20") : path;
};
