import React from 'react';
import '../Styles/styles.css'; // Ensure consistent styling

// Importing gallery images
import palestineImage from '../Images/visual-karsa-G6XMQBwdK6g-unsplash.jpg';
import clothesImage from '../Images/premium_photo-1661964021703-59bbdcdbfdab.avif';
import foodImage from '../Images/premium_photo-1683141173692-aba4763bce41.avif';
import waterImage from '../Images/premium_photo-1681492244799-f559a49e767f.avif';
import truckImage from '../Images/joel-muniz-BErJJL_KsjA-unsplash.jpg';
import childrenImage from '../Images/bill-wegener-P0OJbBJ1ZTM-unsplash.jpg';
import cartonsImage from '../Images/premium_photo-1683140538884-07fb31428ca6.avif';

const galleryData = [
  {
    id: 1,
    title: 'Palestine Fundraiser',
    description: 'A successful campaign to support families in Palestine with food and medical supplies.',
    image: palestineImage,
  },
  {
    id: 2,
    title: 'Clothes Distribution',
    description: 'Warm clothing provided to those in need during the winter season.',
    image: clothesImage,
  },
  {
    id: 3,
    title: 'Food Drive',
    description: 'Meals and food supplies distributed to underprivileged families.',
    image: foodImage,
  },
  {
    id: 4,
    title: 'Clean Water Initiative',
    description: 'Providing clean drinking water to communities in remote areas.',
    image: waterImage,
  },
  {
    id: 5,
    title: 'Carton Distribution',
    description: 'Truckloads of supplies distributed to communities in need.',
    image: truckImage,
  },
  {
    id: 6,
    title: 'Children’s Feeding Program',
    description: 'Ensuring that children in need receive nutritious meals.',
    image: childrenImage,
  },
  {
    id: 7,
    title: 'Carton Distribution Campaign',
    description: 'Boxes filled with essential goods were handed out to families.',
    image: cartonsImage,
  },
];

const Gallery = () => {
  return (
    <div className="gallery-page">
      <section className="gallery-header">
        <h1 className="gallery-title">Previous Campaigns</h1>
        <p className="gallery-description">
          Take a look at some of the impactful campaigns we've conducted in the past, bringing hope and relief to those in need.
        </p>
      </section>

      <section className="gallery-grid">
        {galleryData.map((item) => (
          <div className="gallery-card" key={item.id}>
            <img src={item.image} alt={item.title} className="gallery-image" />
            <div className="gallery-info">
              <h3 className="gallery-title">{item.title}</h3>
              <p className="gallery-description">{item.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Gallery;
