import React, { useState, useEffect } from 'react';
import '../css/ImageSlider.css';

function ImageSlider() {
  const slides = [
    {
      image: 'https://www.worldbank.org/content/dam/photos/780x439/2021/apr-2/coffee-cherries.jpg',
      title: 'iPhone 16 Pro',
      subtitle: 'The ultimate professional camera system',
      description: 'Experience revolutionary computational photography'
    },
    {
      image: 'https://african.land/oc-content/plugins/blog/img/blog/607.jpg',
      title: 'MacBook Pro',
      subtitle: 'Supercharged for pros',
      description: 'Next-level performance with M3 Pro and M3 Max chips'
    },
    {
      image: 'https://socaa.or.ke/wp-content/uploads/2013/08/dummy3.jpg',
      title: 'Wireless Earbuds',
      subtitle: 'Premium sound quality',
      description: 'Noise cancellation with crystal clear audio'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 500);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="slider-container">
      <div 
        className="slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.image} alt={`Slide ${index + 1}`} />
            <div className={`slide-overlay ${fade ? 'fade-in' : 'fade-out'}`}>
              <div className="slide-content">
                <h3 className="slide-subtitle">{slide.subtitle}</h3>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
                <button className="shop-now-btn">
                  Shop Now <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="slider-btn prev" onClick={goToPrevious}>
        <svg viewBox="0 0 24 24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
        </svg>
      </button>
      <button className="slider-btn next" onClick={goToNext}>
        <svg viewBox="0 0 24 24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </button>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider; 