import React from 'react';
import './SectionPage.css';
import MainNav from '../components/MainNav';

const Recommendations = () => {
  return (
    <div className="page-shell">
      <MainNav />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Recommendations</h1>
            <p className="page-subtitle">Best actions for your plants and animals based on data.</p>
          </div>
        </div>

        <img
          className="page-hero-image"
          src="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/fig-4_0.jpg"
          alt="Crop rows in a field"
        />

        <div className="page-card">
          <div className="page-pill">Plant Recommendations</div>
          <div className="page-list">
            <div className="page-item">
              Rotate tomatoes with legumes to improve nitrogen.
              <img
                className="page-item-image"
                src="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/fig-4_0.jpg"
                alt="Crop rotation field"
              />
            </div>
            <div className="page-item">
              Mulch leafy beds to retain moisture.
              <img
                className="page-item-image"
                src="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/fig-4_0.jpg"
                alt="Mulched crop bed"
              />
            </div>
          </div>
        </div>

        <div className="page-card">
          <div className="page-pill">Animal Recommendations</div>
          <div className="page-list">
            <div className="page-item">
              Add mineral blocks for cattle herd.
              <img
                className="page-item-image"
                src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Cattle_In_The_Pasture_%28Unsplash%29.jpg"
                alt="Cattle nutrition support"
              />
            </div>
            <div className="page-item">
              Increase ventilation in poultry shed.
              <img
                className="page-item-image"
                src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Cattle_In_The_Pasture_%28Unsplash%29.jpg"
                alt="Poultry ventilation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
