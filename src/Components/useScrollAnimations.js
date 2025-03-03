// useScrollAnimations.js
import { useEffect } from 'react';

const useScrollAnimations = () => {
  useEffect(() => {
    const scrollableSections = document.querySelectorAll('.scrollable-section');

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // Stop observing after it's in view
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    scrollableSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      // Cleanup observer on component unmount
      scrollableSections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
};

export default useScrollAnimations;
