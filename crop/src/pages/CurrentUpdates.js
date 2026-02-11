import React from 'react';
import './SectionPage.css';
import MainNav from '../components/MainNav';

const CurrentUpdates = () => {
  return (
    <div className="page-shell">
      <MainNav />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Current Updates</h1>
            <p className="page-subtitle">Live soil, animal, and plant conditions with next steps.</p>
          </div>
        </div>
        <div className="page-card">
          <div className="page-pill">Scan 3</div>
          <div className="page-list">
            <div className="page-item"> 
                <img
                className="page-item-image"
                src="https://dlab.epfl.ch/wikispeedia/wpcd/images/163/16374.jpg"
                alt="Soil texture detail"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Soil analytics">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Soil type</div>
                  <div className="page-item-cell" role="cell">Loam (slightly acidic)</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Moisture</div>
                  <div className="page-item-cell" role="cell">42%</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">pH</div>
                  <div className="page-item-cell" role="cell">6.5</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Nitrogen</div>
                  <div className="page-item-cell" role="cell">Medium</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Best crops</div>
                  <div className="page-item-cell" role="cell">maize, rice, tomatoes, beans</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Apply light irrigation and add compost.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-card">
          <div className="page-pill">Scan 2</div>
          <div className="page-list">
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Cattle_In_The_Pasture_%28Unsplash%29.jpg"
                alt="Cattle in pasture"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Livestock wellness">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Animal</div>
                  <div className="page-item-cell" role="cell">Cattle #12</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Status</div>
                  <div className="page-item-cell" role="cell">Mild dehydration signs</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Vitals</div>
                  <div className="page-item-cell" role="cell">Low water intake, dry muzzle</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Increase clean water access and monitor 24h.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-card">
          <div className="page-pill">Scan 1</div>
          <div className="page-list">
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/fig-4_0.jpg"
                alt="Crop rows in a field"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Crop health">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Crop</div>
                  <div className="page-item-cell" role="cell">Tomato bed</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Risk</div>
                  <div className="page-item-cell" role="cell">Early blight detected</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Impact</div>
                  <div className="page-item-cell" role="cell">Lower leaf lesions developing</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Remove affected leaves, apply copper-based spray.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentUpdates;
