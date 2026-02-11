import React from 'react';
import './SectionPage.css';
import MainNav from '../components/MainNav';

const History = () => {
  return (
    <div className="page-shell">
      <MainNav />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Chat History</h1>
            <p className="page-subtitle">Your conversations with Flora AI.</p>
          </div>
        </div>

        <div className="page-card">
          <div className="page-list">
            <div className="page-item">"Best crops for high temperatures?" — 2 days ago</div>
            <div className="page-item">"Low rainfall options" — 1 week ago</div>
            <div className="page-item">"Soil pH for maize" — 2 weeks ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
