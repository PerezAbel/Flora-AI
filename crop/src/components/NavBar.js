import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faHome,
  faStore,
  faRobot,
  faChevronDown,
  faStar,
  faSignInAlt,
  faUserPlus,
  faTruck,
  faLeaf,
  faSeedling,
  faTractor,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import '../css/NavBar.css';

const productCategories = [
  'Common Crops',
  'Indigenous Crops',
  'Fruits & Nuts',
  'Organic Produce',
  'Farming Equipment',
  'Seeds & Seedlings',
  'Fertilizers',
  'Irrigation Systems',
  'Greenhouse Supplies',
  'Harvesting Tools',
  'Pest Control',
  'Soil Testing Kits',
  'Agricultural Books',
  'Farm Management Software'
];

function NavBar() {
  const [showProducts, setShowProducts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="nav-container">
      <div className="nav-left">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3079/3079165.png" 
          alt="AgriNova Logo" 
          className="nav-logo-img" 
        />
        <Link to="/ai" className="nav-logo">AgriNova</Link>
      </div>

      <div className="nav-center">
        <Link to="/home" className="nav-link">
          <FontAwesomeIcon icon={faHome} /> {!isMobile && 'Home'}
        </Link>   

        <div
          className="nav-link"
          onMouseEnter={() => !isMobile && setShowProducts(true)}
          onMouseLeave={() => !isMobile && setShowProducts(false)}
          onClick={() => isMobile && setShowProducts(!showProducts)}
        >
          <FontAwesomeIcon icon={faSeedling} />
          {!isMobile && 'Products'}
          <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.8rem', marginLeft: '5px' }} />
          
          {showProducts && (
            <div className="products-dropdown">
              {productCategories.map((category, index) => (
                <Link 
                  key={index} 
                  to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="dropdown-item"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </div> 
        
        <Link to="/market" className="nav-link">
          <FontAwesomeIcon icon={faChartLine} /> {!isMobile && 'Market Data'}
        </Link>
        
        <Link to="/ai" className="nav-link">
          <FontAwesomeIcon icon={faTractor} /> {!isMobile && 'Farm Assistant'}
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/cart" className="nav-icon-button">
          <FontAwesomeIcon icon={faShoppingCart} />
        </Link>
      
         <div 
          className="nav-icon-button profile-dropdown-trigger"
          onClick={() => setShowProfile(!showProfile)}
        > 
           <FontAwesomeIcon icon={faUser} />
          {showProfile && (
            <div className="profile-dropdown">
              <Link to="/login" className="dropdown-item">
                <FontAwesomeIcon icon={faSignInAlt} /> Log Out
              </Link>
              <Link to="/register" className="dropdown-item">
                <FontAwesomeIcon icon={faUserPlus} /> Join Us
              </Link> 
               <Link to="/wishlist" className="dropdown-item">
                <FontAwesomeIcon icon={faStar} /> Wish List
              </Link>
              <Link to="/orders" className="dropdown-item">
                <FontAwesomeIcon icon={faTruck} /> Deliveries
              </Link> 
            </div>
          )}
         </div>
      </div>
    </nav>
  );
}

export default NavBar;