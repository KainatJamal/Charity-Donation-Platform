import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import { useNavigate } from 'react-router-dom'; // For navigation
import '../Styles/styles.css'; // Make sure the styles are applied

const DonorAccount = () => {
  const [donorData, setDonorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to track if in edit mode
  const [updatedData, setUpdatedData] = useState({}); // Store the edited data
  const donorId = JSON.parse(localStorage.getItem('user'))?.id;
  const navigate = useNavigate();

  // Fetch donor data when the component mounts
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/donor/${donorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch donor data');
        }
        const data = await response.json();
        setDonorData(data.donor);
        setUpdatedData(data.donor); // Initialize with donor data
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    if (donorId) {
      fetchDonorData();
    }
  }, [donorId]);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/donor/${updatedData.donor_id}`, { // Use donor_id
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
      const result = await response.json();
      if (result.message === 'Donor updated successfully') {
        alert('Donor data updated successfully!');
        setDonorData(updatedData); // Update local state with new data
        setIsEditing(false); // Exit editing mode
      } else {
        alert('Failed to update donor data');
      }
    } catch (error) {
      console.error('Error updating donor data:', error);
      alert('An error occurred while saving the changes.');
    }
  };
  

  // Handle Edit button click
  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const response = await fetch(`http://localhost:5000/donor/${donorData.donor_id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert('Donor account deleted successfully');
          localStorage.removeItem('user');
          navigate('/login'); // Redirect to login after deletion
        } else {
          throw new Error('Failed to delete donor account');
        }
      } catch (error) {
        console.error('Error deleting donor:', error);
        alert('An error occurred while deleting the account');
      }
    }
  };
  
  // If donor data is still loading
  if (!donorData) {
    return <p>Loading donor data...</p>;
  }

  return (
    <div className="donor-account">
      <div className="header">
        <h1>Donor Account</h1>
        <div className="action-icons">
          <FaEdit onClick={handleEdit} className="icon edit-icon" />
          <FaTrash onClick={handleDelete} className="icon delete-icon" />
        </div>
      </div>
      <div className="donor-info">
        {isEditing ? (
          <div>
            <label>
              <strong>Full Name:</strong>
              <input
                type="text"
                name="full_name"
                value={updatedData.full_name || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={updatedData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                name="phone"
                value={updatedData.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                name="address"
                value={updatedData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Credit Card Last 4 Digits:</strong>
              <input
                type="text"
                name="credit_card_last4"
                value={updatedData.credit_card_number?.slice(-4)} // Only last 4 digits
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Expiry Date:</strong>
              <input
                type="text"
                name="expiry"
                value={updatedData.expiry}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>CVV:</strong>
              <input
                type="text"
                name="cvv"
                value={updatedData.cvv}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Full Name:</strong> {donorData.full_name}</p>
            <p><strong>Email:</strong> {donorData.email}</p>
            <p><strong>Phone:</strong> {donorData.phone}</p>
            <p><strong>Address:</strong> {donorData.address}</p>
            <p><strong>Credit Card:</strong> **** **** **** {donorData.credit_card_number.slice(-4)}</p>
            <p><strong>Expiry Date:</strong> {donorData.expiry}</p>
            <p><strong>CVV:</strong> {donorData.cvv}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorAccount;
