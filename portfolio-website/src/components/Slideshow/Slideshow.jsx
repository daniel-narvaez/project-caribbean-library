import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Slideshow.module.css';
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
  const containerRef = useRef(null);
  const frameRef = useRef(); // For requestAnimationFrame
  const [tiltTransform, setTiltTransform] = useState({
    scale: 100,
    xRot: 0,
    yRot: 0
  });

  const INTERVAL_DURATION = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, INTERVAL_DURATION);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Debounced transform update
  const updateTransform = useCallback((newTransform) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setTiltTransform(newTransform);
    });
  }, []);

  // Memoized mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Get relative mouse position
    const xVal = e.clientX - rect.left;
    const yVal = e.clientY - rect.top;

    // Calculate rotation values
    const yRotation = 10 * ((xVal - width / 2) / width);
    const xRotation = -10 * ((yVal - height / 2) / height);

    updateTransform({
      scale: 104.2,
      xRot: xRotation,
      yRot: yRotation
    });
  }, [updateTransform]);

  // Memoized mouse leave handler
  const handleMouseLeave = useCallback(() => {
    updateTransform({
      scale: 100,
      xRot: 0,
      yRot: 0,
    });
  }, [updateTransform]);

  // Cleanup requestAnimationFrame on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

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
        ref={containerRef}
        className={styles.mediaContainer}
        style={{
          transform: `
            scale(${tiltTransform.scale}%)
            rotateX(${tiltTransform.xRot}deg)
            rotateY(${tiltTransform.yRot}deg)
          `
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
          {renderMedia(slides[currentIndex])}
      </div>
    </section>
  );
};