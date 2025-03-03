import React, { useState } from 'react';
import '../Styles/styles.css'; // Ensure the styles are applied

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // FAQ data
  const faqs = [
    { question: 'What is Aid Circle?', answer: 'Aid Circle is a global community that connects individuals to support various charitable causes, humanitarian efforts, and social projects.' },
    { question: 'How can I get involved?', answer: 'You can get involved by donating, volunteering, or spreading awareness about the causes we support. Join us in making a difference.' },
    { question: 'Is my donation secure?', answer: 'Yes, we use trusted payment platforms that ensure your donations are secure and go directly to the causes you care about.' },
    { question: 'Can I volunteer remotely?', answer: 'Yes, many of our projects offer remote volunteering opportunities. Visit our "Services" page to learn more about how you can help.' },
    { question: 'When was the platform created?', answer: 'The platform was created to provide a better way for people to donate to charities and track the impact of their contributions.' },
    { question: 'What inspired the creation of this platform?', answer: 'The platform was created to address the need for a transparent and efficient way for people to donate, track donations, and see the real-world impact of their contributions.' },
    { question: 'How has the platform evolved over time?', answer: 'It started as a simple donation platform but has grown to include features like donation analytics, impact reports, and role-based access for better management.' },
    { question: 'What was the first charity featured on the platform?', answer: 'The first charity featured on the platform was chosen based on its impact and transparency, providing a reliable and worthy cause for the initial launch.' },
    { question: 'How has user feedback influenced the platform?', answer: 'User feedback has helped improve the platform’s features, such as making the donation process easier, enhancing security, and providing clearer donation impact reports.' },
    { question: 'What is this platform for?', answer: 'This platform allows people to donate to charities, track their donations, and see the impact of their contributions.' },
    { question: 'How can users donate?', answer: 'Users can browse different charity campaigns on the platform and make secure donations.' },
    { question: 'Can users track their donations?', answer: 'Yes, users can track their donations and view donation trends and reports.' },
    { question: 'What can admins do on the platform?', answer: 'Admins can manage charity details, monitor donations, and generate reports on donations and their impact.' },
    { question: 'Are there any special features?', answer: 'The platform includes notifications, role-based access, and integration with external APIs for better user experience and transparency.' }
  ];

  return (
    <div className="about-page">
      {/* About Section */}
      <section className="about-section">
        <h1>About Aid Circle</h1>
        <p>Aid Circle is a non-profit platform that connects donors with meaningful charitable causes around the globe. Our mission is to provide a transparent and seamless way for individuals to contribute to social impact efforts.</p>
        <p>By joining our platform, you become part of a growing community of philanthropists, volunteers, and social changemakers committed to improving the world.</p>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => handleToggle(index)}>
                {faq.question}
                <span className="faq-icon">
                  {activeIndex === index ? '▲' : '▼'}
                </span>
              </button>
              <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
