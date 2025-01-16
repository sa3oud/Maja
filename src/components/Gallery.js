import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import image1 from '../images/1.jpeg';
import image2 from '../images/2.jpeg';
import image3 from '../images/3.jpeg';
import image4 from '../images/4.jpeg';
import image5 from '../images/5.jpeg';
import image6 from '../images/6.jpeg';
import image7 from '../images/7.jpeg';

const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalImages = 7;
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  const images = [image1, image2, image3, image4, image5, image6, image7];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current && !isTransitioning) {
      setIsTransitioning(true);
      gsap.to(containerRef.current, {
        rotationY: currentIndex * -(360 / totalImages),
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => setIsTransitioning(false)
      });
    }
  }, [currentIndex, loading]);

  const handleMouseMove = (e) => {
    if (galleryRef.current && !isTransitioning) {
      const rect = galleryRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate rotation based on mouse position relative to center
      const xRotation = ((mouseY - centerY) / rect.height) * 15; // Reduced from 25 to 15 for subtler effect
      const yRotation = ((mouseX - centerX) / rect.width) * 15;
      
      gsap.to(galleryRef.current, {
        rotationX: -xRotation,
        rotationY: yRotation,
        duration: 0.5,
        ease: "power1.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (galleryRef.current) {
      gsap.to(galleryRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power1.out"
      });
    }
  };

  const navigate = (direction) => {
    if (!isTransitioning) {
      setCurrentIndex((prev) => (prev + direction + totalImages) % totalImages);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTransitioning]);

  return (
    <div
      className="gallery-container"
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c')) {
          e.preventDefault();
        }
      }}
      style={{ 
        width: '100%', 
        height: '100vh',
        background: '#D4B5B0',
        overflow: 'hidden'
      }}
    >
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #D4B5B0',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      <section 
        className="gallery-section"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={galleryRef}
        style={{
          width: '100%',
          height: '100%',
          perspective: '2000px',
          transformStyle: 'preserve-3d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${currentIndex * -(360 / totalImages)}deg)`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          {images.map((image, index) => {
            const rotation = index * (360 / totalImages);
            const zDistance = 800; // Increased from 500 for more pronounced 3D effect
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '60%',
                  height: '80%',
                  left: '20%',
                  top: '10%',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 25px 35px rgba(0,0,0,0.5)',
                  transform: `rotateY(${rotation}deg) translateZ(${zDistance}px)`,
                  transition: 'opacity 0.5s ease-out',
                  zIndex: totalImages - Math.abs((currentIndex - index + totalImages) % totalImages),
                  opacity: 1 - (Math.min(Math.abs(currentIndex - index), Math.abs(currentIndex - index - totalImages), Math.abs(currentIndex - index + totalImages)) * 0.2)
                }}
              >
                <img
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    imageRendering: '-webkit-optimize-contrast',
                    pointerEvents: 'none',
                    WebkitUserDrag: 'none',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 1000
        }}>
          <button
            onClick={() => navigate(-1)}
            disabled={isTransitioning}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              cursor: isTransitioning ? 'default' : 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
              transform: `scale(${isTransitioning ? 0.95 : 1})`,
              fontWeight: '500'
            }}
          >
            Previous
          </button>
          <button
            onClick={() => navigate(1)}
            disabled={isTransitioning}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              cursor: isTransitioning ? 'default' : 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
              transform: `scale(${isTransitioning ? 0.95 : 1})`,
              fontWeight: '500'
            }}
          >
            Next
          </button>
        </div>
      </section>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Gallery;
