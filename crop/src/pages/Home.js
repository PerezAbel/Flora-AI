import React from 'react';
import { FaLeaf } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-nav">
        <div className="brand-pill">
          <span className="brand-icon" aria-hidden="true">
            <FaLeaf />
          </span>
          <span className="brand-name">Flora AI</span>
        </div>
        <nav className="nav-links" aria-label="Primary">
          <button type="button" className="nav-link active">Home</button>
          <button type="button" className="nav-link">Why Choose me</button>
          <button type="button" className="nav-link">My Features</button>
        </nav>
        <div className="auth-actions">
          <a href="/login" className="nav-cta">Log In</a>
          <a href="/signup" className="nav-cta nav-cta-primary">Sign Up</a>
        </div>
      </header>

      <main className="hero">
        <div className="rating">
          <span className="stars" aria-hidden="true">*****</span>
          <span className="rating-text">(550 users given us love)</span>
        </div>
        <h1 className="hero-title">
          Your Smart and Reliable AI Farm Assistant 

        </h1>
        <p className="hero-subtitle">
          Say goodbye to manual tasks and hello to AI-driven automation. Our intelligent
          AI agent helps you streamline workflows, answer queries instantly.
        </p>
      </main>   





      <section className="showcase" aria-label="Product preview">
        <div className="showcase-glow left" aria-hidden="true"></div>
        <div className="showcase-glow right" aria-hidden="true"></div>

        <div className="chat-card left">
     
          <div className="chat-pill">Are your animals getting sick of late ?</div>
          <div className="chat-pill">Need the best conditions for growing your fruits?</div>
        </div>

        <div className="center-orb" aria-hidden="true">
          <div className="orb-inner">
            <span className="orb-icon">
              <FaLeaf aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="chat-card right">
          <p className="chat-text"> 
            From Guidance to agricultural produce to identifying animal sickeness my sole purtpose of existence is to assist  you as my master to accomplish the best agrocultural results yu posisbily can 
           
          </p>
          <div className="profile-mini">
            <div className="profile-dot">gr8r</div>
            <div className="profile-meta">
              <div className="chat-title">From Perez's ChoCode Studio</div>
              <div className="chat-subtitle">A SaaS and AI Expert</div>
            </div>
          </div>
        </div>
      </section>

      <section className="why why-reverse" aria-label="Why choose Flora AI">
        <div className="why-content">
          <h2 className="why-title">Why choose Flora AI</h2>
          <p className="why-text">
            Flora AI is built for farmers first. It blends real agronomy insight with live
            field signals to deliver practical, crop-specific guidance you can trust faster
            than generic AI agents.
          </p>
        </div>
        <div className="why-media" role="img" aria-label="Farm field preview"></div>
      </section>

      <section className="features" aria-label="Flora AI features">
        <div className="features-circle">
          <div className="feature-card feature-pos-1">
            <div className="feature-icon" aria-hidden="true">◎</div>
            <h3 className="feature-title">Smart insights</h3>
            <p className="feature-text">
              Clear recommendations from soil and climate data.
            </p>
          </div>
          <div className="feature-card feature-pos-2">
            <div className="feature-icon" aria-hidden="true">☁</div>
            <h3 className="feature-title">Live conditions</h3>
            <p className="feature-text">
              Track weather shifts and act with confidence.
            </p>
          </div>
          <div className="feature-card feature-pos-3">
            <div className="feature-icon" aria-hidden="true">◌</div>
            <h3 className="feature-title">Precision guidance</h3>
            <p className="feature-text">
              Optimize crop selection with fast AI analysis.
            </p>
          </div>
          <div className="feature-card feature-pos-4">
            <div className="feature-icon" aria-hidden="true">✦</div>
            <h3 className="feature-title">Actionable alerts</h3>
            <p className="feature-text">
              Spot risks early with timely AI prompts.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer" aria-label="Footer">
        <div className="footer-top">
          <h2 className="footer-title">Get to know me better</h2>
          <nav className="footer-links" aria-label="Footer links">
            <button type="button" className="footer-link">Terms & Conditions</button>
            <button type="button" className="footer-link">Privacy</button>
            <button type="button" className="footer-link">ChocoCode Studios</button>
          </nav>
        </div>
        <div className="footer-bottom">Copyright Flora AI 2025</div>
      </footer>
    </div>
  );
};

export default Home;
