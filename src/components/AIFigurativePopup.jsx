import React, { useState, useEffect, useRef } from 'react';

function AIFigurativePopup({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const mediaContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const introText = `This is a figurative exploration of chair design workflow combining GenAI in 2D and 3D with robotic tool pathing algorithm. Operating with 6mm nozzle, the robotic arm transforms the literality of AI generated output to abstracted part figure in physical form.`;

  const mediaItems = [
    {
      type: 'image',
      src: '/AIFigurative/1.png',
      alt: 'AI Generated Figure 1',
    },
    {
      type: 'video',
      src: '/AIFigurative/2.mp4',
      alt: 'Robotic printing process',
    },
    {
      type: 'video',
      src: '/AIFigurative/3.mp4', 
      alt: 'Advanced printing technique',
    },
    {
      type: 'image',
      src: '/AIFigurative/4.png',
      alt: 'Final printed piece',
    },
    {
      type: 'image', 
      src: '/AIFigurative/5.png',
      alt: 'AI Generated Figure 5',
    }
  ];

  // Reset loading state when current index changes
  useEffect(() => {
    setMediaLoaded(false);
  }, [currentIndex]);

  const handleMediaLoad = () => {
    setMediaLoaded(true);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle click on left/right sides of image
  const handleImageClick = (e) => {
    const rect = mediaContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    if (clickX < containerWidth / 2) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Touch event handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left, go to next
      } else {
        prevSlide(); // Swipe right, go to previous
      }
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="aifigurative-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>AI Figurative</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="intro-text">
            <p>{introText}</p>
          </div>

          <div className="carousel-container">
            <div className="carousel-content">
              <div 
                className="media-display"
                ref={mediaContainerRef}
                onClick={handleImageClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Loading placeholder */}
                <div className={`media-placeholder ${mediaLoaded ? 'hidden' : ''}`}></div>
                
                {/* Media content */}
                {mediaItems[currentIndex].type === 'image' ? (
                  <img 
                    src={mediaItems[currentIndex].src} 
                    alt={mediaItems[currentIndex].alt}
                    className={`carousel-media ${mediaLoaded ? 'loaded' : ''}`}
                    onLoad={handleMediaLoad}
                    onError={handleMediaLoad}
                  />
                ) : (
                  <video 
                    src={mediaItems[currentIndex].src}
                    className={`carousel-media ${mediaLoaded ? 'loaded' : ''}`}
                    controls
                    muted
                    preload="metadata"
                    onLoadedData={handleMediaLoad}
                    onError={handleMediaLoad}
                  />
                )}
              </div>
              
              <div className="carousel-indicators">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="collaborators-section">
            <p><strong>Collaborators:</strong> Jeffry Acra, Shih-Yun Tseng, Yuxi Zhang</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIFigurativePopup; 