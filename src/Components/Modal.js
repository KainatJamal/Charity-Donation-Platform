import React from 'react';
import '../Styles/styles.css'; // Import custom styles
import backgroundImage from '../Images/Modaloverlay.png'; // Ensure this file exists in the Images folder

const Modal = ({ show, onClose }) => {
  if (!show) return null; // If show is false, don't render the modal

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Cross icon */}
        <button className="close-button6" onClick={onClose}>
          &times;
        </button>
        
        {/* Continue Button */}
        <button className="continue-button" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Modal;
