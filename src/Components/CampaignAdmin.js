import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/styles.css'; // Ensure the styling is consistent across the app

// Example campaigns data
const campaignsData = [
  {
    id: 1,
    title: 'Education for All',
    description: 'Help provide education to children in underdeveloped regions.',
    targetAmount: 10000,
    raisedAmount: 10000,
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    title: 'Clean Water for Communities',
    description: 'Donate to bring clean water to rural communities.',
    targetAmount: 8000,
    raisedAmount: 5000,
    createdAt: '2023-12-05',
  },
  {
    id: 3,
    title: 'Help Kids in Need',
    description: 'Donate to provide food, shelter, and education for underprivileged children.',
    targetAmount: 15000,
    raisedAmount: 4000,
    createdAt: '2023-11-20',
  },
  {
    id: 4,
    title: 'Earthquake Relief Fund',
    description: 'Help victims of the recent earthquake with necessary relief and support.',
    targetAmount: 20000,
    raisedAmount: 20000,
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    title: 'Winter Drive for Homeless',
    description: 'Help provide warm clothing and shelter to homeless people this winter.',
    targetAmount: 12000,
    raisedAmount: 3000,
    createdAt: '2023-12-25',
  },
  {
    id: 6,
    title: 'Food Drive for Local Shelters',
    description: 'Join our food drive to provide meals for families and individuals in need.',
    targetAmount: 5000,
    raisedAmount: 2000,
    createdAt: '2024-02-15',
  },
  {
    id: 7,
    title: 'Charity Gala Event',
    description: 'Attend our annual charity gala and support the cause of child education.',
    targetAmount: 0,
    raisedAmount: 0,
    createdAt: '2024-03-01',
    isEvent: true,
  },
];

const CampaignAdmin = () => {
  const [sortOption, setSortOption] = useState('latest');

  // Sorting function
  const sortCampaigns = (option) => {
    let sortedCampaigns = [...campaignsData];
    if (option === 'latest') {
      sortedCampaigns = sortedCampaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (option === 'oldest') {
      sortedCampaigns = sortedCampaigns.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (option === 'need-more-money') {
      sortedCampaigns = sortedCampaigns.sort(
        (a, b) => (b.targetAmount - b.raisedAmount) - (a.targetAmount - a.raisedAmount)
      );
    }
    return sortedCampaigns;
  };

  // Handle dropdown change
  const handleSortChange = (e) => {
    setSortOption(e.target.value); // Update the state based on the dropdown selection
  };

  const sortedCampaigns = sortCampaigns(sortOption); // Re-sort based on the current option

  return (
    <div className="campaign-admin-page">
      <section className="campaign-header4">
        <h1 className="campaign-title4">Campaigns Management</h1>
        <p className="campaign-description4">
          View and manage the ongoing campaigns. You can track their progress, update details, or sort by various metrics.
        </p>
        <div className="sort-dropdown4">
          <label htmlFor="sort" className="sort-label4">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="need-more-money">Need More Money</option>
          </select>
        </div>
      </section>

      <section className="campaign-table-section4">
        <div className="campaign-table-container4">
          <table className="campaign-table4">
            <thead>
              <tr>
                <th>Campaign Title</th>
                <th>Description</th>
                <th>Target Amount</th>
                <th>Raised Amount</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {sortedCampaigns.map((campaign) => {
                const isCompleted =
                  campaign.targetAmount > 0 && campaign.raisedAmount >= campaign.targetAmount;
                return (
                  <tr key={campaign.id} className={isCompleted ? 'completed' : ''}>
                    <td>{campaign.title}</td>
                    <td>{campaign.description}</td>
                    <td>${campaign.targetAmount}</td>
                    <td>${campaign.raisedAmount}</td>
                    <td>
                      <div className="status-container">
                        <div className={`status-dot ${isCompleted ? 'completed' : 'ongoing'}`}></div>
                        <span>{isCompleted ? 'Completed' : 'Ongoing'}</span>
                      </div>
                    </td>
                    <td>{campaign.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CampaignAdmin;
