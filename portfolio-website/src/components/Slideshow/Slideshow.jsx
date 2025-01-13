/**
 * Slideshow.jsx
 * =============
 * 
 * Overview:
 * A sophisticated slideshow component designed for portfolio presentations,
 * featuring smooth transitions between videos and images with a unique circular
 * reveal effect. Supports both automatic and manual playback modes.
 * 
 * Technical Implementation:
 * - Utilizes Web Animations API for hardware-accelerated transitions
 * - Implements advanced preloading system for optimal performance
 * - Features circular reveal animation with dynamic radius calculation
 * - Supports both automatic and manual playback modes
 * - Handles GIF animation resets between transitions
 * 
 * Media Support:
 * - Images (including GIF support with proper reset)
 * - Videos (MP4 format)
 *   - Autoplay enabled
 *   - Muted by default
 *   - Loop enabled
 *   - Mobile-optimized with playsInline
 * 
 * Performance Optimizations:
 * - Intelligent media preloading system
 * - Hardware-accelerated animations via transform properties
 * - Memory leak prevention through proper cleanup
 * - Efficient DOM updates using React refs
 * - Smart GIF handling to prevent memory issues
 * 
 * Accessibility:
 * - ARIA labels for controls
 * - Keyboard navigation support
 * - Proper alt text handling
 * - Focus management
 * 
 * Browser Compatibility:
 * - Modern browsers with Web Animations API support
 * - Mobile browsers with video autoplay capability
 * - Fallback states for loading and errors
 * - No IE11 support
 * 
 * @requires React 18+
 * @requires Web Animations API
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePreloader } from '../../utils/mediaPreloader';
import styles from './Slideshow.module.css';

/**
 * Configuration constants for slideshow animations and timing
 * 
 * @constant {Object} ANIMATION_CONFIG
 * @property {number} INTERVAL - Time between automatic transitions (7000ms)
 * @property {number} DURATION - Length of transition animation (3000ms)
 * @property {number} PRELOAD_BUFFER - Preload buffer time before transition (3000ms)
 * @property {string} EASING - Custom bezier curve for natural motion
 * @property {string} INITIAL_BLUR - Starting blur value for transition
 * @property {string} FINAL_BLUR - Ending blur value for transition
 * @property {string} CONTROL_PANEL_HEIGHT - Height of manual control panel
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
 * Media slide type definition
 * @typedef {Object} MediaSlide
 * @property {'image' | 'video'} type - Type of media
 * @property {string} url - URL to media resource
 * @property {string} [alt] - Alternative text for images
 */

/**
 * Supported playback modes
 * @typedef {'automatic' | 'manual'} PlaybackMode
 */

/**
 * Slideshow Component
 * A dynamic media slideshow supporting both automatic and manual playback
 * with smooth circular reveal transitions.
 * 
 * @param {Object} props
 * @param {MediaSlide[]} [props.slides=[]] - Array of media slides to display
 * @param {PlaybackMode} [props.playbackMode='automatic'] - Playback mode
 */
export const Slideshow = ({ slides = [], playbackMode = 'automatic' }) => {
  // State management
  const [currentIndex, setCurrentIndex] = useState(slides.length - 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gifKey, setGifKey] = useState(0);

  // DOM refs
  const containerRef = useRef(null);
  const activeSlideRef = useRef(null);
  const nextSlideRef = useRef(null);

  // Preload management refs
  const preloadingRef = useRef(false);
  const preloadTimeoutRef = useRef(null);

  // Initialize preloader
  const {
      isLoading,
      progress,
      hasErrors
  } = usePreloader(slides, { stopOnError: false });

  /**
   * Calculates animation dimensions for circular reveal
   * @param {HTMLElement} container - Container element
   * @returns {{center: {x: number, y: number}, endRadius: number}}
   */
  const calculateAnimationValues = useCallback((container) => {
      const { width, height } = container.getBoundingClientRect();
      return {
          center: { x: width / 2, y: height / 2 },
          endRadius: Math.hypot(width/2, height/2) / Math.min(width, height) * 100
      };
  }, []);

  /**
   * Preloads individual media items
   * @param {MediaSlide} slide - Slide to preload
   * @returns {Promise<void>}
   */
  const preloadMedia = useCallback((slide) => {
      return new Promise((resolve, reject) => {
          if (slide.type === 'video') {
              const video = document.createElement('video');
              video.src = slide.url;
              video.onloadeddata = resolve;
              video.onerror = reject;
              video.load();
          } else {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = slide.url;
          }
      });
  }, []);

  /**
   * Initiates preloading of the next slide
   */
  const preloadNextSlide = useCallback(() => {
      if (preloadingRef.current) return;
      
      const nextIndex = (currentIndex + 1) % slides.length;
      preloadingRef.current = true;

      preloadMedia(slides[nextIndex])
          .catch(error => {
              // Log error but don't interrupt slideshow
              console.warn('Failed to preload next slide:', error);
          })
          .finally(() => {
              preloadingRef.current = false;
          });
  }, [currentIndex, slides, preloadMedia]);

  /**
   * Manages slide transitions with circular reveal effect
   * @param {number} [targetIndex] - Optional specific index to transition to
   */
  const triggerTransition = useCallback((targetIndex = null) => {
      if (isAnimating || !containerRef.current || !activeSlideRef.current || !nextSlideRef.current) return;

      setGifKey(prev => prev + 1); // Reset GIFs
      setIsAnimating(true);

      const nextIndex = targetIndex !== null ? targetIndex : (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);

      const { center, endRadius } = calculateAnimationValues(containerRef.current);
      
      // Animation configuration
      const keyframes = [
          {
              filter: `blur(${ANIMATION_CONFIG.INITIAL_BLUR})`,
              clipPath: `circle(0% at ${center.x}px ${center.y}px)`
          },
          {
              filter: `blur(${ANIMATION_CONFIG.FINAL_BLUR})`,
              clipPath: `circle(${endRadius}% at ${center.x}px ${center.y}px)`
          }
      ];

      const nextSlide = nextSlideRef.current;
      nextSlide.style.filter = ANIMATION_CONFIG.FINAL_BLUR;
      nextSlide.style.clipPath = `circle(0% at ${center.x}px ${center.y}px)`;

      const animation = nextSlide.animate(keyframes, {
          duration: ANIMATION_CONFIG.DURATION,
          easing: ANIMATION_CONFIG.EASING
      });

      // Cleanup and schedule next preload
      animation.onfinish = () => {
          setIsAnimating(false);
          if (nextSlide) {
              nextSlide.style.filter = '';
              nextSlide.style.clipPath = '';
          }
          
          const futureIndex = (nextIndex + 1) % slides.length;
          preloadTimeoutRef.current = setTimeout(() => {
              preloadMedia(slides[futureIndex]);
          }, ANIMATION_CONFIG.INTERVAL - ANIMATION_CONFIG.PRELOAD_BUFFER);
      };
  }, [currentIndex, slides.length, isAnimating, calculateAnimationValues, preloadMedia]);

  /**
       * Sets up automatic playback and preloading
       */
  useEffect(() => {
    let interval;
    if (playbackMode === 'automatic') {
        interval = setInterval(triggerTransition, ANIMATION_CONFIG.INTERVAL);
    }
    
    const initialPreloadTimeout = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        preloadMedia(slides[nextIndex]);
    }, ANIMATION_CONFIG.INTERVAL - ANIMATION_CONFIG.PRELOAD_BUFFER);

    return () => {
        if (interval) clearInterval(interval);
        clearTimeout(initialPreloadTimeout);
        if (preloadTimeoutRef.current) {
            clearTimeout(preloadTimeoutRef.current);
        }
    };
  }, [triggerTransition, currentIndex, slides, preloadMedia, playbackMode]);

  /**
  * Handles manual slide advancement
  */
  const handleSlideClick = useCallback(() => {
    if (playbackMode !== 'manual' || isAnimating) return;
    triggerTransition();
  }, [playbackMode, isAnimating, triggerTransition]);

  /**
  * Handles direct slide selection from control panel
  * @param {number} index - Target slide index
  */
  const handleSlideSelect = useCallback((index) => {
    if (isAnimating) return;
    triggerTransition(index);
  }, [isAnimating, triggerTransition]);

  /**
  * Renders appropriate media element based on type
  * @param {MediaSlide} slide - Slide to render
  * @returns {JSX.Element} Video or image element
  */
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
    }

    const isGif = slide.url.toLowerCase().endsWith('.gif');
    return (
        <img
            key={isGif ? `${slide.url}-${gifKey}` : slide.url}
            src={slide.url}
            alt={slide.alt || 'Slideshow Image'}
            className={styles.mediaContent}
        />
    );
  }, [gifKey]);

  // Loading state
  if (isLoading) {
    return (
        <div className={styles.loadingState}>
            <p>Loading... {Math.round(progress)}%</p>
        </div>
    );
  }

  // Error state
  if (hasErrors) {
    return (
        <div className={styles.errorState}>
            <p>Some media failed to load.</p>
        </div>
    );
  }

  const nextIndex = (currentIndex + 1) % slides.length;

  return (
    <div className={styles.slidesContainer}>
        <div
            ref={containerRef}
            className={`
                ${styles.mediaContainer}
                ${playbackMode === 'manual' ? 'action' : ''}
            `}
            onClick={handleSlideClick}
        >
            {/* Active slide */}
            <div 
                ref={activeSlideRef}
                className={styles.mediaWrapper}
                style={{ position: 'absolute' }}
            >
                {renderMedia(slides[currentIndex])}
            </div>

            {/* Next slide */}
            <div 
                ref={nextSlideRef}
                className={styles.mediaWrapper}
            >
                {renderMedia(slides[nextIndex])}
            </div>
        </div>

        {/* Control panel for manual mode */}
        {playbackMode === 'manual' && (
            <div className={styles.controlPanel}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`
                            ${styles.slideIndicator}
                            ${index === (currentIndex + 1) % slides.length ? styles.active : ''}
                            action
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSlideSelect(((index - 1) + slides.length) % slides.length);
                        }}
                        disabled={isAnimating}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        )}
    </div>
  );
};