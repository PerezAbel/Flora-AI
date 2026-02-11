import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/main');
  };

  return (
    <div className="auth-page">
      <header className="home-nav">
        <div className="brand-pill">
          <span className="brand-icon" aria-hidden="true">
            <FaLeaf />
          </span>
          <span className="brand-name">Flora AI</span>
        </div>
        <nav className="nav-links" aria-label="Primary">
          <Link className="nav-link" to="/">Home</Link>
          <button type="button" className="nav-link">Why Choose me</button>
          <button type="button" className="nav-link">My Features</button>
        </nav>
        <div className="auth-actions">
          <Link to="/login" className="nav-cta">Log In</Link>
          <Link to="/signup" className="nav-cta nav-cta-primary">Sign Up</Link>
        </div>
      </header>
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start using Flora AI for smarter farm decisions.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Full name
            <input type="text" placeholder="Your name" className="auth-input" />
          </label>
          <label className="auth-label">
            Email
            <input type="email" placeholder="you@example.com" className="auth-input" />
          </label>
          <label className="auth-label">
            Password
            <input type="password" placeholder="Create a password" className="auth-input" />
          </label>
          <button type="submit" className="auth-submit">Sign Up</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
        <Link to="/" className="auth-back">Back to Home</Link>
      </div>
    </div>
  );
};

export default Signup;
