import React, { useContext } from 'react';
import { useState, useEffect, useCallback } from 'react';
import styles from './Slideshow.module.css';
import { TiltContext } from '../HeroSection/HeroSection';
import { usePreloader } from '../../mediaPreloader';

export const Slideshow = ({ slides = [] }) => {
  const {
    isLoading,
    progress,
    hasErrors
  } = usePreloader(slides, {
    stopOnError: false
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const { tilt, setTilt } = useContext(TiltContext);

  const INTERVAL_DURATION = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, INTERVAL_DURATION);
    return () => clearInterval(interval);
  }, [slides.length]);

  const renderMedia = useCallback((slide) => {
    return (
      slide.type === 'video' ? (
        <video
          autoPlay
          muted
          playsInline
          loop
          className={styles.mediaContent}
        >
          <source src={slide.url} type='video/mp4' />
        </video>
      ) : (
        <img
          src={slide.url}
          alt={slide.alt || 'Slideshow Image'}
          className={styles.mediaContent}
        />
      )
    );
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading... {Math.round(progress)}%</p>
      </div>
    );
  }

  if (hasErrors) {
    return <div>Some media failed to load.</div>;
  }

  return (
    <section className={styles.slidesContainer}>
      <div
        className={styles.mediaContainer}
        style={{
          transform: `
            scale(${tilt.scale}%)
            rotateX(${tilt.xRot}deg)
            rotateY(${tilt.yRot}deg)
          `
        }}
      >
          {renderMedia(slides[currentIndex])}
      </div>
    </section>
  );
};