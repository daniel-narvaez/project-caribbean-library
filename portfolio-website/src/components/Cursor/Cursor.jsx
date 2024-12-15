/**
 * SplashEffect.jsx
 * ===============
 * 
 * Overview:
 * A cursor enhancement component that adds interactive splash animations
 * to clickable link elements. Creates a visual ripple effect on mouse down
 * and tracks the cursor position over clickable elements. Built for high
 * performance with optimized event handling and cleanup.
 * 
 * Key Features:
 * - Cursor dot indicator for hoverable elements
 * - Mouse-down triggered splash animation
 * - Automatic cleanup of completed animations
 * - Efficient event delegation and handling
 * 
 * Technical Implementation:
 * - RequestAnimationFrame for smooth animations
 * - Passive event listeners for scroll performance
 * - Proper cleanup of event listeners and timeouts
 * - Optimized DOM traversal for link detection
 * 
 * Dependencies:
 * - CSS modules for styling
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
// import defaultCursor from '../../../public/images/cursor-default.svg?react';
// import pointerCursor from '../../../public/images/cursor-pointer.svg?react';

import styles from './Cursor.module.css';

const MORPH_DURATION = 0.2;

export const AnimatedCursor = () => {
  const svgRef = useRef(null);
  const headPathRef = useRef(null);
  const headStrokeRef = useRef(null);
  const tailPathRef = useRef(null);
  const timelineRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverColor, setHoverColor] = useState("#b2ffff");
  
  const [state, setState] = useState({
    isPointer: false,
    isPressed: false
  });

  const hasHrefInTree = useMemo(() => {
    return (element) => {
      if (!element) return false;
     
      let current = element;
      while (current && current !== document.documentElement) {
        if (current.tagName === 'A' && current.hasAttribute('href') || current.tagName === 'BUTTON') {
          setHoverColor(current.tagName === 'A' || current.hasAttribute('href') ? "#b2ffff" : "#dc143c");
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };
  }, [hoverColor]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (svgRef.current) {
        svgRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          const isLink = hasHrefInTree(element);
          setState(prev => ({ ...prev, isPointer: isLink }));
        }
      }
    };

    const onMouseDown = () => setState(prev => ({ ...prev, isPressed: true }));
    const onMouseUp = () => setState(prev => ({ ...prev, isPressed: false }));
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const ctx = gsap.context(() => {
      timelineRef.current = gsap.timeline({ paused: true });
      
      // Animate the fill path with updated path data
      timelineRef.current.to(headPathRef.current, {
        duration: MORPH_DURATION,
        attr: { 
          d: "M5.144,0.986C9.696,-1.293 15.292,0.446 17.644,5.144C19.931,9.712 17.972,15.398 13.486,17.644C8.859,19.961 3.25,18.007 0.986,13.486C-1.319,8.883 0.551,3.286 5.144,0.986Z"
        },
        fill: hoverColor,
        fillOpacity: 0.8,
        ease: "power2.inOut"
      }, 0);
      
      // Animate the stroke path with updated path data
      timelineRef.current.to(headStrokeRef.current, {
        duration: MORPH_DURATION,
        attr: { 
          d: "M5.144,0.986C9.696,-1.293 15.292,0.446 17.644,5.144C19.931,9.712 17.972,15.398 13.486,17.644C8.859,19.961 3.25,18.007 0.986,13.486C-1.319,8.883 0.551,3.286 5.144,0.986ZM6.04,2.774C2.432,4.581 0.964,8.976 2.774,12.59C4.552,16.141 8.957,17.675 12.59,15.856C16.113,14.092 17.652,9.627 15.856,6.04C14.009,2.351 9.614,0.984 6.04,2.774Z"
        },
        ease: "power2.inOut"
      }, 0);
      
      timelineRef.current.to(tailPathRef.current, {
        duration: MORPH_DURATION,
        attr: { 
          d: "M15.69,18.871L21.987,25.03L18.447,26.673L22.021,29.364L22.023,31.991L14.458,26.315L18.267,24.334L13.628,19.904L15.69,18.871Z"
        },
        ease: "power2.inOut"
      }, 0);

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      document.documentElement.addEventListener('mouseleave', onMouseLeave);
      document.documentElement.addEventListener('mouseenter', onMouseEnter);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseleave', onMouseLeave);
        document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      };
    }, svgRef);

    return () => ctx.revert();
  }, [hasHrefInTree]);

  useEffect(() => {
    if (state.isPointer) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, [state.isPointer]);

  return (
    <svg 
      ref={svgRef}
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
        margin: 0,
        padding: 0,
        willChange: 'transform',
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${MORPH_DURATION} ease`
      }}
    >
      <rect id="default" x="0" y="0" width="32" height="32" fill="none"/>
      <g id="cursor-group">
        <path 
          ref={headPathRef}
          id="head" 
          d="M6,6C6.5,6 20.738,16.452 22.739,18.453C22.74,18.454 17.116,21.269 14.34,22.659C11.564,24.049 6,26.83 6,26.83C6,20.83 6,12 6,6Z"
          fill="#ece9e4"
        />
        <path 
          ref={headStrokeRef}
          d="M6,6C6.5,6 20.738,16.452 22.739,18.453C22.74,18.454 17.116,21.269 14.34,22.659C11.564,24.049 6,26.83 6,26.83C6,20.83 6,12 6,6ZM8,9.98C8,13.934 8,19.923 8,23.594C9.781,22.704 11.994,21.597 13.445,20.871C14.901,20.141 17.14,19.021 18.94,18.119C15.988,15.923 11.175,12.342 8,9.98Z"
          fill="#00052b"
        />
        <path 
          ref={tailPathRef}
          id="tail" 
          d="M11.477,26.336L19.034,22.547L17.997,28.591L19.052,29.381L19.034,31.991L15.701,29.496L16.256,26.305L13.354,27.74L11.477,26.336Z"
          fill="#00052b"
        />
      </g>
    </svg>
  );
};

/**
 * Animation timing configuration (in milliseconds)
 * - SPLASH_DURATION: Length of the splash animation
 */
const ANIMATION_CONFIG = {
  SPLASH_DURATION: 700
};

/**
 * SplashEffect Component
 * Manages interactive cursor effects and splash animations for link elements.
 * Tracks mouse position and link hovering to provide visual feedback through
 * a cursor dot and expanding splash animations.
 * 
 * Features:
 * - Cursor dot follows mouse position
 * - Dot appears only when hovering clickable elements
 * - Splash effect triggers on mouse down
 * - Automatic cleanup of completed animations
 */
export const SplashEffect = () => {
  // =========================================
  // State Management
  // =========================================
  // Cursor position tracking
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Interaction states
  const [state, setState] = useState({
    isPointer: false,  // Whether cursor is over a clickable element
    isPressed: false   // Whether mouse is currently pressed
  });
  
  // Active splash animations
  const [splashes, setSplashes] = useState([]);

  // =========================================
  // Utility Functions
  // =========================================
  /**
   * Checks if an element or its ancestors have an href attribute
   * Traverses up the DOM tree until it finds a link or reaches the root
   * 
   * @param {HTMLElement} element - Starting element to check
   * @returns {boolean} - Whether element is part of a clickable link
   */
  const hasHrefInTree = useMemo(() => {
    return (element) => {
      if (!element) return false;
      
      let current = element;
      while (current && current !== document.documentElement) {
        if (current.tagName === 'A' && current.hasAttribute('href')) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };
  }, []);

  // =========================================
  // Event Handlers
  // =========================================
  /**
   * Updates cursor position state on mouse move
   * @param {MouseEvent} e - Mouse movement event
   */
  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  /**
   * Updates pointer state when entering new elements
   * @param {MouseEvent} e - Mouse over event
   */
  const handleMouseOver = useCallback((e) => {
    setState(prev => ({
      ...prev,
      isPointer: hasHrefInTree(e.target)
    }));
  }, [hasHrefInTree]);

  /**
   * Handles mouse down interaction
   * Creates new splash animation if clicking a link
   * @param {MouseEvent} e - Mouse down event
   */
  const handleMouseDown = useCallback((e) => {
    if (!hasHrefInTree(e.target)) return;
    
    setState(prev => ({ ...prev, isPressed: true }));
    
    setSplashes(prev => [...prev, {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    }]);
  }, [hasHrefInTree]);

  /**
   * Resets pressed state on mouse up
   */
  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  // =========================================
  // Lifecycle & Effects
  // =========================================
  /**
   * Event listener management
   * Sets up and cleans up all mouse interaction handlers
   */
  useEffect(() => {
    const options = { passive: true };
    const captureOptions = { ...options, capture: true };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, options);
    document.addEventListener('mouseover', handleMouseOver, captureOptions);
    window.addEventListener('mousedown', handleMouseDown, captureOptions);
    window.addEventListener('mouseup', handleMouseUp, options);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, options);
      document.removeEventListener('mouseover', handleMouseOver, captureOptions);
      window.removeEventListener('mousedown', handleMouseDown, captureOptions);
      window.removeEventListener('mouseup', handleMouseUp, options);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseDown, handleMouseUp]);

  /**
   * Splash animation cleanup
   * Removes completed splash animations from state
   */
  useEffect(() => {
    if (splashes.length === 0) return;

    const timeoutId = setTimeout(() => {
      setSplashes(prev => prev.slice(1));
    }, ANIMATION_CONFIG.SPLASH_DURATION);

    return () => clearTimeout(timeoutId);
  }, [splashes]);

  // =========================================
  // Style Calculations
  // =========================================
  /**
   * Memoized cursor positioning styles
   * Prevents unnecessary style object recreation
   */
  const dotStyle = useMemo(() => ({
    left: position.x,
    top: position.y
  }), [position.x, position.y]);

  // =========================================
  // Render
  // =========================================
  return (
    <>
      {/* {state.isPointer && (
        <div
          className={`${styles.cursorDot} ${state.isPressed ? styles.active : ''}`}
          style={dotStyle}
        />
      )} */}
      {splashes.map(splash => (
        <div
          key={splash.id}
          className={styles.splash}
          style={{ left: splash.x, top: splash.y }}
        />
      ))}
    </>
  );
};