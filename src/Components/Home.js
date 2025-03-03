import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/styles.css';
import donateImage from '../Images/katt-yukawa-K0E6E0a0R3A-unsplash.jpg'; 
import secondImage from '../Images/tim-marshall-cAtzHUz7Z8g-unsplash.jpg';
import thirdImage from '../Images/joel-muniz-BErJJL_KsjA-unsplash.jpg';import logo from '../Images/AIDCIRCLE-removebg-preview.png'; 
import useScrollAnimations from './useScrollAnimations'; 
import scrollImage from '../Images/Untitled_design-removebg-preview.png'; 
import scrollImage2 from '../Images/Untitled_design__2_-removebg-preview.png'; 
import scrollImage3 from '../Images/Untitled_design__1_-removebg-preview.png'; 
import Modal from './Modal';
import Layout from './Layout'; // Import the Layout component

function Home() {
  useScrollAnimations(); // Hook for any custom scroll animations

  const [showModal, setShowModal] = useState(true);
  const [modalClosed, setModalClosed] = useState(false);

  const [donationCount, setDonationCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const closeModal = () => {
    setShowModal(false);
    setModalClosed(true);
  };

  useEffect(() => {
    if (!modalClosed) return;

    const donationTimer = setInterval(() => {
      setDonationCount((prev) => {
        if (prev < 20) return prev + 1;
        clearInterval(donationTimer);
        return prev;
      });
    }, 100);

    const volunteerTimer = setInterval(() => {
      setVolunteerCount((prev) => {
        if (prev < 20) return prev + 1;
        clearInterval(volunteerTimer);
        return prev;
      });
    }, 150);

    const eventTimer = setInterval(() => {
      setEventCount((prev) => {
        if (prev < 20) return prev + 1;
        clearInterval(eventTimer);
        return prev;
      });
    }, 200);

    return () => {
      clearInterval(donationTimer);
      clearInterval(volunteerTimer);
      clearInterval(eventTimer);
    };
  }, [modalClosed]);

  
  useEffect(() => {
    handleScrollAnimation();
  
    // Cleanup function
    return () => {
      const elements = document.querySelectorAll('.scroll-card1, .scroll-card2, .scroll-card3');
      const observer = new IntersectionObserver(() => {}); // Empty observer
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  let lastScrollY = 0;

 const handleScrollAnimation = () => {
  const elements = document.querySelectorAll('.scroll-card1, .scroll-card2, .scroll-card3');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const currentScrollY = window.scrollY;

        if (entry.isIntersecting) {
          // Check if scrolling down
          if (currentScrollY > lastScrollY) {
            entry.target.classList.add('animate');
          }
        }
      });

      // Update lastScrollY for the next scroll direction check
      lastScrollY = window.scrollY;
    },
    { threshold: 0.5 }
  );

  elements.forEach((el) => observer.observe(el));
};

    
  const images = [
    `url(${donateImage})`,  // Use the imported image as a URL
    `url(${secondImage})`,  // Use the imported image as a URL
    `url(${thirdImage})`,   // Use the imported image as a URL
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Change the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);
  return (

    <div className={`home ${showModal ? 'blocked' : ''}`}>
      <Modal show={showModal} onClose={closeModal} />
      {showModal && <div className="overlay"></div>}

      <header>
        {/* Optional header content */}
      </header>

      <section
        className="hero"
        style={{
          backgroundImage: images[currentImage], // Dynamically set background image
        }}
      >
        <div className="hero-content">
          <h1>Change a Life, <span> Change the World </span></h1>
          <p>Join us in bringing hope to those who need it most. Together, we can make the world a better place.</p>
          <div className="hero-buttons">
 {/* Link around the button */}
 <Link to="/login">
              <button className="cta-button3">Donate Now</button>
            </Link>          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>{donationCount}+ Donations Have Done</h3>
        </div>
        <div className="feature-card">
          <h3>{volunteerCount}+ Volunteers Joined</h3>
        </div>
        <div className="feature-card">
          <h3>{eventCount}+ Events Held</h3>
        </div>
      </section>

      <section className="donation-impact">
  {/* First Section */}
  <div className="donation-impact-section scroll-card1">
    <div className="donation-card1">
      <div className="donation-text-from-left">
        <h3>Empower Lives</h3>
        <p>
          "At Aid Circle, we believe that together, we can create a brighter
          future for those in need. Whether it’s supporting children, helping
          the homeless, or providing medical care, your kindness makes a
          difference."
        </p>
      </div>
      <div className="donation-image-from-right">
        <img src={scrollImage} alt="Impact" />
      </div>
    </div>
  </div>

  {/* Second Section */}
  <div className="donation-impact-section scroll-card2">
    <div className="donation-card2">
      <div className="donation-image-from-left">
        <img src={scrollImage2} alt="Support" />
      </div>
      <div className="donation-text-from-left">
        <h3>Transform Communities</h3>
        <p>
          "By donating, you contribute to a world where kindness and support
          are shared. Provide food, shelter, or education to someone in need.
          Your generosity makes change happen."
        </p>
      </div>
    </div>
  </div>

  {/* Third Section */}
  <div className="donation-impact-section scroll-card3">
    <div className="donation-card3">
      <div className="donation-text-from-left">
        <h3>Restore Hope</h3>
        <p>
          "Join a global community working together for a positive difference.
          Together, we can bring hope, restore lives, and change the world.
          Thank you for making a difference with us!"
        </p>
      </div>
      <div className="donation-image-from-right">
        <img src={scrollImage3} alt="Hope" />
      </div>
    </div>
  </div>
</section>

    </div>

  );
}

export default Home;
