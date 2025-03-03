import React, { useState } from 'react';
import '../Styles/styles.css';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/send-email.php', { // Update the URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, query }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage('Your query has been sent successfully!');
        setEmail(''); // Clear input fields
        setQuery('');
      } else {
        setResponseMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setResponseMessage('Failed to send your query. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Got questions? We're here to help! Reach out to us for inquiries, partnerships, or support.
        </p>
      </section>

      <section className="contact-info">
        <div className="contact-card">
          <h3 className="contact-card-title">Email Us</h3>
          <p className="contact-card-text">
            For general inquiries, send us an email, and we'll get back to you as soon as possible.
          </p>
          <a href="mailto:aidcircle3@gmail.com" className="contact-button">
            aidcircle3@gmail.com
          </a>
        </div>

        <div className="contact-card">
          <h3 className="contact-card-title">Follow Us on Instagram</h3>
          <p className="contact-card-text">
            Stay updated with our latest campaigns and stories on Instagram.
          </p>
          <a
            href="https://www.instagram.com/aidcircle3/" // Updated Instagram link
            target="_blank" // This ensures the link opens in a new tab
            rel="noopener noreferrer" // This provides additional security when opening the link
            className="contact-button"
          >
            @aidcircle3
          </a>
        </div>
      </section>

      <section className="contact-form">
        <h3 className="form-title">Submit Your Query</h3>
        <form onSubmit={handleSubmit} className="query-form">
          <label htmlFor="email" className="form-label">
            Your Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="query" className="form-label">
            Your Query:
          </label>
          <textarea
            id="query"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input"
            rows="6"
            placeholder="Type your query here"
            required
          ></textarea>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Query'}
          </button>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </section>
    </div>
  );
};

export default Contact;
