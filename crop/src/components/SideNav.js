// SideNav.jsx
import React, { useState } from 'react';
import './SideNav.css';

const SideNav = () => {
  const [activeItem, setActiveItem] = useState('New chat');
  const [isOpen, setIsOpen] = useState(true);

  const topNavItems = [
    { id: 1, name: 'New chat' },   
    { id: 2, name: 'App Info' },
    { id: 3, name: 'Images Scans and Snapshots' }, 
    { id: 4, name: 'Community' },
    { id: 5, name: 'Settings' },
  ];

  const yourChatsItems = [
    'Your Previous enquiries'
  ];

  if (!isOpen) return null;

  return (
    <div className="side-nav">

      {/* Profile Section */}
      <div className="profile-section">
        <img
          src="/profile.jpg"   // replace with real image path
          alt="Profile"
          className="profile-img"
        />
        <div className="profile-info">
          <span className="profile-name">Perez Kazungu</span>
          <span className="profile-role">Account</span>
        </div>
      </div>

      {/* Logo */}
      <div className="app-logo">
        AGRO <span>HEALTH</span>
      </div>

      {/* Top Navigation */}
      <div className="nav-section">
        {topNavItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => setActiveItem(item.name)}
          >
            <span className="nav-text">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="nav-divider"></div>

      {/* Chat History */}
      <div className="nav-section">
        <div className="section-title">Your Chat History</div>
        {yourChatsItems.map((chat, index) => (
          <div
            key={index}
            className={`nav-item chat-item ${activeItem === chat ? 'active' : ''}`}
            onClick={() => setActiveItem(chat)}
          >
            <span className="nav-text">{chat}</span>
          </div>
        ))}
      </div>


    </div>
  );
};

export default SideNav;
