import React, { useState } from 'react';
import '../Styles/styles.css'; // Ensure you have appropriate styles in your CSS file
import backgroundImage from '../Images/ben-white-PAiVzSmYy-c-unsplash.jpg'; // Adjust path as needed
import logoImage from '../Images/AIDCIRCLE-removebg-preview.png'; // Adjust path for your logo
import { FaArrowRight } from 'react-icons/fa'; // Import Font Awesome icon
import { useNavigate } from 'react-router-dom'; // Updated to use useNavigate instead of useHistory
import axios from 'axios';  // Import axios

function Signup() {
  const [selectedRole, setSelectedRole] = useState(''); // Track selected role
  const [slideLeft, setSlideLeft] = useState(false); // Control slide animation
  const [showDonorForm, setShowDonorForm] = useState(false); // Control donor form visibility
  const [showAdminForm, setShowAdminForm] = useState(false); // Control admin form visibility
  const navigate = useNavigate(); // Use the useNavigate hook for redirection

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value); // Set the selected role
  };

  const handleSlideLeft = () => {
    if (selectedRole === 'donor') {
      setSlideLeft(true); // Trigger slide effect
      setTimeout(() => {
        setShowDonorForm(true); // Display donor form after animation
      }, 500); // Delay to match animation duration
    } else if (selectedRole === 'admin') {
      setSlideLeft(true); // Trigger slide effect
      setTimeout(() => {
        setShowAdminForm(true); // Display admin form after animation
      }, 500); // Delay to match animation duration
    } else {
      alert('Please select a role before proceeding!');
    }
  };

  // Donor Form Submission Handler
  const [donorFormData, setDonorFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    donationAmount: '',
    creditCardNumber: '',
    expiry: '',
    cvv: '',
    message: '',
    password: '', // Added password
    address: ''   // Added address
  });

  const handleDonorFormChange = (e) => {
    setDonorFormData({
      ...donorFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDonorFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Donor Form Submitted:', donorFormData);
  
    try {
      const response = await fetch('http://localhost:5000/submit-donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorFormData),
      });
  
      if (!response.ok) {
        throw new Error('An error occurred while submitting your form');
      }
  
      const data = await response.json();
      console.log('Success:', data.message);
  
      // Store user data in localStorage (after successful submission)
      const userData = data.donor; // Assuming your response contains the donor data
      localStorage.setItem('user', JSON.stringify(userData)); // Save user info including donorId and full name
  
      // Access donor_id and full_name directly from the response
      const donorId = userData.donor_id;  // Correctly use 'donor_id' from the response
      const donorFullName = userData.full_name; // Assuming your response contains the full name
      localStorage.setItem('donorId', donorId);  // Save donorId correctly
      localStorage.setItem('donorFullName', donorFullName); // Save the full name to localStorage
  
      // Navigate to the donor home page
      navigate('/donor-home');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting your form');
    }
  };
  
  
  
  
  // Admin Form Submission Handler
  const [adminFormData, setAdminFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'admin',
    uniqueCode: '', // Unique code field for admin
  });

  const handleAdminFormChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    if (adminFormData.uniqueCode === '2917') {
      try {
        const response = await fetch('http://localhost:5000/submit-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adminFormData),
        });
  
        if (!response.ok) {
          throw new Error('An error occurred while submitting your form');
        }
  
        const data = await response.json();
        console.log('Success:', data.message);
  
        // Store user data in localStorage (after successful submission)
        localStorage.setItem('user', JSON.stringify(data.admin)); // Store the correct admin data in localStorage
  
        // Navigate to the admin home page
        navigate('/admin-home');
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting your form');
      }
    } else {
      alert('Invalid Admin Code! Please enter the correct code.');
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="signup-content">
        <img src={logoImage} alt="Aid Circle Logo" className="signup-logo" />

        <div className={`content-wrapper ${slideLeft ? 'slide-left' : ''}`}>
          <h1 className="signup-heading">Join Us</h1>
          <p className="signup-subheading">Make a difference by choosing your role</p>

          {/* Description Section */}
          <div className="signup-description">
            <p>
              Welcome to Aid Circle! By signing up, you'll be joining a community committed to creating
              positive change. Whether you're here to donate or to manage initiatives, you're a crucial
              part of our mission.
            </p>
          </div>

          {/* Signup Form */}
          <form className="signup-form">
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="donor"
                  onChange={handleRoleChange}
                />
                <span className="role-label">Sign up as Donor</span>
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  onChange={handleRoleChange}
                />
                <span className="role-label">Sign up as Admin</span>
              </label>
            </div>
          </form>

          {/* Dynamic Content Based on Role */}
          {selectedRole && (
            <div className="role-description">
              {selectedRole === 'donor' ? (
                <p>
                  As a Donor, you'll support meaningful causes and help communities thrive.
                  Start your journey of making a difference today!
                </p>
              ) : (
                <p>
                  As an Admin, you'll manage donations and initiatives, ensuring the impact reaches
                  those who need it most.
                </p>
              )}
            </div>
          )}

          {/* Continue Button */}
          {!showDonorForm && !showAdminForm && (
            <div className="arrow-icon-container" onClick={handleSlideLeft}>
              <FaArrowRight className="arrow-icon" />
            </div>
          )}

          {/* Footer Section */}
          <div className="signup-footer">
            <p>
              Need help? <a href="/contact">Contact</a>
            </p>
          </div>
        </div>

        {/* Donor Form - Displayed Over Signup Content */}
        {showDonorForm && selectedRole === 'donor' && (
          <div className="donor-form-overlay">
            <div className="donor-form-content">
              <h2 className="donor-form-title">Charity Donation Form</h2>
              <form onSubmit={handleDonorFormSubmit} className="donor-form">
                {/* Donor form fields here */}
                <div className="form-group">
                  <label>
                    <i className="fas fa-user input-icon"></i> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={donorFormData.fullName}
                    onChange={handleDonorFormChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-phone input-icon"></i> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={donorFormData.phone}
                    onChange={handleDonorFormChange}
                    placeholder="+123 456 789"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope input-icon"></i> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={donorFormData.email}
                    onChange={handleDonorFormChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-lock input-icon"></i> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={donorFormData.password}
                    onChange={handleDonorFormChange}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-home input-icon"></i> Address
                  </label>
                  <textarea
                    name="address"
                    value={donorFormData.address}
                    onChange={handleDonorFormChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-credit-card input-icon"></i> Credit Card Information
                  </label>
                  <div className="credit-card-info">
                    <input
                      type="text"
                      name="creditCardNumber"
                      value={donorFormData.creditCardNumber}
                      onChange={handleDonorFormChange}
                      placeholder="Card Number"
                      required
                    />
                    <input
                      type="text"
                      name="expiry"
                      value={donorFormData.expiry}
                      onChange={handleDonorFormChange}
                      placeholder="MM/YY"
                      required
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={donorFormData.cvv}
                      onChange={handleDonorFormChange}
                      placeholder="CVV"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="donor-form-submit">
                  <i className="fas fa-donate submit-icon"></i> Donate Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Admin Form - Displayed Over Signup Content */}
        {showAdminForm && selectedRole === 'admin' && (
          <div className="admin-form-overlay">
            <div className="admin-form-content">
              <h2 className="admin-form-title">Admin Sign-Up Form</h2>
              <form onSubmit={handleAdminFormSubmit} className="admin-form">
                <div className="form-group">
                  <label>
                    <i className="fas fa-user input-icon"></i> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={adminFormData.fullName}
                    onChange={handleAdminFormChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-phone input-icon"></i> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={adminFormData.phone}
                    onChange={handleAdminFormChange}
                    placeholder="+123 456 789"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope input-icon"></i> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={adminFormData.email}
                    onChange={handleAdminFormChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
<div className="form-group">
  <label>
    <i className="fas fa-lock input-icon"></i> Password
  </label>
  <input
    type="password"
    name="password"
    value={adminFormData.password}
    onChange={handleAdminFormChange}
    placeholder="Enter password"
    required
  />
</div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-key input-icon"></i> Unique Admin Code
                  </label>
                  <input
                    type="text"
                    name="uniqueCode"
                    value={adminFormData.uniqueCode}
                    onChange={handleAdminFormChange}
                    placeholder="Enter unique admin code"
                    required
                  />
                </div>

                <button type="submit" className="admin-form-submit">
                  <i className="fas fa-user-shield submit-icon"></i> Register as Admin
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;