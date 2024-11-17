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

  const renderMedia = (slide) => {
    return ((slide.type === 'video') ?
      <video
        autoPlay
        muted
        playsInline
        loop
        className={styles.mediaContent}
      >
        <source src={slide.url} type='video/mp4' />
      </video> :
      <img 
        src={slide.url}
        alt={slide.alt || 'Slideshow Image'}
        className={styles.mediaContent}
      />

    )
  }

  return (
    <section className={styles.slidesContainer}>
      {/* Decorative frame was here */}
      <div className={`${styles.mediaContainer} ${isTransitioning ? 'fade-out' : ''}`}>
        {renderMedia(slides[currentIndex])}
      </div>
    </section>
  )
}