import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/CropCards.css';

function CropCards() {
  // Refs for scroll containers
  const commonCropsRef = useRef(null);
  const indigenousCropsRef = useRef(null);
  const otherCropsRef = useRef(null);

  const scrollContainer = (ref, direction) => {
    const container = ref.current;
    const scrollAmount = 300;
    if (container) {
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Data for different crop categories with descriptions
  const commonCrops = [
    {
      "id": "1",
      "Title": "Maize", 
      "Cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMsEmRSyboh_6zXw0360HDXOpo4ckNlxySMw&s",
      "Price": "KSh 5,000/bag",
      "Description": "Staple food crop grown widely across Kenya. Requires moderate rainfall and well-drained soils."
    },
    {
      "id": "2",
      "Title": "Wheat",
      "Cover": "https://nutrimill.com/cdn/shop/articles/Exploring_the_Benefits_of_Hard_vs_Soft_Wheat.png?v=1683049455&width=1500",
      "Price": "KSh 6,500/bag",
      "Description": "Cool-season cereal crop used for flour production. Grown mainly in highland areas."
    },
    {
      "id": "3",
      "Title": "Rice",
      "Cover": "https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MjAyMDI0NTE3NzQzMTU4Nzkx/all-about-rice.jpg",
      "Price": "KSh 8,000/bag",
      "Description": "Grown in irrigation schemes. Requires flooded fields during growth period."
    },
    {
      "id": "4",
      "Title": "Beans",
      "Cover": "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/thumb/9/9e/A_green_bean.jpg/300px-A_green_bean.jpg",
      "Price": "KSh 12,000/bag",
      "Description": "Important protein source. Does well in most regions with moderate rainfall."
    },
    {
      "id": "5",
      "Title": "Potatoes",
      "Cover": "https://www.farmworx.co.ke/wp-content/uploads/2021/08/potaoe-featured.jpg",
      "Price": "KSh 3,000/kg",
      "Description": "Tuber crop grown in cool highland areas. Requires fertile, well-drained soils."
    }
  ];

  const indigenousCrops = [
    {
      "id": "6",
      "Title": "Amaranth", 
      "Cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHqwURvKbuyEY8iTd0i-HupIlryXe2vT8OSg&s",
      "Price": "KSh 200/bunch",
      "Description": "Highly nutritious leafy green. Drought-resistant and fast-growing."
    },
    {
      "id": "7",
      "Title": "Spider Plant",
      "Cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWSOa4muR_rKo9qJ36fjkFfP7fsrTT5L2tIw&s",
      "Price": "KSh 150/bunch",
      "Description": "Traditional vegetable rich in iron and vitamins. Thrives in various conditions."
    },
    {
      "id": "8",
      "Title": "Black Nightshade",
      "Cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEkyQMFCYHPapj410onMLwWS2rpecCId3iaA&s",
      "Price": "KSh 180/bunch",
      "Description": "Nutritious leafy vegetable with medicinal properties. Grows wild or cultivated."
    },
    {
      "id": "9",
      "Title": "Cowpeas",
      "Cover": "https://stickingupforlife.com/wp-content/uploads/2020/12/cowpeas-and-flower-zone-9b.jpg",
      "Price": "KSh 250/bunch",
      "Description": "Drought-tolerant legume. Leaves and pods are both edible and nutritious."
    },
    {
      "id": "10",
      "Title": "Pumpkin Leaves",
      "Cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1196WCvij9Ci8SZfxoeS8YpuxFvNqOvYzSA&s",
      "Price": "KSh 120/bunch",
      "Description": "Versatile vegetable rich in vitamins. Grows well with pumpkin vines."
    }
  ];

  const otherCrops = [
    {
      "id": "11",
      "Title": "Avocado", 
      "Cover": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Persea_americana_fruit_2.JPG",
      "Price": "KSh 50/piece",
      "Description": "Nutrient-dense fruit. Grows well in high and medium altitude areas."
    },
    {
      "id": "12",
      "Title": "Mango",
      "Cover": "https://www.greenlife.co.ke/wp-content/uploads/2022/04/Mangoes.jpg",
      "Price": "KSh 30/piece",
      "Description": "Tropical fruit tree. Does well in warm, frost-free regions."
    },
    {
      "id": "13",
      "Title": "Passion Fruit",
      "Cover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG0xZPV3A2pBnIuklPi22Mc0c7LGoysyPrBw&s",
      "Price": "KSh 100/kg",
      "Description": "Vine fruit with high market demand. Requires support structures."
    },
    {
      "id": "14",
      "Title": "Macadamia",
      "Cover": "https://gardenerspath.com/wp-content/uploads/2019/06/How-to-Grow-and-Care-for-a-Macadamia-Nut-Tree-Featured.jpg",
      "Price": "KSh 800/kg",
      "Description": "High-value nut crop. Grows well in high rainfall areas."
    },
    {
      "id": "15",
      "Title": "Coffee",
      "Cover": "https://www.aboutcoffee.org/wp-content/uploads/2024/10/ripe-coffee-cherries-on-branch-of-coffee-tree-1024x576.jpg",
      "Price": "KSh 1,200/kg",
      "Description": "Cash crop for export. Requires specific altitude and climate conditions."
    }
  ];

  return (   
    <div className='Crops'>
      {/* Common Crops Section */}
      <div className="crop-section">
        <h2 className="section-title">Common Crops</h2>
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scrollContainer(commonCropsRef, 'left')}
          >
            <FaChevronLeft />
          </button>
          <div className="Crops-grid horizontal-scroll" ref={commonCropsRef}>
            {commonCrops.map((item) => (
              <div className="Crops-item" key={item.id}>
                <div className="product-image-card">
                  <img src={item.Cover} alt={item.Title} />
                </div>
                <div className="Crops-info-section">
                  <h3 className="Crops-title">{item.Title}</h3>
                  <p className="Crops-description">{item.Description}</p>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="scroll-button right" 
            onClick={() => scrollContainer(commonCropsRef, 'right')}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Indigenous Crops Section */}
      <div className="crop-section">
        <h2 className="section-title">Indigenous Crops</h2>
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scrollContainer(indigenousCropsRef, 'left')}
          >
            <FaChevronLeft />
          </button>
          <div className="Crops-grid horizontal-scroll" ref={indigenousCropsRef}>
            {indigenousCrops.map((item) => (
              <div className="Crops-item" key={item.id}>
                <div className="product-image-card">
                  <img src={item.Cover} alt={item.Title} />
                </div>
                <div className="Crops-info-section">
                  <h3 className="Crops-title">{item.Title}</h3>
                  <p className="Crops-description">{item.Description}</p>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="scroll-button right" 
            onClick={() => scrollContainer(indigenousCropsRef, 'right')}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Other Crops Section */}
      <div className="crop-section">
        <h2 className="section-title">Fruits & Nuts</h2>
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scrollContainer(otherCropsRef, 'left')}
          >
            <FaChevronLeft />
          </button>
          <div className="Crops-grid horizontal-scroll" ref={otherCropsRef}>
            {otherCrops.map((item) => (
              <div className="Crops-item" key={item.id}>
                <div className="product-image-card">
                  <img src={item.Cover} alt={item.Title} />
                </div>
                <div className="Crops-info-section">
                  <h3 className="Crops-title">{item.Title}</h3>
                  <p className="Crops-description">{item.Description}</p>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="scroll-button right" 
            onClick={() => scrollContainer(otherCropsRef, 'right')}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CropCards;