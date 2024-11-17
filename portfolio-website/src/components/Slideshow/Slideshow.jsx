import React from 'react';
import { useState, useEffect } from 'react';

import styles from './Slideshow.module.css';

export const Slideshow = ({ slides = []}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionDuration = 1000; // Duration of the transition effect
  const intervalDuration = 8000; // Duration that each slide is presented.

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, transitionDuration);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className={styles.slidesContainer}>
      <div>
        <div/>
        <div>
          <image>
            
          </image>
        </div>
      </div>
    </section>
  )
}