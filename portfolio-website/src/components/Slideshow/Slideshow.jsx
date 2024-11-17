import React from 'react';
import { useState, useEffect, useRef } from 'react';

import styles from './Slideshow.module.css';

export const Slideshow = ({ slides = []}) => {
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const TRANSITION_DURATION = 2000; // Duration of the transition effect
  const INTERVAL_DURATION = 8000; // Duration that each slide is presented.

  const FIRST_HALF = 'cubic-bezier(0.4, 0.02, 0.95, 0.3)';
  const SECOND_HALF = 'cubic-bezier(0.05, 0.7, 0.3, 0.98)';

  useEffect(() => {
    const interval = setInterval(startTransition, INTERVAL_DURATION);
    return () => clearInterval(interval);
  }, [slides.length]);

  const startTransition = () => {
    if (!containerRef.current) 
      return;

    if (rotationDegrees === -360)
      setRotationDegrees(0);

    containerRef.current.style.setProperty('--flip-duration', `${TRANSITION_DURATION/2}ms`);
    containerRef.current.style.setProperty('--flip-timing', FIRST_HALF)

    setRotationDegrees(prev => prev - 90);

    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);

      if (containerRef.current) {
        containerRef.current.style.setProperty('--flip-timing', SECOND_HALF);
        setRotationDegrees(prev => prev - 90);
      }
    }, TRANSITION_DURATION/2);
  }

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
      <div 
        ref={containerRef}
        className={`${styles.mediaContainer} ${styles.flipping}`} 
        style={{transform: `rotateY(${rotationDegrees}deg)`}}
      >
        {/* Current slide side */}
        <div className={`${styles.slideWrapper} ${styles.currentSlide}`}>
          {renderMedia(slides[currentIndex])}
          {/* Decorative frame was here */}
        </div>

        {/* Next slide side (back face) */}
        <div className={`${styles.slideWrapper} ${styles.nextSlide}`}>
          {renderMedia(slides[currentIndex])}
          {/* Decorative frame was here */}
        </div>
      </div>
    </section>
  )
}