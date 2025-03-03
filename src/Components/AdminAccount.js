import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import { useNavigate } from 'react-router-dom'; // For navigation
import '../Styles/styles.css'; // Make sure the styles are applied

const AdminAccount = () => {
  const [adminData, setAdminData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to track if in edit mode
  const [updatedData, setUpdatedData] = useState({}); // Store the edited data
  const adminId = JSON.parse(localStorage.getItem('user'))?.id;
  const navigate = useNavigate();

  // Fetch admin data when the component mounts
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/${adminId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
        const data = await response.json();
        setAdminData(data.admin);
        setUpdatedData(data.admin); // Initialize with admin data
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    if (adminId) {
      fetchAdminData();
    }
  }, [adminId]);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle Save (PUT request to update data)
const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:5000/admin/${updatedData.admin_id}`, {
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
    if (result.message === 'Admin updated successfully') {
      alert('Admin data updated successfully!');
      setAdminData(updatedData); // Update local state with new data
      setIsEditing(false); // Exit editing mode
    } else {
      alert('Failed to update admin data');
    }
  } catch (error) {
    console.error('Error updating admin data:', error);
    alert('An error occurred while saving the changes.');
  }
};


  // Handle Edit button click
  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  // Handle Delete button click
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const response = await fetch(`http://localhost:5000/admin/${adminData.admin_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Admin account deleted successfully');
          localStorage.removeItem('user');
          navigate('/login'); // Redirect to login after deletion
        } else {
          throw new Error('Failed to delete admin account');
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('An error occurred while deleting the account');
      }
    }
  };

  // If admin data is still loading
  if (!adminData) {
    return <p>Loading admin data...</p>;
  }

  return (
    <div className="admin-account">
      <div className="header">
        <h1>Admin Account</h1>
        <div className="action-icons">
          <FaEdit onClick={handleEdit} className="icon edit-icon" />
          <FaTrash onClick={handleDelete} className="icon delete-icon" />
        </div>
      </div>
      <div className="admin-info">
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
              <strong>Unique Code:</strong>
              <input
                type="text"
                name="unique_code"
                value={updatedData.unique_code}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Full Name:</strong> {adminData.full_name}</p>
            <p><strong>Email:</strong> {adminData.email}</p>
            <p><strong>Phone:</strong> {adminData.phone}</p>
            <p><strong>Unique Code:</strong> {adminData.unique_code}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccount;
