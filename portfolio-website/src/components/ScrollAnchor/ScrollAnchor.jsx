/**
 * ScrollAnchor.jsx
 * ===============
 * 
 * Overview:
 * A floating scroll navigation component that morphs between up and down states.
 * Features smooth scroll animation between sections, touch-friendly interactions,
 * and GSAP-powered morphing animations.
 * 
 * Key Features:
 * - Morphing SVG animations using GSAP
 * - Smooth scroll navigation between chapters
 * - Touch and pointer event handling
 * - Programmatic vs manual scroll detection
 * - Color transitions for different states
 * 
 * Technical Implementation:
 * - GSAP timeline for complex SVG morphing
 * - RequestAnimationFrame for performance
 * - Proper cleanup of timeouts and events
 * - Custom smooth scroll with easing
 * 
 * Dependencies:
 * - GSAP for animations
 * - Chapters context for section management
 * - SmoothScroll utility for scrolling
 * - CSS modules for styling
 */

import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import gsap from 'gsap';
import styles from './ScrollAnchor.module.css';
import { useChapters } from '../../contexts/ChaptersContext';
import { useSmoothScroll } from '../../utils/useSmoothScroll';
import { DeviceContext } from '../../contexts/DeviceContext';

// SVG path definitions for arrow states
const SVG_PATHS = {
  UP: {
    top: "M216.667,133.333L196.641,133.333L150,63.381L114.469,116.667L145.481,116.667L134.342,133.333L83.333,133.333L150,33.333L216.667,133.333Z",
    bottom: "M134.342,266.667L134.342,236.659L141.655,225.693L141.654,152.449L165.498,116.688L175.521,131.71L158.321,157.497L158.321,230.741L134.342,266.667Z"
  },
  DOWN: {
    top: "M165.623,33.334L165.645,63.341L158.333,74.308L158.333,147.552L134.489,183.313L124.467,168.29L141.667,142.504L141.667,69.26L165.623,33.334Z",
    bottom: "M83.333,166.667L103.358,166.667L150,236.617L185.531,183.333L154.509,183.333L165.623,166.667L216.667,166.667L150,266.667L83.333,166.667Z"
  }
};

// Configuration for animations and styles
const INITIAL_ARROW_CONFIG = {
  COLORS: {
    DEFAULT_FILL: "#0047ab",
    HOVER: "#00a9ce",
    ACTIVE: "#007a99"
  },
  ANIMATION: {
    MORPH: {
      duration: 0.5,
      ease: "power2.inOut"
    },
    COLOR: {
      duration: 0.35
    },
    SCROLL: {
      duration: 1500,
      behavior: 'smooth'
    }
  },
  // Unified easing function for scroll animations
  EASING: t => t < 0.5 
    ? 2 * t * t // ease in
    : -1 + (4 - 2 * t) * t // ease out
};

export const ScrollAnchor = () => {
  // Context and utility hooks
  const { size } = useContext(DeviceContext);
  const { getNextChapter } = useChapters();
  const smoothScrollTo = useSmoothScroll();

  // State management
  const [isUp, setIsUp] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [state, setState] = useState({
    isHovered: false,
    isPressed: false
  });

  // Refs for DOM elements and animations
  const topPathRef = useRef(null);
  const bottomPathRef = useRef(null);
  const tlRef = useRef(null);
  const timeoutRef = useRef(null);
  const arrowConfig = useRef(INITIAL_ARROW_CONFIG);

  // Initialize configuration with CSS variables if available
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    
    arrowConfig.current = {
      ...INITIAL_ARROW_CONFIG,
      COLORS: {
        ...INITIAL_ARROW_CONFIG.COLORS,
        DEFAULT_FILL: root.getPropertyValue('--color-link').trim() || INITIAL_ARROW_CONFIG.COLORS.DEFAULT_FILL,
        HOVER: root.getPropertyValue('--color-link-hover').trim() || INITIAL_ARROW_CONFIG.COLORS.HOVER,
        ACTIVE: root.getPropertyValue('--color-link-action').trim() || INITIAL_ARROW_CONFIG.COLORS.ACTIVE
      }
    };
  }, []);
  
  // Initialize GSAP timeline for morphing animation
  useEffect(() => {
    tlRef.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: arrowConfig.current.ANIMATION.MORPH.duration,
        ease: arrowConfig.current.ANIMATION.MORPH.ease
      }
    });

    tlRef.current
      .to(topPathRef.current, {
        attr: { d: SVG_PATHS.UP.top }
      })
      .to(bottomPathRef.current, {
        attr: { d: SVG_PATHS.UP.bottom }
      }, "<");

    return () => {
      tlRef.current.kill();
    };
  }, []);

  // Handle color transitions
  useEffect(() => {
    const { COLORS } = arrowConfig.current;
    const color = state.isPressed 
      ? COLORS.ACTIVE 
      : state.isHovered 
        ? COLORS.HOVER 
        : COLORS.DEFAULT_FILL;

    gsap.to([topPathRef.current, bottomPathRef.current], {
      fill: color,
      duration: arrowConfig.current.ANIMATION.COLOR.duration
    });
  }, [state.isHovered, state.isPressed]);

  // Memoized scroll position check for performance
  const checkScrollPosition = useCallback(() => {
    if (isProgrammaticScroll) return;

    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (windowHeight + currentScroll) >= (documentHeight - 10);

    if (isAtBottom && !isUp) {
      tlRef.current.play();
      setIsUp(true);
    }
    else if (currentScroll === 0 && isUp) {
      tlRef.current.reverse();
      setIsUp(false);
    }
    else if (currentScroll > 0 && !isUp) {
      tlRef.current.play();
      setIsUp(true);
    }
  }, [isUp, isProgrammaticScroll]);

  // Optimized scroll and interaction handlers
  useEffect(() => {
    let rafId;
    const handleManualScroll = () => {
      // Use RAF to throttle scroll events
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkScrollPosition);
    };
  
    const handleUserInteraction = (e) => {
      if (!isProgrammaticScroll && !e.target.closest('.scrollAnchor')) {
        setIsProgrammaticScroll(false);
      }
    };

    // Event listeners with passive flag for better performance
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('scroll', handleManualScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleManualScroll);
    };
  }, [checkScrollPosition, isProgrammaticScroll]);

  // Memoized click handler
  const handleClick = useCallback(() => {
    if (!isUp) {
      const currentScroll = window.scrollY;
      console.log('ScrollAnchor: Current scroll position:', currentScroll);
      
      const nextChapter = getNextChapter(currentScroll);
      console.log('ScrollAnchor: Next chapter:', nextChapter?.id);
      
      if (nextChapter) {
        setIsProgrammaticScroll(true);
        console.log('ScrollAnchor: Starting scroll to:', nextChapter.id);
        
        const tempRef = { current: nextChapter };
        smoothScrollTo(tempRef, {
          duration: arrowConfig.current.ANIMATION.SCROLL.duration,
          easing: INITIAL_ARROW_CONFIG.EASING
        });
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Add buffer time to ensure scroll completes
        timeoutRef.current = setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, arrowConfig.current.ANIMATION.SCROLL.duration + 500);
      }
    } else {
      console.log('ScrollAnchor: Scrolling to top');
      const topRef = { current: document.documentElement };
      smoothScrollTo(topRef, {
        duration: arrowConfig.current.ANIMATION.SCROLL.duration,
        easing: INITIAL_ARROW_CONFIG.EASING,
      });
      tlRef.current.reverse();
      setIsUp(false);
    }
  }, [isUp, getNextChapter, smoothScrollTo]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized pointer event handlers
  const handlePointerEvents = {
    onPointerEnter: useCallback(() => 
      setState(prev => ({ ...prev, isHovered: true })), []),
    onPointerLeave: useCallback(() => 
      setState(prev => ({ ...prev, isHovered: false, isPressed: false })), []),
    onPointerDown: useCallback(() => 
      setState(prev => ({ ...prev, isPressed: true })), []),
    onPointerUp: useCallback(() => 
      setState(prev => ({ ...prev, isPressed: false })), []),
    onPointerCancel: useCallback(() => 
      setState(prev => ({ ...prev, isHovered: false, isPressed: false })), [])
  };

  return (
    <button 
      onClick={handleClick}
      {...handlePointerEvents}
      style={{ touchAction: 'manipulation' }}
      className={`${styles.scrollAnchor} ${styles[size]}`}
      aria-label={isUp ? "Scroll up" : "Scroll down"}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300" 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        className={styles.svg}
      >
        <path 
          ref={topPathRef}
          id="top" 
          d={SVG_PATHS.DOWN.top}
          style={{ fillRule: "nonzero" }}
        />
        <path 
          ref={bottomPathRef}
          id="bottom" 
          d={SVG_PATHS.DOWN.bottom}
          style={{ fillRule: "nonzero" }}
        />
      </svg>
    </button>
  );
};

export default ScrollAnchor;