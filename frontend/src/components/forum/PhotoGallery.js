import React, { useState } from 'react';

const PhotoGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const openModal = (index) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // For keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  };

  // Render different layouts based on number of images
  const renderGalleryGrid = () => {
    if (images.length === 1) {
      return (
        <div 
          className="h-64 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
        >
          <img 
            src={images[0]} 
            alt="Gallery" 
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 h-64">
          {images.map((image, index) => (
            <div 
              key={index}
              className="rounded-xl overflow-hidden cursor-pointer"
              onClick={() => openModal(index)}
            >
              <img 
                src={image} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      );
    } else if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-2 h-64">
          <div 
            className="rounded-xl overflow-hidden cursor-pointer"
            onClick={() => openModal(0)}
          >
            <img 
              src={images[0]} 
              alt="Gallery 1" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((image, index) => (
              <div 
                key={index + 1}
                className="rounded-xl overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <img 
                  src={image} 
                  alt={`Gallery ${index + 2}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-2 h-64">
          <div 
            className="rounded-xl overflow-hidden cursor-pointer"
            onClick={() => openModal(0)}
          >
            <img 
              src={images[0]} 
              alt="Gallery 1" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((image, index) => (
              <div 
                key={index + 1}
                className="rounded-xl overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <img 
                  src={image} 
                  alt={`Gallery ${index + 2}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {images.length > 3 && (
              <div 
                className="relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => openModal(3)}
              >
                <img 
                  src={images[3]} 
                  alt={`Gallery 4`} 
                  className="w-full h-full object-cover"
                />
                {images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">+{images.length - 3}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {renderGalleryGrid()}
      
      {/* Modal for full-screen view */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            onClick={closeModal}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <div 
            className="max-w-4xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[activeIndex]} 
              alt={`Gallery ${activeIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                ></button>
              ))}
            </div>
          </div>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
