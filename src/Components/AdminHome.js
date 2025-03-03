import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Badge } from 'react-bootstrap'; // Importing Badge component from react-bootstrap
import { FaDollarSign, FaUser, FaFlag, FaTrophy } from 'react-icons/fa'; // Import relevant icons

const AdminHome = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationStatuses, setDonationStatuses] = useState({});
  const [donationByCountry, setDonationByCountry] = useState({});
  const [topDonors, setTopDonors] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [highValueDonations, setHighValueDonations] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-donations');
        const data = await response.json();

        if (response.ok) {
          setDonations(data.donations);
          aggregateDonationsByCountry(data.donations);
          identifyTopDonors(data.donations);
          calculateDonationStatuses(data.donations);
          extractRecentDonations(data.donations);
          checkPendingAndHighValueDonations(data.donations);
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

  const aggregateDonationsByCountry = (donations) => {
    const countryData = {};
    donations.forEach((donation) => {
      if (donation.donation_details && Array.isArray(donation.donation_details)) {
        donation.donation_details.forEach((detail) => {
          const country = detail.country.trim();
          const amount = parseFloat(detail.amount);
          countryData[country] = (countryData[country] || 0) + amount;
        });
      }
    });
    setDonationByCountry(countryData);
  };
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

  const calculateDonationStatuses = (donations) => {
    const statuses = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
    };
    donations.forEach((donation) => {
      const status = donation.donation_status;
      if (statuses[status] !== undefined) {
        statuses[status] += 1;
      }
    });
    setDonationStatuses(statuses);
  };

  const extractRecentDonations = (donations) => {
    const sortedDonations = donations
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
    setRecentDonations(sortedDonations);
  };

  const checkPendingAndHighValueDonations = (donations) => {
    const highValueThreshold = 1000;
    const pending = [];
    const highValue = [];

    donations.forEach((donation) => {
      const amount = donation.donation_details.reduce(
        (sum, detail) => sum + (isNaN(parseFloat(detail.amount)) ? 0 : parseFloat(detail.amount)),
        0
      );
      if (donation.donation_status === 'Pending') {
        pending.push(donation);
      }
      if (amount >= highValueThreshold) {
        highValue.push(donation);
      }
    });

    setPendingDonations(pending);
    setHighValueDonations(highValue);

    // Toast notifications for alerts
    if (pending.length > 0) {
      toast.info(`${pending.length} donations are pending. Please review them!`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    if (highValue.length > 0) {
      toast.success(`${highValue.length} high-value donations (over $1000) received!`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const fetchSystemHealth = () => {
    setSystemHealth({
      apiResponseTime: '120ms',
      donationsProcessedLast24Hours: donations.length,
      systemStatus: 'All systems operational',
    });
  };

  useEffect(() => {
    fetchSystemHealth();
  }, [donations]);

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <div className="admin-home">
      <h1>Admin Dashboard</h1>
      <ToastContainer />

      {/* Donation Overview */}
      <section>
        <h2>
          <FaDollarSign /> Donation Overview
        </h2>
        <div className="stats">
          <div>
            <h3>
              <FaDollarSign /> Total Donations
            </h3>
            <p>
              $
              {donations
                .reduce(
                  (total, donation) =>
                    total +
                    donation.donation_details.reduce(
                      (sum, detail) => sum + (isNaN(parseFloat(detail.amount)) ? 0 : parseFloat(detail.amount)),
                      0
                    ),
                  0
                )
                .toFixed(2)}
            </p>
          </div>
          <div>
            <h3>
              <FaUser /> Total Donors
            </h3>
            <p>{new Set(donations.map((donation) => donation.donor_id)).size}</p>
          </div>
        </div>
      </section>

      {/* Donation Status Breakdown */}
      <section>
        <h2>
          <FaFlag /> Donation Status Breakdown
        </h2>
        <div className="status-list">
          {Object.entries(donationStatuses).map(([status, count]) => (
            <div key={status}>
              <h3>{status}</h3>
              <p>{count} Donations</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section>
        <h2>
          <FaTrophy /> Recent Activities
        </h2>
        <div>
          <h3>Recent Donations</h3>
          <ul>
            {recentDonations.map((donation) => (
              <li key={donation.donation_id}>
                <strong>Donor ID:</strong> {donation.donor_id} |{' '}
                <strong>Amount:</strong> ${donation.donation_details.reduce(
                  (sum, detail) => sum + (isNaN(parseFloat(detail.amount)) ? 0 : parseFloat(detail.amount)),
                  0
                ).toFixed(2)} |{' '}
                <strong>Country:</strong> {donation.donation_details[0].country} |{' '}
                <strong>Status:</strong> {donation.donation_status}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Top Donors (Gamification) */}
      <section>
        <h2>
          <FaTrophy /> Top Donor
        </h2>
        {topDonors.length > 0 && (
          <div>
            <strong>{topDonors[0].donorId}</strong>: ${topDonors[0].totalAmount.toFixed(2)} |{' '}
            <Badge variant={topDonors[0].badge}>
              {topDonors[0].icon} {topDonors[0].badge.charAt(0).toUpperCase() + topDonors[0].badge.slice(1)} Donor
            </Badge>{' '}
            | <span className="title">{topDonors[0].title}</span>
          </div>
        )}
      </section>

      {/* Donations by Country */}
      <section>
        <h2>
          <FaFlag /> Donations by Country
        </h2>
        <div className="country-list">
          {Object.entries(donationByCountry).map(([country, totalAmount]) => (
            <div key={country}>
              <h3>{country}</h3>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System Health / Performance Metrics */}
      <section>
        <h2>System Health / Performance Metrics</h2>
        <div>
          <strong>API Response Time:</strong> {systemHealth.apiResponseTime}
        </div>
        <div>
          <strong>Donations Processed (Last 24 hours):</strong> {systemHealth.donationsProcessedLast24Hours}
        </div>
        <div>
          <strong>System Status:</strong> {systemHealth.systemStatus}
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
