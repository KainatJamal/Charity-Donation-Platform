import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const ManageCharities = () => {
  const [donations, setDonations] = useState([]); // Donations data
  const [loading, setLoading] = useState(true);   // Loading state
  const [sortOption, setSortOption] = useState('latest');  // Default sorting option
  const [filteredDonations, setFilteredDonations] = useState([]); // Filtered and sorted donations
  const [searchQuery, setSearchQuery] = useState('');  // Search query for country

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-donations');
        const data = await response.json();

        if (response.ok) {
          setDonations(data.donations);  // Set donations to the fetched data
          setFilteredDonations(data.donations);  // Initially set filtered donations to all donations
        } else {
          console.error('Error fetching donations:', data.error);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleStatusChange = async (donationId, newStatus) => {
    try {
      const response = await fetch('http://localhost:5000/update-donation-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId,
          newStatus,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation.donation_id === donationId
              ? { ...donation, donation_status: newStatus }
              : donation
          )
        );
        // Apply current sort filter after updating status
        applySortAndFilter(sortOption, searchQuery);
      } else {
        console.error('Error updating donation status:', result.error);
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    applySortAndFilter(option, searchQuery);  // Apply sorting and filtering based on the selected option
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applySortAndFilter(sortOption, query);  // Apply sorting and filtering based on the search query
  };

  const applySortAndFilter = (option, query) => {
    let sortedDonations = [...donations];
    
    // Filter by country if searchQuery is not empty
    if (query) {
      sortedDonations = sortedDonations.filter(donation => 
        donation.donation_details && donation.donation_details.some(detail => 
          detail.country.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    // Sorting logic
    switch (option) {
      case 'latest':
        sortedDonations.sort((a, b) => new Date(b.donation_date) - new Date(a.donation_date)); // Sort by latest date
        break;
      case 'oldest':
        sortedDonations.sort((a, b) => new Date(a.donation_date) - new Date(b.donation_date)); // Sort by oldest date
        break;
      case 'pending':
        sortedDonations = sortedDonations.filter(donation => donation.donation_status === 'Pending'); // Filter by pending
        break;
      case 'in_progress':
        sortedDonations = sortedDonations.filter(donation => donation.donation_status === 'In Progress'); // Filter by in progress
        break;
      case 'completed':
        sortedDonations = sortedDonations.filter(donation => donation.donation_status === 'Completed'); // Filter by completed
        break;
      default:
        break;
    }

    setFilteredDonations(sortedDonations); // Update the state with sorted and filtered donations
  };

  if (loading) {
    return <p>Loading donations...</p>;
  }

  return (
    <div className="manage-charities-page1">
      <h1>Manage Charities</h1>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by country..."
          style={{ padding: '8px', fontSize: '14px', width: '250px' }}
        />

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          style={{ padding: '8px', fontSize: '14px' }}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="donation-table2">
        <thead>
          <tr>
            <th>Donation ID</th>
            <th>Donor ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredDonations) && filteredDonations.length > 0 ? (
            filteredDonations.map((donation) => (
              <tr key={donation.donation_id}>
                <td>{donation.donation_id}</td>
                <td>{donation.donor_id}</td>
                <td>${donation.donation_amount}</td>
                <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                <td>
                  {donation.donation_details && Array.isArray(donation.donation_details) ? (
                    donation.donation_details.map((detail, index) => (
                      <div key={index}>
                        <p><strong>Title:</strong> {detail.title}</p>
                        <p><strong>Amount:</strong> ${detail.amount}</p>
                        <p><strong>Country:</strong> {detail.country.trim()}</p>
                        <p><strong>Description:</strong> {detail.description}</p>
                      </div>
                    ))
                  ) : (
                    <p>Invalid donation details format.</p>
                  )}
                </td>
                <td>
                  <select
                    value={donation.donation_status}
                    onChange={(e) =>
                      handleStatusChange(donation.donation_id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No donations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCharities;
