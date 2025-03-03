import React, { useState } from 'react';
import '../Styles/styles.css'; // Ensure you have appropriate styles in your CSS file
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'; // Importing icons
import backgroundImage from '../Images/ben-white-PAiVzSmYy-c-unsplash.jpg'; // Adjust path as needed
import logoImage from '../Images/AIDCIRCLE-removebg-preview.png'; // Adjust path for your logo
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
  
        // Save user data in localStorage
        const userData = data.user; // Assuming your response contains the user data
        localStorage.setItem('user', JSON.stringify(userData)); // Save user info including donorId
  
        // Optionally, if you want to directly access donorId:
        const donorId = userData.id; // Adjust according to your response structure
        localStorage.setItem('donorId', donorId); // Store donorId separately if needed
  
        // Navigate based on user type
        if (userData.userType === 'admin') {
          navigate('/admin-home'); // Admin dashboard page
        } else if (userData.userType === 'donor') {
          navigate('/donor-home'); // Donor dashboard page
        } else {
          setError('Invalid user type. Please contact support.');
        }
      } else {
        setError(data.error || 'An error occurred during login.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again.');
    }
  };
  

  const navigateToSignup = () => {
    navigate('/signup'); // Navigate to signup page when the link is clicked
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="login-content">
        <img src={logoImage} alt="Aid Circle Logo" className="login-logo" />

        <div className="content-wrapper">
          <h1 className="login-heading">Login</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>
                <FaEnvelope className="input-icon" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock className="input-icon" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>} {/* Display error if any */}

            <button type="submit" className="login-submit">
              <FaSignInAlt className="submit-icon" /> Login
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={navigateToSignup}>
                Sign up first
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
