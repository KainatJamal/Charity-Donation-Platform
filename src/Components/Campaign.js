import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/styles.css'; // Ensure the styling is consistent across the app

// Importing images from the src/Images folder
import image1 from '../Images/fundraising-template-design-67991d5f6d7fd4272aaa6e6692be5a3f_screen.jpg';
import image2 from '../Images/22596896_6656325.jpg';
import image3 from '../Images/charity-flyer-design-template-1f64f55986131b10797cce0467b61c5a.webp';
import image4 from '../Images/fundraiser,-charity-design-template-4c06bd28639cd8e7ebff053143bb0eac.webp';
import image5 from '../Images/white-3d-winter-gear-drive-poster-design-template-bc2fa62a2f11161eb948f2f2090630ac.webp';
import foodDriveImage from '../Images/food-drive-flyer-template-54d925f306c730f0fc135eb3f8b3dc6b_screen.jpg';
import charityEventImage from '../Images/charity-event-poster-template-6984179d513369f324ab7fc19f09e3e3_screen.jpg';

// Example campaigns data
const campaignsData = [
  {
    id: 1,
    title: 'Education for All',
    description: 'Help provide education to children in underdeveloped regions. By supporting this campaign, you are ensuring that children receive access to necessary learning materials, infrastructure, and experienced teachers.',
    image: image1,
    targetAmount: 10000,
    raisedAmount: 10000, // Completed
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    title: 'Clean Water for Communities',
    description: 'Donate to bring clean water to rural communities. Access to clean water can reduce the spread of diseases, improve overall health, and empower communities.',
    image: image2,
    targetAmount: 8000,
    raisedAmount: 5000,
    createdAt: '2023-12-05',
  },
  {
    id: 3,
    title: 'Help Kids in Need',
    description: 'Donate to provide food, shelter, and education for underprivileged children. This campaign focuses on offering care packages, education support, and building safe environments for children who have nowhere else to go.',
    image: image3,
    targetAmount: 15000,
    raisedAmount: 4000,
    createdAt: '2023-11-20',
  },
  {
    id: 4,
    title: 'Earthquake Relief Fund',
    description: 'Help victims of the recent earthquake with necessary relief and support. Donations will go toward providing food, medical supplies, shelter, and long-term recovery efforts.',
    image: image4,
    targetAmount: 20000,
    raisedAmount: 20000, // Completed
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    title: 'Winter Drive for Homeless',
    description: 'Help provide warm clothing and shelter to homeless people this winter. Your support can provide blankets, coats, and warm meals for people in need during the harsh winter months.',
    image: image5,
    targetAmount: 12000,
    raisedAmount: 3000,
    createdAt: '2023-12-25',
  },
  {
    id: 6,
    title: 'Food Drive for Local Shelters',
    description: 'Join our food drive to provide meals for families and individuals in need. Non-perishable food items are being collected to support local shelters and food banks.',
    image: foodDriveImage,
    targetAmount: 5000,
    raisedAmount: 2000,
    createdAt: '2024-02-15',
  },
  {
    id: 7,
    title: 'Charity Gala Event',
    description: 'Attend our annual charity gala and support the cause of child education. Enjoy an evening of live entertainment, a silent auction, and guest speakers sharing inspiring stories.',
    image: charityEventImage,
    createdAt: '2024-03-01',
    targetAmount: 0,
    raisedAmount: 0,
    isEvent: true,
  },
];

const Campaign = () => {
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
    <div className="campaign-page">
     <section className="campaign-header">
  <h1 className="campaign-title">Our Campaigns</h1>
  <p className="campaign-description">
    Join us in making a difference. Explore our ongoing campaigns and help us 
    create a positive impact through your generosity.
  </p>
  <div className="sort-dropdown1">
    <label htmlFor="sort" className="sort-label1">Sort by:</label>
    <select
      id="sort"
      value={sortOption}
      onChange={handleSortChange}
      className="sort-select1"
    >
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
      <option value="need-more-money">Need More Money</option>
    </select>
  </div>
</section>

      <section className="campaign-list">
        {sortedCampaigns.map((campaign) => {
          const isCompleted =
            campaign.targetAmount > 0 && campaign.raisedAmount >= campaign.targetAmount;

          return (
            <div
              className={`campaign-card ${isCompleted ? 'completed' : ''}`}
              key={campaign.id}
            >
              {isCompleted && (
                <div className="campaign-card-overlay">
                  <i className="lock-icon">🔒</i>
                </div>
              )}
              <img
                src={campaign.image}
                alt={campaign.title}
                className="campaign-image"
              />
              <div className="campaign-info">
                <h3 className="campaign-title2">{campaign.title}</h3>
                <p className="campaign-description1">{campaign.description}</p>
                <div className="campaign-progress">
                  {campaign.targetAmount > 0 && (
                    <>
                      <p><strong>Raised:</strong> ${campaign.raisedAmount}</p>
                      <p><strong>Target:</strong> ${campaign.targetAmount}</p>
                      <progress value={campaign.raisedAmount} max={campaign.targetAmount}></progress>
                    </>
                  )}
                </div>
                {!isCompleted && (
                  <div className="cta-buttons2">
                    <Link to="/login" className="cta-button2 donate-button">
                      Donate Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Campaign;
