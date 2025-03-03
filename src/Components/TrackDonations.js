import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import io from 'socket.io-client';

const TrackDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve the donorId from localStorage
  const donorId = localStorage.getItem('donorId');

  useEffect(() => {
    if (!donorId) {
      setError('No donorId found in localStorage');
      setLoading(false);
      return;
    }

    // Connect to the socket server for real-time updates
    const socket = io('http://localhost:5000');
    
    // Fetch donor's donations
    const fetchDonations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-donations?donorId=${donorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        const data = await response.json();
        setDonations(data.donations);
      } catch (error) {
        setError('Error fetching donations: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();

    // Listen for real-time updates (donation status change)
    socket.on('donation-status-updated', (updatedDonation) => {
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation.donation_id === updatedDonation.donation_id
            ? { ...donation, donation_status: updatedDonation.donation_status }
            : donation
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [donorId]);

  if (loading) {
    return <p>Loading donations...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="track-donations-page">
      <h1>Your Donations</h1>
      <table className="donation-table1">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation.donation_id}>
                <td>${donation.donation_amount}</td>
                <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                <td>
                  {donation.donation_details && donation.donation_details.map((detail, index) => (
                    <div key={index}>
                      <p><strong>Title:</strong> {detail.title}</p>
                      <p><strong>Country:</strong> {detail.country}</p>
                      <p><strong>Description:</strong> {detail.description}</p>
                    </div>
                  ))}
                </td>
                <td>
                  <div className="status-container1">
                    {donation.donation_status.split(",").map((status, index) => (
                      <div key={index} className="status-line1">
                        <div className={`status-dot ${status.toLowerCase()}`}></div>
                        <span>{status}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No donations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrackDonations;
