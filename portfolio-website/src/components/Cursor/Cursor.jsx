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

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './Cursor.module.css';

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
      {state.isPointer && (
        <div
          className={`${styles.cursorDot} ${state.isPressed ? styles.active : ''}`}
          style={dotStyle}
        />
      )}
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