import React from 'react';
import { Home, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = ({ setActiveTab }) => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-section">
          <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <Home className="logo-icon" size={24} />
            <span>HouseHunt</span>
          </div>
          <p className="footer-desc">
            Transforming the rental industry through transparent listings, direct landlord contact, and smooth verification workflows. Find your home today.
          </p>
        </div>

        <div className="footer-section">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Search Houses</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Featured Villas</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Downtown Condos</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support & Legal</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>FAQ & Guide</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact & Socials</h4>
          <ul className="footer-links" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Mail size={14} style={{ color: 'var(--primary)' }} />
              support@househunt.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Phone size={14} style={{ color: 'var(--primary)' }} />
              +1 (555) 019-2834
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin size={14} style={{ color: 'var(--primary)' }} />
              45 Financial District, NY
            </li>
          </ul>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }} className="social-icon">
              <Twitter size={18} />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }} className="social-icon">
              <Linkedin size={18} />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }} className="social-icon">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} HouseHunt Inc. All rights reserved.</span>
        <span>Made with ❤️ for premium real estate.</span>
      </div>
    </footer>
  );
};

export default Footer;
