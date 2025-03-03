import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register all necessary components for the charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // For Doughnut charts
  PointElement, // For Line charts
  LineElement // For Line charts
);

const GenerateReports = () => {
  const chartRef = useRef(null); // Reference for the chart
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationByCountry, setDonationByCountry] = useState({});
  const [topDonors, setTopDonors] = useState([]);
  const [donationRanges, setDonationRanges] = useState({});
  const [donationStatuses, setDonationStatuses] = useState({});
  const [selectedChart, setSelectedChart] = useState('country'); // Default chart

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-donations');
        const data = await response.json();

        if (response.ok) {
          setDonations(data.donations);
          aggregateDonationsByCountry(data.donations);
          identifyTopDonors(data.donations);
          calculateDonationRanges(data.donations);
          calculateDonationStatuses(data.donations); // Aggregating donation statuses
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

          if (!countryData[country]) {
            countryData[country] = 0;
          }
          countryData[country] += amount;
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
        (sum, detail) => sum + parseFloat(detail.amount),
        0
      );

      if (!donorData[donorId]) {
        donorData[donorId] = 0;
      }
      donorData[donorId] += totalAmount;
    });

    const sortedDonors = Object.entries(donorData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    setTopDonors(sortedDonors);
  };

  const calculateDonationRanges = (donations) => {
    const ranges = {
      '0-50': 0,
      '50-100': 0,
      '100-500': 0,
      '500-1000': 0,
      '1000+': 0,
    };

    donations.forEach((donation) => {
      if (donation.donation_details && Array.isArray(donation.donation_details)) {
        donation.donation_details.forEach((detail) => {
          const amount = parseFloat(detail.amount);

          if (amount <= 50) {
            ranges['0-50'] += 1;
          } else if (amount <= 100) {
            ranges['50-100'] += 1;
          } else if (amount <= 500) {
            ranges['100-500'] += 1;
          } else if (amount <= 1000) {
            ranges['500-1000'] += 1;
          } else {
            ranges['1000+'] += 1;
          }
        });
      }
    });

    setDonationRanges(ranges);
  };

  const calculateDonationStatuses = (donations) => {
    const statuses = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
    };

    donations.forEach((donation) => {
      const status = donation.donation_status; // Ensure the status field exists in the donation object

      if (status === 'Pending') {
        statuses.Pending += 1;
      } else if (status === 'In Progress') {
        statuses['In Progress'] += 1;
      } else if (status === 'Completed') {
        statuses.Completed += 1;
      }
    });

    console.log("Donation Statuses Aggregated: ", statuses); // Debugging log
    setDonationStatuses(statuses);
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  // Prepare data for the line chart (Top Donors)
  const chartDataDonors = {
    labels: topDonors.map(([donorId]) => donorId),
    datasets: [
      {
        label: 'Total Donation Amount ($)',
        data: topDonors.map(([, amount]) => amount),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.2,
        pointRadius: 5, // Add points to the line
      },
    ],
  };

  // Prepare data for donation ranges chart
  const chartDataRanges = {
    labels: Object.keys(donationRanges),
    datasets: [
      {
        label: 'Number of Donations',
        data: Object.values(donationRanges),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for donation statuses chart with custom colors
  const chartDataStatuses = {
    labels: Object.keys(donationStatuses),
    datasets: [
      {
        label: 'Number of Donations',
        data: Object.values(donationStatuses),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(54, 162, 235, 0.6)', // Blue
          'rgba(255, 206, 86, 0.6)', // Yellow
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // CSV data for donation statuses
  const csvDataStatuses = Object.entries(donationStatuses).map(([status, count]) => ({
    'Donation Status': status,
    'Number of Donations': count,
  }));

  return (
    <div className="generate-reports-page">
      <h1>Donation Analytics</h1>

      {/* Dropdown for selecting chart */}
      <div className="chart-dropdown">
        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
        >
          <option value="country">Donations by Country</option>
          <option value="donors">Top Donors</option>
          <option value="ranges">Donation Ranges</option>
          <option value="statuses">Donation Status Breakdown</option>
        </select>
      </div>

      {/* Conditionally render selected chart */}
      {selectedChart === 'country' && (
        <div className="chart-container">
          <h2>Donations by Country</h2>
          <Bar
            data={{
              labels: Object.keys(donationByCountry),
              datasets: [
                {
                  label: 'Donation Amount ($)',
                  data: Object.values(donationByCountry),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: true, position: 'top' } },
              responsive: true,
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            }}
          />
        </div>
      )}

      {selectedChart === 'donors' && (
        <div className="chart-container">
          <h2>Top Donors by ID and Total Donations</h2>
          <Line
            ref={chartRef}
            data={chartDataDonors}
            options={{
              plugins: { legend: { display: true, position: 'top' } },
              responsive: true,
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      )}

      {selectedChart === 'ranges' && (
        <div className="chart-container">
          <h2>Donations Distribution Across Amount Ranges</h2>
          <Bar
            data={chartDataRanges}
            options={{
              plugins: { legend: { display: true, position: 'top' } },
              responsive: true,
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      )}

      {selectedChart === 'statuses' && (
        <div className="chart-container">
          <h2>Donation Status Breakdown</h2>
          <Doughnut
            data={chartDataStatuses}
            options={{
              plugins: { legend: { display: true, position: 'top' } },
              responsive: true,
            }}
          />
        </div>
      )}

      <div>
        <CSVLink
          data={csvDataStatuses}
          filename="donation_status_breakdown.csv"
          className="csv-download-btn"
        >
          Download Donation Status Breakdown CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default GenerateReports;
