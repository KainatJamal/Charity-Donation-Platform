import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaTrashAlt, FaMedal, FaDonate, FaHistory, FaHeart } from 'react-icons/fa';

const DonorHome = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [donorName, setDonorName] = useState('');
  const [topDonors, setTopDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Retrieve the donorId and fullName from localStorage
  const donorId = localStorage.getItem('donorId');
  const fullName = localStorage.getItem('donorFullName');

  useEffect(() => {
    // Check if donorId exists
    if (donorId) {
      console.log('Returning user detected');
      fetchDonorData();
    } else {
      console.log('New user detected, welcome!');
      setLoading(false); // For new users, skip fetching donations data
    }
  }, [donorId]);

  // Function to fetch donor's data
  const fetchDonorData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get-donations?donorId=${donorId}`);
      const data = await response.json();
      const donorData = data.donations;

      setDonations(donorData);

      // Calculate total donations amount
      const total = donorData.reduce((sum, donation) => sum + (Number(donation.donation_amount) || 0), 0);
      setTotalAmount(total);

      // Get the donor's name (Assuming this is returned in the data)
      setDonorName(data.donorName || 'Donor');

      // Identify top donors and assign gamification titles and badges
      identifyTopDonors(donorData);

    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Identify top donors and assign gamification titles, badges, and icons
  const identifyTopDonors = (donations) => {
    const donorData = {};
    donations.forEach((donation) => {
      const donorId = donation.donor_id;
      const totalAmount = donation.donation_details.reduce(
        (sum, detail) => sum + (isNaN(parseFloat(detail.amount)) ? 0 : parseFloat(detail.amount)),
        0
      );
      donorData[donorId] = (donorData[donorId] || 0) + totalAmount;
    });

    const sortedDonors = Object.entries(donorData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1); // Only get the top donor

    // Add gamification titles and badges based on donation amount for only the top donor
    const gamifiedDonors = sortedDonors.map(([donorId, totalAmount]) => {
      const title = getGamificationTitle(totalAmount);
      const badge = getGamificationBadge(totalAmount);
  
      return {
        donorId,
        totalAmount,
        title,
        badge,
        icon: getGamificationIcon(badge),
      };
    });

    setTopDonors(gamifiedDonors);
  };

  const getGamificationIcon = (badge) => {
    switch (badge) {
      case 'diamond':
        return '💎'; // Diamond icon
      case 'platinum':
        return '🥇'; // Platinum icon
      case 'gold':
        return '🏅'; // Gold icon
      case 'silver':
        return '🥈'; // Silver icon
      default:
        return '🎖️'; // Default icon if none match
    }
  };

  const getGamificationTitle = (amount) => {
    if (amount >= 10000) return 'Donation Champion';
    if (amount >= 5000) return 'Top Philanthropist';
    if (amount <= 1000) return 'Generosity Hero';
    return 'Contributor';
  };

  const getGamificationBadge = (amount) => {
    if (amount >= 10000) return 'diamond';
    if (amount >= 5000) return 'platinum';
    if (amount <= 1000) return 'gold';
    return 'silver';
  };

  // Filter donations by date range
  const filteredDonations = donations.filter((donation) => {
    const donationDate = new Date(donation.donation_date);
    const currentDate = new Date();
    
    if (dateFilter === 'lastMonth') {
      return donationDate.getMonth() === currentDate.getMonth() - 1;
    } else if (dateFilter === 'lastYear') {
      return donationDate.getFullYear() === currentDate.getFullYear() - 1;
    }
    
    return true; // For 'all' time
  });

  // Handle search query
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter donations based on the search query and only show pending donations
  const searchedDonations = filteredDonations.filter((donation) =>
    donation.donation_details.some((detail) =>
      detail.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) && donation.donation_status === 'Pending' // Only show pending donations
  );

  if (loading) {
    return <p>Loading donations...</p>;
  }

  return (
    <div className="donor-home-page">
      {/* Welcome Message */}
      <section className="welcome-section">
        {donorId ? (
          <h1>Welcome back, {fullName || donorName}!</h1> // Display the full name or the default donorName
        ) : (
          <h1>Welcome to our donor community! Thank you for joining us!</h1> // For new users
        )}
      </section>
  
      {/* Card Container */}
      <div className="card-container">
        {/* Donation Overview */}
        {donorId && (
          <div className="card">
            <h2><FaDonate style={{ marginRight: '8px' }} /> Donation Overview</h2>
            <div>Total Donations: ${totalAmount.toFixed(2)}</div>
            <div>Total Number of Donations: {donations.length}</div>
          </div>
        )}
  
     {/* Gamification */}
{donorId && topDonors.length > 0 && (
  <div className="card gamification-card">
    <div className="gamification-badge">
      <span> {topDonors[0].icon}</span>
    </div>
    <h2><FaMedal style={{ marginRight: '8px' }} /> Your Gamification Badge</h2>
    <div>{topDonors[0].title}</div>
    <span>{topDonors[0].badge}</span>
  </div>
)}

  
       
  
        {/* Donation History Filters & Search */}
        {donorId && (
          <div className="card">
            <h2><FaHistory style={{ marginRight: '8px' }} /> Your Donation History</h2>
  
            {/* Date Filter */}
            <label>Filter by Date:</label>
            <select onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
            </select>
  
            {/* Search Donations */}
            <input
              type="text"
              placeholder="Search by donation title"
              value={searchQuery}
              onChange={handleSearch}
            />
  
            <table className="donation-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {searchedDonations.length > 0 ? (
                  searchedDonations.map((donation) => (
                    <tr key={donation.donation_id}>
                      <td>${donation.donation_amount}</td>
                      <td>
                        {new Date(donation.donation_date).toLocaleDateString()}
                      </td>
                      <td>
                        {donation.donation_details &&
                          donation.donation_details.map((detail, index) => (
                            <div key={index}>
                              <p>
                                <strong>Title:</strong> {detail.title}
                              </p>
                              <p>
                                <strong>Country:</strong> {detail.country}
                              </p>
                              <p>
                                <strong>Description:</strong> {detail.description}
                              </p>
                            </div>
                          ))}
                      </td>
                      <td>{donation.donation_status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No pending donations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        )}
         {/* Impact Metrics */}
         {donorId && (
          <div className="card">
            <h2><FaHeart style={{ marginRight: '8px' }} /> Impact of Your Donations</h2>
            <div>
              Your donations have helped fund various causes and made a difference
              in the lives of many!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};  
export default DonorHome;
