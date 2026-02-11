import React from 'react';
import './SectionPage.css';
import MainNav from '../components/MainNav';

const AnimalWellBeing = () => {
  return (
    <div className="page-shell">
      <MainNav />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Farm Animals Well Being</h1>
            <p className="page-subtitle">Health status, risks, and recommended measures.</p>
          </div>
        </div>
        <div className="page-card">
          <div className="page-pill">Latest Scans</div>
          <div className="page-list">
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/GoatEatingWeeds.jpg"
                alt="Farm animal in pasture"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Goat health">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Animal</div>
                  <div className="page-item-cell" role="cell">Goat #5</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Status</div>
                  <div className="page-item-cell" role="cell">Normal</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Vitals</div>
                  <div className="page-item-cell" role="cell">Active, normal appetite</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Continue standard feed and water checks.</div>
                </div>
              </div>
            </div>
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Sheep_in_pasture_-_geograph.org.uk_-_6406331.jpg"
                alt="Sheep health check"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Sheep health">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Animal</div>
                  <div className="page-item-cell" role="cell">Sheep #3</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Risk</div>
                  <div className="page-item-cell" role="cell">Parasite risk detected</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Indicator</div>
                  <div className="page-item-cell" role="cell">Low body condition, pale eyelids</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Schedule deworming and recheck in 7 days.</div>
                </div>
              </div>
            </div>
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Hen.jpg"
                alt="Poultry house overview"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Poultry health">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Group</div>
                  <div className="page-item-cell" role="cell">Poultry batch A</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Status</div>
                  <div className="page-item-cell" role="cell">Heat stress signs</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Indicator</div>
                  <div className="page-item-cell" role="cell">Panting, reduced activity</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Provide shade, airflow, and electrolytes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-card">
          <div className="page-pill">Recommended Actions</div>
          <div className="page-list">
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Sheep_in_pasture_-_geograph.org.uk_-_6406331.jpg"
                alt="Animal care routine"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Sheep action plan">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Priority</div>
                  <div className="page-item-cell" role="cell">High</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Target</div>
                  <div className="page-item-cell" role="cell">Sheep #3</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Schedule deworming and isolate if symptoms worsen.</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Follow-up</div>
                  <div className="page-item-cell" role="cell">Recheck in 7 days.</div>
                </div>
              </div>
            </div>
            <div className="page-item">
              <img
                className="page-item-image"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Hen.jpg"
                alt="Poultry care measures"
              />
              <div className="page-item-details page-item-table" role="table" aria-label="Poultry action plan">
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Priority</div>
                  <div className="page-item-cell" role="cell">Medium</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Target</div>
                  <div className="page-item-cell" role="cell">Poultry batch A</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Action</div>
                  <div className="page-item-cell" role="cell">Provide shade and electrolytes; increase airflow.</div>
                </div>
                <div className="page-item-row" role="row">
                  <div className="page-item-cell page-item-label" role="cell">Follow-up</div>
                  <div className="page-item-cell" role="cell">Monitor temperature twice daily.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalWellBeing;
