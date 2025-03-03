import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/AIDCIRCLE-removebg-preview.png';
import '../Styles/styles.css';

const Layout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);  // To track scroll state

  // Handle mouse enter and leave for dropdown
  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  // Handle scroll effect
  const handleScroll = () => {
    if (window.scrollY > 50) { // You can adjust the scroll threshold here
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="layout">
      {/* Header */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Aid Circle Logo" />
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/campaign">Campaigns</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>

          {/* My Account Dropdown */}
          <div
            className="account-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link>My Account</Link>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/login">Log In</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Join us today and be part of a global community that is working together to make a positive difference...</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section quick-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/campaign">Campaigns</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section social-icons">
            <h4>Social Media</h4>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/aidcircle3/" // Updated Instagram link
                  target="_blank" // Opens in a new tab
                  rel="noopener noreferrer" // Provides extra security when opening in a new tab
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Logo above footer border */}
        <div className="footer-logo">
          <Link to="/">
            <img src={logo} alt="Aid Circle Logo" />
          </Link>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2024 Aid Circle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
