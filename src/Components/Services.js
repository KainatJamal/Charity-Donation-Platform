import React from 'react';
import Layout from './Layout'; // Assuming Layout is used across all pages
import '../Styles/styles.css'; // Ensure you have the right styles applied

const Services = () => {
  return (
    <div className="services-page">
      {/* Header Section */}
      <section className="services-header">
        <h1 className="header-title">Our Services</h1>
        <p className="header-description">
          Discover the ways you can make a difference with Aid Circle. Whether you’re looking to volunteer, donate, track your donations, or explore impact analytics, we offer a range of services to help you get involved and see the results of your contributions.
        </p>
      </section>

      {/* Browse Charity Campaigns Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-hand-holding-heart"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Browse Charity Campaigns</h2>
          <p className="service-description">
            Explore various charity campaigns available on our platform. Whether you’re passionate about education, healthcare, or environmental causes, we have a wide range of campaigns you can support. You can browse through different causes, read about the projects, and decide where to direct your donation.
          </p>
          <p className="service-highlight">
            <strong>Browse and find the campaign that resonates with you.</strong>
          </p>
          <div className="cta-buttons1">
            <a href="/campaign" className="cta-button1">Explore Campaigns</a>
          </div>
        </div>
      </section>

      {/* Make Secure Donations Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-donate"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Make Secure Donations</h2>
          <p className="service-description">
            Donating through Aid Circle is safe and straightforward. We partner with trusted payment platforms to ensure that your donations are securely processed and go directly to the causes you care about. Whether you want to make a one-time donation or set up recurring contributions, we make the process simple and secure.
          </p>
          <p className="service-highlight">
            <strong>Your generosity makes an impact—every contribution counts.</strong>
          </p>
          <div className="cta-buttons1">
            <a href="/login" className="cta-button1">Donate Now</a>
          </div>
        </div>
      </section>

      {/* Track Your Donations Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-chart-line"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Track Your Donations</h2>
          <p className="service-description">
            We provide real-time tracking of your donations. You can view detailed reports on the total amount donated, trends in your giving habits, and how your contributions are being used. With our impact analytics, you’ll see exactly where your money is going and the real-world impact it’s making.
          </p>
          <p className="service-highlight">
            <strong>Stay informed and inspired with insights into your contributions.</strong>
          </p>
        </div>
      </section>

      {/* Impact Analytics Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-chart-pie"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Impact Analytics and Reports</h2>
          <p className="service-description">
            Transparency is key. We offer detailed donation trends and impact reports so you can track the results of your contributions. View how funds are allocated, the number of lives impacted, and see the broader impact of your support through visually appealing analytics.
          </p>
          <p className="service-highlight">
            <strong>Understand the difference your donations are making with clear, visual reports.</strong>
          </p>
        </div>
      </section>

      {/* Admin Controls Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-cogs"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Admin Controls & Monitoring</h2>
          <p className="service-description">
            Admins have access to a powerful dashboard that enables them to manage charity details, monitor donations in real-time, and generate comprehensive reports on the impact of campaigns. Admins can oversee all platform activities, ensuring transparency, accountability, and seamless operation.
          </p>
          <p className="service-highlight">
            <strong>Efficient management tools for admins to ensure transparency and smooth operations.</strong>
          </p>
        </div>
      </section>

      {/* Role-based Access Control Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-user-shield"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Role-based Access Control</h2>
          <p className="service-description">
            We implement role-based access control (RBAC) to ensure that users and admins have appropriate levels of access based on their roles. Whether you're a donor, volunteer, or admin, you'll have access to the features and functionalities that suit your responsibilities.
          </p>
          <p className="service-highlight">
            <strong>Access control ensures the security and integrity of the platform’s operations.</strong>
          </p>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="service-section">
        <div className="icon">
          <i className="fas fa-bell"></i>
        </div>
        <div className="service-info">
          <h2 className="service-title">Notifications and Updates</h2>
          <p className="service-description">
            Stay updated with real-time notifications. Whether it’s about a new campaign, donation status, or impact report, we ensure that you’re always informed about the causes you care about. Receive timely updates directly on your dashboard or through email notifications.
          </p>
          <p className="service-highlight">
            <strong>Never miss an update about your donations and the impact you're making.</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Services;
