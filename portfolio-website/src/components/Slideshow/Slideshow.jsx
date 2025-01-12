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
 * Animation configuration for the slideshow transitions
 * 
 * @constant {Object} ANIMATION_CONFIG
 * - INTERVAL: Time between slide transitions (7s)
 * - DURATION: Length of transition (3s for smooth reveal)
 * - PRELOAD_BUFFER: Time before transition to start preloading (3s)
 * - EASING: Custom bezier curve for natural motion
 * - BLUR: Enhances depth perception during transition
 */
const ANIMATION_CONFIG = {
  INTERVAL: 7000,
  DURATION: 3000,
  PRELOAD_BUFFER: 3000,
  EASING: 'cubic-bezier(0.15, 0.85, 0.15, 1.0)',
  INITIAL_BLUR: '0.5rem',
  FINAL_BLUR: '0rem',
  CONTROL_PANEL_HEIGHT: '3rem'
};

/**
 * Slideshow Component
 * A dynamic media slideshow with circular reveal transitions, 3D tilt effects,
 * and advanced preloading capabilities
 * 
 * @param {Array} slides - Array of media objects with shape:
 *   {
 *     type: 'image' | 'video',
 *     url: string,
 *     alt?: string
 *   }
 */
export const Slideshow = ({ slides = [], playbackMode = 'automatic' }) => {
  console.log('Slides order:', slides.map(slide => slide.alt));
  // Preload media and track loading states
  const {
    isLoading,
    progress,
    hasErrors
  } = usePreloader(slides, { stopOnError: false });

  // Initialize with last slide for smooth first transition
  const [currentIndex, setCurrentIndex] = useState(slides.length - 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const { tilt } = useContext(TiltContext);

  // Refs for DOM manipulation during animations
  const containerRef = useRef(null);
  const activeSlideRef = useRef(null);
  const nextSlideRef = useRef(null);

  // Refs for managing preload state
  const preloadingRef = useRef(false);
  const preloadTimeoutRef = useRef(null);

  /**
   * Calculates animation dimensions based on container size
   * Ensures consistent circular reveal regardless of aspect ratio
   * 
   * @param {HTMLElement} container - The container element
   * @returns {Object} Animation values for center point and end radius
   */
  const calculateAnimationValues = useCallback((container) => {
    const { width, height } = container.getBoundingClientRect();
    return {
      center: { x: width / 2, y: height / 2 },
      endRadius: Math.hypot(width/2, height/2) / Math.min(width, height) * 100
    };
  }, []);

  /**
   * Preloads a single media item (image or video) into browser cache
   * 
   * @param {Object} slide - Slide object containing type and url
   * @returns {Promise} Resolves when media is loaded, rejects on error
   */
  const preloadMedia = useCallback((slide) => {
    return new Promise((resolve, reject) => {
      if (slide.type === 'video') {
        const video = document.createElement('video');
        video.src = slide.url;
        video.onloadeddata = () => resolve();
        video.onerror = () => reject();
        video.load();
      } else {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = slide.url;
      }
    });
  }, []);

  /**
   * Initiates preloading of the next slide in sequence
   * Includes guard against multiple simultaneous preload attempts
   */
  const preloadNextSlide = useCallback(() => {
    if (preloadingRef.current) return;
    
    const nextIndex = (currentIndex + 1) % slides.length;
    preloadingRef.current = true;

    preloadMedia(slides[nextIndex])
      .catch(error => console.warn('Failed to preload next slide:', error))
      .finally(() => {
        preloadingRef.current = false;
      });
  }, [currentIndex, slides, preloadMedia]);

  /**
   * Manages the transition between slides
   * - Prevents multiple simultaneous transitions
   * - Handles circular reveal animation
   * - Maintains proper cleanup
   * - Schedules preloading of next slide
   */
  const triggerTransition = useCallback((targetIndex = null) => {
    if (isAnimating || !containerRef.current || !activeSlideRef.current || !nextSlideRef.current) return;

    // Increment key to reset any GIFs
    setGifKey(prev => prev + 1);

    setIsAnimating(true);
    const nextIndex = targetIndex !== null ? targetIndex : (currentIndex + 1) % slides.length;
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

    // Cleanup after animation and schedule next preload
    anim.onfinish = () => {
      setIsAnimating(false);
      if (nextSlide) {
        nextSlide.style.filter = '';
        nextSlide.style.clipPath = '';
      }
      
      // Schedule preloading of the next slide
      const futureIndex = (nextIndex + 1) % slides.length;
      preloadTimeoutRef.current = setTimeout(() => {
        preloadMedia(slides[futureIndex]);
      }, ANIMATION_CONFIG.INTERVAL - ANIMATION_CONFIG.PRELOAD_BUFFER);
    };
  }, [currentIndex, slides.length, isAnimating, calculateAnimationValues, preloadMedia]);

  /**
   * Manages automatic slideshow progression and preloading
   * Cleans up intervals and timeouts on unmount to prevent memory leaks
   */
  useEffect(() => {
    let interval;
    if (playbackMode === 'automatic') {
      // Only set up interval for automatic mode
      interval = setInterval(triggerTransition, ANIMATION_CONFIG.INTERVAL);
    }
    
    // Still preload next slide regardless of mode
    const initialPreloadTimeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      preloadMedia(slides[nextIndex]);
    }, ANIMATION_CONFIG.INTERVAL - ANIMATION_CONFIG.PRELOAD_BUFFER);
  
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      clearTimeout(initialPreloadTimeout);
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [triggerTransition, currentIndex, slides, preloadMedia, playbackMode]);

  useEffect(() => {
    console.log({
      currentIndex,
      displayedSlideURL: slides[currentIndex]?.url,
      nextSlideURL: slides[(currentIndex + 1) % slides.length]?.url
    });
  }, [currentIndex, slides]);

  const handleSlideClick = useCallback(() => {
    if (playbackMode !== 'manual' || isAnimating) return;
    triggerTransition();
  }, [playbackMode, isAnimating, triggerTransition]);

  const handleSlideSelect = useCallback((index) => {
    if (isAnimating) return;
    triggerTransition(index);
  }, [isAnimating, triggerTransition]);

  /**
   * Renders appropriate media element based on slide type
   * Handles both video and image content with proper attributes
   * 
   * @param {Object} slide - Slide object containing type and url
   * @returns {ReactElement} Video or image element
   */
  // Modify renderMedia to use the key for GIFs:
  const renderMedia = useCallback((slide) => {
    if (slide.type === 'video') {
      return (
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
      );
    } else {
      // For GIFs, use the gifKey state to force remount
      const isGif = slide.url.toLowerCase().endsWith('.gif');
      return (
        <img
          key={isGif ? `${slide.url}-${gifKey}` : slide.url}
          src={slide.url}
          alt={slide.alt || 'Slideshow Image'}
          className={styles.mediaContent}
        />
      );
    }
  }, [gifKey]);

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
    <div 
      className={`${styles.slidesContainer} ${playbackMode === 'manual' ? 'action' : ''}`}
      onClick={handleSlideClick}
    >
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

      {/* Control panel */}
      {playbackMode === 'manual' && (
        <div className={styles.controlPanel}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.slideIndicator} ${index === (currentIndex + 1) % slides.length ? styles.active : ''} action`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent container click from firing
                handleSlideSelect(((index - 1) + slides.length) % slides.length);
              }}
              disabled={isAnimating}
              aria-label={`Go to slide ${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};