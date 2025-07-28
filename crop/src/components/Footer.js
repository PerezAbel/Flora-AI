import React from 'react';
import '../css/Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const galleryImages = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1535350356005-fd52b3b524fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://extension.psu.edu/media/catalog/product/i/m/image_1676.jpg?quality=80&bg-color=248,248,248&fit=bounds&height=427&width=640&canvas=640:427',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwJGxMaqloZ6gyhYHmcuRFbVjJTmBwf56k_Q&s'
  ];

  return (
    <footer className="footer">
      {/* Logo at the top */}
      <div className="footer__top-logo">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3079/3079165.png" 
          alt="AgriNova Logo" 
          className="footer__main-logo"
        />
        <h2 className="footer__main-title">AgriNova</h2>
      </div>

      <div className="footer__content">
        <div className="footer__logo-section">
          <p className="footer__tagline">Growing the future of agriculture</p>
          
          {/* Image Gallery */}
          <div className="footer__gallery">
            <h4>Our Farm Gallery</h4>
            <div className="footer__gallery-grid">
              {galleryImages.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Farm scene ${index}`} 
                  className="footer__gallery-image"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer__section">
          <h4>About AgriNova</h4>
          <ul>
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Farmers Network</a></li>
            <li><a href="#">Sustainability</a></li>   
            <li><a href="#">Success Stories</a></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h4>Our Services</h4>
          <ul>
            <li><a href="#">Crop Marketplace</a></li>
            <li><a href="#">Farming Resources</a></li>
            <li><a href="#">Agricultural Training</a></li>
            <li><a href="#">Equipment Rental</a></li>
            <li><a href="#">Soil Testing</a></li> 
            <li><a href="#">Weather Alerts</a></li>  
          </ul>
        </div>
        
        <div className="footer__section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Farmers Support</a></li>
            <li><a href="#">Shipping & Delivery</a></li> 
            <li><a href="#">Contact Support</a></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h4>Contact Us</h4>
          <div className="footer__contact-info">
            <div className="footer__contact-item">
              <FaMapMarkerAlt className="footer__contact-icon" />
              <span>123 Farm Road<br />Nairobi, Kenya</span>
            </div>
            <div className="footer__contact-item">
              <FaPhoneAlt className="footer__contact-icon" />
              <span>+254 700 123 456</span>
            </div>
            <div className="footer__contact-item">
              <FaEnvelope className="footer__contact-icon" />
              <span>info@agrinova.com</span>
            </div>
          </div>
          
          <div className="footer__social">
            <h4>Follow Us</h4>
            <div className="footer__social-icons">
              <a href="#" className="footer__social-icon"><FaFacebookF /></a>
              <a href="#" className="footer__social-icon"><FaTwitter /></a>
              <a href="#" className="footer__social-icon"><FaInstagram /></a>
              <a href="#" className="footer__social-icon"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer__copyright">
        © 2025 Copyright AgriNova | Growing the Future of Agriculture
      </div>
    </footer>
  );
};

export default Footer;