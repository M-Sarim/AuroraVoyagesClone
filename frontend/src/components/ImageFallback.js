import React, { useState, useMemo } from "react";
import { getConsistentDefaultImage } from "../utils/imageHelper";

/**
 * A component that displays an image with a fallback if the primary image fails to load
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Primary image source
 * @param {string} props.alt - Image alt text
 * @param {string} props.fallbackSrc - Fallback image source
 * @param {Object} props.imgProps - Additional props to pass to the img element
 * @returns {React.ReactElement} - The image component
 */

const ImageFallback = ({ src, alt, fallbackSrc, ...imgProps }) => {
  // Determine fallback source once and memoize it
  const determinedFallbackSrc = useMemo(() => {
    if (fallbackSrc) return fallbackSrc;
    return getConsistentDefaultImage(alt);
  }, [fallbackSrc, alt]);

  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const onError = () => {
    if (!hasError) {
      setImgSrc(determinedFallbackSrc);
      setHasError(true);
    }
  };

  // Encode spaces in the URL if present
  const encodedSrc =
    imgSrc && imgSrc.includes(" ") ? imgSrc.replace(/ /g, "%20") : imgSrc;
  return <img src={encodedSrc} alt={alt} onError={onError} {...imgProps} />;
};

export default ImageFallback;
