/**
* Slideshow.jsx
* =============
* 
* Overview:
* A sophisticated slideshow component designed for a portfolio's hero section,
* featuring smooth transitions between videos and images with a unique circular
* reveal effect. Integrates with a 3D tilt system for enhanced interactivity.
* 
* Technical Highlights:
* - Web Animations API for performant transitions
* - Preloading system for media optimization
* - Responsive design supporting various aspect ratios
* - Circular reveal animation with dynamic radius calculation
* - Integration with 3D tilt effect system
* 
* Dependencies:
* - React 18+
* - TiltContext from HeroSection
* - usePreloader custom hook
* - Web Animations API browser support
* 
* Key Features:
* - Supports both video (MP4) and image content
* - Automatic playback with configurable intervals
* - Loading progress indication
* - Error state handling
* - Hardware-accelerated animations
* - Mobile-optimized video playback
* 
* Performance Considerations:
* - Heavy media should be properly optimized
* - Consider bandwidth limitations for video content
* - Animation performance on lower-end devices
* 
* Browser Support:
* - Modern browsers with Web Animations API
* - Mobile browsers supporting video autoplay
* - No IE11 support
* 
*/

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { TiltContext } from '../HeroSection/HeroSection';
import { usePreloader } from '../../utils/mediaPreloader';
import styles from './Slideshow.module.css';

/**
 * Animation Configuration
 * Timing and visual parameters for the slideshow transitions
 * - INTERVAL: Time between slides (7s for content digestion)
 * - DURATION: Length of transition (3s for smooth reveal)
 * - EASING: Custom bezier curve for natural motion
 * - BLUR: Enhances depth perception during transition
 */
const ANIMATION_CONFIG = {
  INTERVAL: 7000,
  DURATION: 3000,
  EASING: 'cubic-bezier(0.15, 0.85, 0.15, 1.0)',
  INITIAL_BLUR: '0.5rem',
  FINAL_BLUR: '0rem'
};

/**
 * Slideshow Component
 * A dynamic media slideshow with circular reveal transitions and 3D tilt effects
 * 
 * @param {Array} slides - Array of media objects with shape:
 *   {
 *     type: 'image' | 'video',
 *     url: string,
 *     alt?: string
 *   }
 */
export const Slideshow = ({ slides = [] }) => {
  // Preload media and track loading states
  const {
    isLoading,
    progress,
    hasErrors
  } = usePreloader(slides, { stopOnError: false });

  // Initialize with last slide for smooth first transition
  const [currentIndex, setCurrentIndex] = useState(slides.length - 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { tilt } = useContext(TiltContext);

  // Refs for DOM manipulation during animations
  const containerRef = useRef(null);
  const activeSlideRef = useRef(null);
  const nextSlideRef = useRef(null);

  /**
   * Calculates animation dimensions based on container size
   * Ensures consistent circular reveal regardless of aspect ratio
   */
  const calculateAnimationValues = useCallback((container) => {
    const { width, height } = container.getBoundingClientRect();
    return {
      center: { x: width / 2, y: height / 2 },
      endRadius: Math.hypot(width/2, height/2) / Math.min(width, height) * 100
    };
  }, []);

  /**
   * Manages the transition between slides
   * - Prevents multiple simultaneous transitions
   * - Handles circular reveal animation
   * - Maintains proper cleanup
   */
  const triggerTransition = useCallback(() => {
    if (isAnimating || !containerRef.current || !activeSlideRef.current || !nextSlideRef.current) return;

    setIsAnimating(true);
    const nextIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(nextIndex);

    const { center, endRadius } = calculateAnimationValues(containerRef.current);
    
    // Define animation keyframes for reveal effect
    const animation = [
      {
        filter: `blur(${ANIMATION_CONFIG.INITIAL_BLUR})`,
        clipPath: `circle(0% at ${center.x}px ${center.y}px)`
      },
      {
        filter: `blur(${ANIMATION_CONFIG.FINAL_BLUR})`,
        clipPath: `circle(${endRadius}% at ${center.x}px ${center.y}px)`
      }
    ];

    // Setup and execute animation
    const nextSlide = nextSlideRef.current;
    nextSlide.style.filter = ANIMATION_CONFIG.FINAL_BLUR;
    nextSlide.style.clipPath = `circle(0% at ${center.x}px ${center.y}px)`;

    const anim = nextSlide.animate(animation, {
      duration: ANIMATION_CONFIG.DURATION,
      easing: ANIMATION_CONFIG.EASING
    });

    // Cleanup after animation completes
    anim.onfinish = () => {
      setIsAnimating(false);
      if (nextSlide) {
        nextSlide.style.filter = '';
        nextSlide.style.clipPath = '';
      }
    };
  }, [currentIndex, slides.length, isAnimating, calculateAnimationValues]);

  /**
   * Manages automatic slideshow progression
   * Cleans up interval on unmount to prevent memory leaks
   */
  useEffect(() => {
    const interval = setInterval(triggerTransition, ANIMATION_CONFIG.INTERVAL);
    return () => clearInterval(interval);
  }, [triggerTransition]);

  /**
   * Renders appropriate media element based on slide type
   * Handles both video and image content with proper attributes
   */
  const renderMedia = useCallback((slide) => (
    slide.type === 'video' ? (
      <video
        key={slide.url} // Key forces new element on source change
        autoPlay
        muted
        playsInline // Required for mobile autoplay
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
  ), []);

  // Loading and error states
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading... {Math.round(progress)}%</p>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className={styles.errorState}>
        <p>Some media failed to load.</p>
      </div>
      );
  }

  const nextIndex = (currentIndex + 1) % slides.length;

  return (
    <section className={styles.slidesContainer}>
      <div
        ref={containerRef}
        className={styles.mediaContainer}
        style={{
          transform: `scale(${tilt.scale}%) rotateX(${tilt.xRot}deg) rotateY(${tilt.yRot}deg)`
        }}
      >
        {/* Active slide - positioned absolutely for layering */}
        <div 
          ref={activeSlideRef}
          className={styles.mediaWrapper}
          style={{ position: 'absolute' }}
        >
          {renderMedia(slides[currentIndex])}
        </div>
        
        {/* Next slide - prepared for transition */}
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