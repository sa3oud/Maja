import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = 7;
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    // Simulate image preloading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.to(containerRef.current, {
        rotationY: -currentIndex * (360 / totalImages),
        duration: 1,
        ease: "power2.inOut"
      });
    }
  }, [currentIndex, loading]);

  const handleMouseMove = (e) => {
    if (galleryRef.current) {
      const rect = galleryRef.current.getBoundingClientRect();
      const xAxis = (rect.width / 2 - (e.clientX - rect.left)) / 25;
      const yAxis = (rect.height / 2 - (e.clientY - rect.top)) / 25;
      
      gsap.to(galleryRef.current, {
        rotationX: yAxis,
        rotationY: xAxis,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const navigate = (direction) => {
    setCurrentIndex((prev) => (prev + direction + totalImages) % totalImages);
  };

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
        background: '#D4B5B0'
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
        ref={galleryRef}
        style={{
          width: '100%',
          height: '100%',
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d'
          }}
        >
          {[...Array(totalImages)].map((_, index) => (
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
                transform: `rotateY(${index * (360 / totalImages)}deg) translateZ(500px)`,
                zIndex: totalImages - Math.abs(currentIndex - index),
                opacity: 1 - (Math.abs(currentIndex - index) * 0.2)
              }}
            >
              <img
                src={`/api/placeholder/800/600`}
                alt={`Gallery Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  imageRendering: '-webkit-optimize-contrast',
                  pointerEvents: 'none',
                  WebkitUserDrag: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'transparent',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>

        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>
          <button
            onClick={() => navigate(1)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
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
