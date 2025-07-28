import React, { useState, useEffect } from 'react';
import '../css/NewsLetter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    'https://www.reuters.com/resizer/v2/BTMAPI2PDRK5HKOIM4OI44VDUI.jpg?auth=5ea8aca2f9447374c44742ec844142ed3ddff55ee4bba45d023a8748dbfeb3a9',
    'https://eos.com/wp-content/uploads/2024/12/growing-cassava-main.jpg.webp',
    'https://extension.psu.edu/media/catalog/product/i/m/image_1676.jpg?quality=80&bg-color=248,248,248&fit=bounds&height=427&width=640&canvas=640:427',

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const response = await fakeAuthService(email);
      if (response.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const fakeAuthService = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: email.includes('@') });
      }, 1000);
    });
  };

  return (
    <div className="newsletter-background">
      <div className="newsletter-container">
        <div className="newsletter-carousel">
          <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Agricultural scene ${index}`} />
            ))}
          </div>
        </div>

        <div className="newsletter-content">
          <h2>Join the AgriNova Community</h2>
          <p>Subscribe to our newsletter and stay updated with:</p>
          {/* <ul className="benefits-list">
            <li>🌱 Latest farming techniques and innovations</li>
            <li>📈 Market trends and crop pricing updates</li>
            <li>🌾 Seasonal planting guides and expert advice</li>
            <li>💡 Smart farming technology and sustainable practices</li>
            <li>🎁 Exclusive offers for our subscribers</li>
          </ul> */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Subscribe Now'}
            </button>
          </form>
          {success === true && (
            <p className="success">🎉 Thank you for joining AgriNova! Check your email for confirmation.</p>
          )}
          {success === false && (
            <p className="error">❌ Please enter a valid email address.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;