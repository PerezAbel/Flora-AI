import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FaComments,
  FaLeaf,
  FaSeedling,
  FaSlidersH,
  FaHistory,
  FaUser,
  FaBell,
  FaPalette,
  FaGlobe,
  FaLock,
  FaQuestionCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import './MainNav.css';

const MainNav = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="main-nav">
      <div className="main-nav-inner">
        <nav className="main-links" aria-label="Primary">
          <NavLink to="/main" className="main-link">
            <FaLeaf className="main-link-icon" />
            Home
          </NavLink>
          <NavLink to="/current-updates" className="main-link">
            <FaComments className="main-link-icon" />
            Current Updates
          </NavLink>
          <NavLink to="/animal-well-being" className="main-link">
            <FaLeaf className="main-link-icon" />
            Animal Well Being
          </NavLink>
          <NavLink to="/history" className="main-link">
            <FaHistory className="main-link-icon" />
            History
          </NavLink>
          <div className="settings-link">
            <button
              type="button"
              className="settings-toggle"
              aria-haspopup="true"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((prev) => !prev)}
            >
              <FaSlidersH className="main-link-icon" />
              Settings
            </button>
            {settingsOpen && (
              <div className="settings-menu" role="menu">
                <Link to="/settings" className="settings-item" role="menuitem">
                  <FaUser className="settings-icon" />
                  <span>Account</span>
                </Link>
                <button type="button" className="settings-item" role="menuitem">
                  <FaBell className="settings-icon" />
                  <span>Notifications</span>
                </button>
                <button type="button" className="settings-item" role="menuitem">
                  <FaPalette className="settings-icon" />
                  <span>Appearance</span>
                </button>
                <button type="button" className="settings-item" role="menuitem">
                  <FaGlobe className="settings-icon" />
                  <span>Language</span>
                </button>
                <Link to="/settings" className="settings-item" role="menuitem">
                  <FaLock className="settings-icon" />
                  <span>Privacy & Security</span>
                </Link>
                <button type="button" className="settings-item" role="menuitem">
                  <FaQuestionCircle className="settings-icon" />
                  <span>Help & Support</span>
                </button>
                <button type="button" className="settings-item" role="menuitem">
                  <FaSignOutAlt className="settings-icon" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MainNav;
