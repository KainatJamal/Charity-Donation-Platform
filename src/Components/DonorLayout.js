import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import logo from '../Images/AIDCIRCLE-removebg-preview.png';
import '../Styles/styles.css';

const DonorLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  // Handle Logout
  const handleLogout = () => {
    // Clear user authentication data (e.g., remove token from localStorage)
    localStorage.removeItem('authToken'); // Modify this based on your actual storage method

    // Redirect to homepage after logout
    navigate('/'); // Redirects to the home page
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="navbar">
        <div className="logo">
          <Link to="/donor-home">
            <img src={logo} alt="Aid Circle Logo" />
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/donation-trends">Donation Trends</Link>
          <Link to="/campaigndonor">Campaigns</Link>
          <Link to="/charities">Donate to Charities</Link>
          <Link to="/track-donations">Track Donations</Link>
          <Link to="/contactdonor">Contact</Link>

          {/* My Account Dropdown */}
          <div
            className="account-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/donoraccount" className="my-account-link">My Account</Link>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {/* Log Out button triggers the handleLogout function */}
                <button onClick={handleLogout}>Log Out</button>
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
              <li><Link to="/charities">Donate to Charities</Link></li>
              <li><Link to="/track-donations">Track Donations</Link></li>
              <li><Link to="/donation-trends">Donation Trends</Link></li>
              <li><Link to="/impact">Impact</Link></li>
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

export default DonorLayout;
