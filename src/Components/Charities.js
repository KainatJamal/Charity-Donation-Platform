import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/styles.css'; // Ensure styles are applied
import { FaTrashAlt } from 'react-icons/fa';

const Charities = () => {
  const [projects, setProjects] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    country: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardholderName: '',
    agreeTerms: false,
    receiveReceipt: false,
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('donationProjects')) || [];
    setProjects(storedProjects);
  }, []);

  const removeFromCart = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
    localStorage.setItem('donationProjects', JSON.stringify(updatedProjects));
  };

  const handleCampaignDonationAmountChange = (index, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index].donationAmount = value;
    setProjects(updatedProjects);
    localStorage.setItem('donationProjects', JSON.stringify(updatedProjects));
  };

  const calculateTotal = () => {
    return projects.reduce((total, project) => total + parseFloat(project.donationAmount || 0), 0).toFixed(2);
  };

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleSubmitDonation = async () => {
    setPaymentProcessing(true);

    const donorId = localStorage.getItem('donorId');

    if (!donorId) {
        console.error('Donor ID is not found.');
        alert('Please log in before making a donation.');
        setPaymentProcessing(false);
        return;
    }

    const donorEmail = billingInfo.email;
    const totalDonationAmount = calculateTotal();

    const donationDetails = projects.map((project) => ({
        title: project.title,
        country: project.country,
        description: project.donationDescription,
        amount: project.donationAmount,
    }));

    try {
        // Send donation confirmation email
        const response = await fetch('http://localhost:5001/send-donation-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                donorEmail,
                donationAmount: totalDonationAmount,
                donationDetails,
            }),
        });

        const emailData = await response.json();
        if (response.ok) {
            console.log('Email sent successfully:', emailData.message);
        } else {
            console.error('Error sending email:', emailData.message);
        }

        // Send donation details to backend
        const donationResponse = await fetch('http://localhost:5000/submit-donation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                donorId,
                donationAmount: totalDonationAmount,
                donationDetails,
            }),
        });

        const donationData = await donationResponse.json();
        if (donationResponse.ok) {
            console.log('Donation recorded successfully:', donationData.message);
        } else {
            const responseText = await donationResponse.text();
            console.error('Error recording donation:', responseText);
        }
    } catch (error) {
        console.error('Error during donation submission:', error);
    }

    // Simulate payment processing delay
    setTimeout(() => {
        setPaymentProcessing(false);
        setProjects([]); // Clear cart after donation
        localStorage.removeItem('donationProjects'); // Clear local storage
        setIsModalOpen(true); // Open the success modal
    }, 3000);
};


  

  const closeModal = () => {
    setIsModalOpen(false);
    // Navigate to the donor-home page
    navigate('/donor-home');
  };
  
  // Check if all fields are filled and the terms checkbox is checked
  const isFormValid = () => {
    const { name, email, address, phone, zip, cardholderName, cardNumber, cardExpiry, cardCVV, agreeTerms } = billingInfo;
    return (
      name && email && address && phone && zip && cardholderName && cardNumber && cardExpiry && cardCVV && agreeTerms
    );
  };

  return (
    <div className="charities-page">
      <div className="page-container">

        {/* Left Section: Charities and Donations */}
        <section className="charity-section">
          <header className="charities-header">
            <h1>Your Donation Cart</h1>
            <p>Review and manage your selected charities below.</p>
          </header>

          <section className="cart-summary">
            <h2>Cart Summary</h2>
            <p>
              <strong>Total Items:</strong> {projects.length}
            </p>
            <p>
              <strong>Total Donation Amount:</strong> ${calculateTotal()}
            </p>
          </section>

          <section className="charity-list">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={index} className="charity-card">
                  <div className="charity-header">
                    <h2>{project.title}</h2>
                    <p><strong>Country:</strong> {project.country}</p>
                  </div>
                  <div className="charity-content">
                    <p><strong>Description:</strong> {project.donationDescription}</p>
                    {project.isCampaign ? (
                      <>
                        <strong>Amount:</strong>
                        <input
                          type="number"
                          value={project.donationAmount || ''}
                          onChange={(e) => handleCampaignDonationAmountChange(index, e.target.value)}
                          min="0"
                          placeholder="Enter donation amount"
                        />
                      </>
                    ) : (
                      <p><strong>Amount:</strong> ${project.donationAmount}</p>
                    )}
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => removeFromCart(index)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            ) : (
              <p>Your cart is empty. Please select charities to donate.</p>
            )}
          </section>
        </section>

        {/* Right Section: Billing and Payment */}
        <section className="payment-section">
          <h2>Billing Information</h2>

          <div className="billing-info">
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={billingInfo.name}
                  onChange={handleBillingChange}
                  required
                  placeholder="Full Name"
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={billingInfo.email}
                  onChange={handleBillingChange}
                  required
                  placeholder="Email Address"
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  value={billingInfo.phone}
                  onChange={handleBillingChange}
                  required
                  placeholder="Phone Number"
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleBillingChange}
                  required
                  placeholder="Shipping Address"
                />
              </label>

              <label>
                Postal/ZIP Code:
                <input
                  type="text"
                  name="zip"
                  value={billingInfo.zip}
                  onChange={handleBillingChange}
                  required
                  placeholder="ZIP Code"
                />
              </label>

              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={billingInfo.agreeTerms}
                  onChange={handleBillingChange}
                  required
                />
                I agree to the terms and conditions and privacy policy.
              </label>
            </form>
          </div>

          <div className="payment-details">
            <h3>Payment Details</h3>
            <label>
              Cardholder Name:
              <input
                type="text"
                name="cardholderName"
                value={billingInfo.cardholderName}
                onChange={handleBillingChange}
                required
                placeholder="Name on Card"
              />
            </label>
            <label>
              Card Number:
              <input
                type="text"
                name="cardNumber"
                value={billingInfo.cardNumber}
                onChange={handleBillingChange}
                required
                placeholder="Card Number"
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="text"
                name="cardExpiry"
                value={billingInfo.cardExpiry}
                onChange={handleBillingChange}
                required
                placeholder="MM/YY"
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name="cardCVV"
                value={billingInfo.cardCVV}
                onChange={handleBillingChange}
                required
                placeholder="CVV"
              />
            </label>
          </div>

          <button
            className="cta-button"
            onClick={handleSubmitDonation}
            disabled={paymentProcessing || !isFormValid()}
            style={{
              backgroundColor: isFormValid() ? '#4CAF50' : '#f44336', // Green if valid, Red if not
            }}
          >
            {paymentProcessing ? 'Processing Payment...' : 'Complete Donation'}
          </button>
          {paymentProcessing && <p>Processing your payment. Please wait...</p>}
        </section>

      </div>

    {/* Success Modal */}
{isModalOpen && (
  <div className="modal-overlay1" onClick={closeModal}>
    <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
      <span className="modal-close-icon1" onClick={closeModal}>&#10005;</span>
      <h2 className="modal-title1">Donation Successful!</h2>
      <p className="modal-description1">
        Thank you for your generosity. Please check your inbox for the donation details.
      </p>
    </div>
  </div>
)}
    </div>
  );
};

export default Charities;
