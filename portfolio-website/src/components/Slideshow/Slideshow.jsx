import React, { useContext } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Slideshow.module.css';
import { TiltContext } from '../HeroSection/HeroSection';
import { usePreloader } from '../../mediaPreloader';

export const Slideshow = ({ slides = [] }) => {
  const {
    isLoading,
    progress,
    hasErrors,
    errors
  } = usePreloader(slides, {
    stopOnError: false
  });
  
  const [currentIndex, setCurrentIndex] = useState(slides.length - 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { tilt, setTilt } = useContext(TiltContext);
  const containerRef = useRef(null);
  const activeSlideRef = useRef(null);
  const nextSlideRef = useRef(null);
  const INTERVAL_DURATION = 7000;

  useEffect(() => {
    if (errors.length > 0) {
      console.log('Loading errors:', errors);
    }
  }, [errors]);

  const triggerTransition = useCallback(() => {
    if (isAnimating || !containerRef.current || ! activeSlideRef.current || !nextSlideRef.current) {
      console.log('Transition blocked:', { 
        isAnimating, 
        hasContainer: !!containerRef.current,
        hasActiveSlide: !!activeSlideRef.current,
        hasNextSlide: !!nextSlideRef.current 
      });
      return;
    }
    
    const nextIndex = (currentIndex + 1) % slides.length;
    console.log('Transitioning to index:', nextIndex);
    setIsAnimating(true);
    setCurrentIndex(nextIndex);
    
    // Get container dimensions for center calculation
    const { width, height } = containerRef.current.getBoundingClientRect();
    const x = width / 2;
    const y = height / 2;
    
    // Create and start animation
    const startRadius = 0;
    const endRadius = Math.hypot(width/2, height/2) / Math.min(width, height) * 100;
    const duration = 3000;
    
    const animation = [
      { 
        filter: `blur(0.5rem)`,
        clipPath: `circle(${startRadius}% at ${x}px ${y}px)` 
      },
      { 
        filter: `blur(0rem)`,
        clipPath: `circle(${endRadius}% at ${x}px ${y}px)` 
      },
    ];
    
    const timing = {
      duration,
      easing: 'cubic-bezier(0.15, 0.85, 0.15, 1.0)',
    };
    
    // Prepare next slide
    nextSlideRef.current.style.filter = `blur(0rem)`;
    nextSlideRef.current.style.clipPath = `circle(${startRadius}% at ${x}px ${y}px)`;
    
    const anim = nextSlideRef.current.animate(animation, timing);
    
    anim.onfinish = () => {
      setIsAnimating(false);
      if (nextSlideRef.current) {
        nextSlideRef.current.style.filter = '';
        nextSlideRef.current.style.clipPath = '';
      }
    };
  }, [currentIndex, slides.length, isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerTransition();
    }, INTERVAL_DURATION);
    
    return () => clearInterval(interval);
  }, [triggerTransition, INTERVAL_DURATION]);

  const renderMedia = useCallback((slide) => {
    return slide.type === 'video' ? (
      <video
        key={slide.url}
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

  const nextIndex = (currentIndex + 1) % slides.length;

  return (
    <section className={styles.slidesContainer}>
      <div
        ref={containerRef}
        className={styles.mediaContainer}
        style={{
          transform: `
            scale(${tilt.scale}%)
            rotateX(${tilt.xRot}deg)
            rotateY(${tilt.yRot}deg)
          `,
        }}
      >
        {/* Current Slide */}
        <div 
          ref={activeSlideRef}
          className={styles.mediaWrapper}
          style={{ position: 'absolute' }}
        >
          {renderMedia(slides[currentIndex])}
        </div>
        
        {/* Next Slide (hidden by default) */}
        <div 
          ref={nextSlideRef}
          className={styles.mediaWrapper}
        >
          {renderMedia(slides[nextIndex])}
        </div>
      </div>
    </section>
  );
};