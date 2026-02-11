import React from 'react';
import './SectionPage.css';
import MainNav from '../components/MainNav';

const Settings = () => {
  return (
    <div className="page-shell">
      <MainNav />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage the essentials for your Flora AI experience.</p>
          </div>
        </div>

        <div className="page-card">
          <div className="page-pill">Preferences</div>
          <div className="page-list">
            <div className="page-item">Notifications: Enabled</div>
            <div className="page-item">Language: English</div>
            <div className="page-item">Units: Metric</div>
          </div>
          <div className="page-actions">
            <button className="page-btn" type="button">Update settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
