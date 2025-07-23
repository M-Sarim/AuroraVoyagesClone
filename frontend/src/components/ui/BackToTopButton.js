import React, { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

/**
 * BackToTopButton component that appears when the user scrolls down the page
 * and allows them to scroll back to the top with a single click
 */
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
