/**
 * AnimatedCursor.jsx
 * =================
 * 
 * Overview:
 * A custom cursor component that morphs between default and hover states.
 * Features smooth GSAP animations for state transitions and cursor movement.
 * Designed for interactive elements like links and buttons with distinct
 * visual feedback. Includes intelligent touch/stylus detection for proper
 * cursor display across different input methods.
 * 
 * Key Features:
 * - Smooth cursor movement tracking
 * - Morphing animation between states using GSAP
 * - Different hover states for links (#b2ffff) and buttons (#dc143c)
 * - SVG-based cursor with fill and stroke animations
 * - Smart touch/stylus detection for mobile and tablet devices
 * 
 * Technical Implementation:
 * - GSAP timeline for complex shape morphing
 * - Efficient DOM traversal for interactive element detection
 * - RAF-based cursor position updates
 * - Optimized event listener management
 * - Pointer events API for stylus detection
 * 
 * Dependencies:
 * - GSAP for animations
 * - CSS modules for styling
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import '../../vars.css';
import styles from './Cursor.module.css';

// Initial config with default values
const INITIAL_CURSOR_CONFIG = {
  MORPH_DURATION: 0.2,
  COLORS: {
    LINK: "#b2ffff", // Default fallback value
    BUTTON: "#dc9ba3",
    DEFAULT_FILL: "#ece9e4",
    DEFAULT_STROKE: "#00052b"
  }
};

export const AnimatedCursor = () => {
  // SVG element refs for GSAP animations
  const svgRef = useRef(null);
  const headPathRef = useRef(null);
  const headStrokeRef = useRef(null);
  const tailPathRef = useRef(null);
  const timelineRef = useRef(null);
  const cursorConfig = useRef(INITIAL_CURSOR_CONFIG);
  // State management
  const [isVisible, setIsVisible] = useState(document.hasFocus());
  const [hoverColor, setHoverColor] = useState(cursorConfig.current.COLORS.LINK);
  const [state, setState] = useState({
    isPointer: false,
    isPressed: false
  });

  // State for input device detection
  const [inputDevice, setInputDevice] = useState({
    hasTouch: false,
    hasFinePointer: true,
    isStylus: false,
    stylusInRange: false
  });

  // Effect to detect device capabilities and monitor changes
  useEffect(() => {
    const detectInputCapabilities = () => {
      const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      
      setInputDevice(prev => ({
        ...prev,
        hasTouch: touch,
        hasFinePointer: finePointer
      }));
    };

    // Initial detection
    detectInputCapabilities();

    // Set up media query listeners
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    touchQuery.addListener(detectInputCapabilities);
    pointerQuery.addListener(detectInputCapabilities);

    return () => {
      touchQuery.removeListener(detectInputCapabilities);
      pointerQuery.removeListener(detectInputCapabilities);
    };
  }, []);

  // Effect to update the config with computed CSS values
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    
    cursorConfig.current = {
      ...INITIAL_CURSOR_CONFIG,
      COLORS: {
        ...INITIAL_CURSOR_CONFIG.COLORS,
        LINK: root.getPropertyValue('--color-pointer-link').trim(),
        BUTTON: root.getPropertyValue('--color-pointer-action').trim(),
        DEFAULT_FILL: root.getPropertyValue('--color-bg1').trim(),
        DEFAULT_STROKE: root.getPropertyValue('--color-text1').trim()
      }
    };
  }, []); // Empty dependency array since we only need to run this once on mount

  /**
   * Checks if an element or its ancestors are interactive (has href or action class)
   * Updates hover color based on interaction type
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} - Whether element is/contains interactive element
   */
  const hasInteractionInTree = useMemo(() => {
    return (element) => {
      if (!element) return false;
      
      let current = element;
      while (current && current !== document.documentElement) {
        // Check if it's a link by tag name
        const isLink = (current.tagName === 'A' || current.tagName === 'BUTTON');
        
        // Check for action class
        const isAction = current.classList.contains('action');

        if (isLink || isAction) {
          setHoverColor(isLink
            ? cursorConfig.current.COLORS.LINK
            : cursorConfig.current.COLORS.BUTTON);
          return true;
        }
        
        current = current.parentElement;
      }
      return false;
    };
  }, []);

  // Enhanced pointer event handlers for stylus detection and cursor movement
  const handlePointerMove = useCallback((e) => {
    // Device detection
    const isStylus = e.pointerType === 'pen';
    setInputDevice(prev => ({
      ...prev,
      isStylus,
      stylusInRange: isStylus
    }));

    // Cursor movement (only for stylus)
    if (isStylus && svgRef.current) {
      const { x, y } = e;
      svgRef.current.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      
      // Use pointer-specific hit testing for stylus
      const element = document.elementFromPoint(x, y - 2); // Small offset for better stylus precision
      if (element) {
        const isLink = hasInteractionInTree(element);
        setState(prev => ({ ...prev, isPointer: isLink }));
      }
    }
  }, [hasInteractionInTree]);

  const handlePointerEnter = useCallback((e) => {
    if (e.pointerType === 'pen') {
      setInputDevice(prev => ({
        ...prev,
        isStylus: true,
        stylusInRange: true
      }));
      setIsVisible(true);
    }
  }, []);

  const handlePointerLeave = useCallback((e) => {
    if (e.pointerType === 'pen') {
      setInputDevice(prev => ({
        ...prev,
        stylusInRange: false
      }));
      setIsVisible(false);
    }
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'pen') {
      setState(prev => ({ ...prev, isPressed: true }));
    }
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (e.pointerType === 'pen') {
      setState(prev => ({ ...prev, isPressed: false }));
    }
  }, []);

  const handlePointerOut = useCallback((e) => {
    if (e.pointerType === 'pen') {
      setInputDevice(prev => ({
        ...prev,
        stylusInRange: false
      }));
    }
  }, []);

  /**
   * Sets up GSAP animations and event listeners
   */
  useEffect(() => {
    let hasInitialPosition = false;

    /**
     * Handler for mouse movement
     * @param {MouseEvent} e - Mouse event
     */
    const onMouseMove = (e) => {
      if (svgRef.current) {
        svgRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
        hasInitialPosition = true;

        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          const isLink = hasInteractionInTree(element);
          setState(prev => ({ ...prev, isPointer: isLink }));
        }
      }
    };

    // If the document has focus but we haven't moved the mouse yet,
    // we can hide the cursor until first movement
    if (document.hasFocus() && !hasInitialPosition) {
      setIsVisible(false);
    }

    // Show the cursor once we get our first mouse position
    const onFirstMove = (e) => {
      onMouseMove(e);
      setIsVisible(true);
      window.removeEventListener('mousemove', onFirstMove);
      window.addEventListener('mousemove', onMouseMove);
    };

    const onMouseDown = () => setState(prev => ({ ...prev, isPressed: true }));
    const onMouseUp = () => setState(prev => ({ ...prev, isPressed: false }));
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Initialize GSAP timeline for morphing animations
    const ctx = gsap.context(() => {
      timelineRef.current = gsap.timeline({ paused: true });
      
      // Head fill animation
      timelineRef.current.to(headPathRef.current, {
        duration: cursorConfig.current.MORPH_DURATION,
        attr: { 
          d: "M5.144,0.986C9.696,-1.293 15.292,0.446 17.644,5.144C19.931,9.712 17.972,15.398 13.486,17.644C8.859,19.961 3.25,18.007 0.986,13.486C-1.319,8.883 0.551,3.286 5.144,0.986Z"
        },
        fill: hoverColor,
        fillOpacity: 0.8,
        ease: "power2.inOut"
      }, 0);
      
      // Head stroke animation
      timelineRef.current.to(headStrokeRef.current, {
        duration: cursorConfig.current.MORPH_DURATION,
        attr: { 
          d: "M5.144,0.986C9.696,-1.293 15.292,0.446 17.644,5.144C19.931,9.712 17.972,15.398 13.486,17.644C8.859,19.961 3.25,18.007 0.986,13.486C-1.319,8.883 0.551,3.286 5.144,0.986ZM6.04,2.774C2.432,4.581 0.964,8.976 2.774,12.59C4.552,16.141 8.957,17.675 12.59,15.856C16.113,14.092 17.652,9.627 15.856,6.04C14.009,2.351 9.614,0.984 6.04,2.774Z"
        },
        ease: "power2.inOut"
      }, 0);
      
      // Tail animation
      timelineRef.current.to(tailPathRef.current, {
        duration: cursorConfig.current.MORPH_DURATION,
        attr: { 
          d: "M15.69,18.871L21.987,25.03L18.447,26.673L22.021,29.364L22.023,31.991L14.458,26.315L18.267,24.334L13.628,19.904L15.69,18.871Z"
        },
        ease: "power2.inOut"
      }, 0);

      // Event listener setup
      window.addEventListener('mousemove', onFirstMove);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      document.documentElement.addEventListener('mouseleave', onMouseLeave);
      document.documentElement.addEventListener('mouseenter', onMouseEnter);

      // Add pointer-specific event listeners
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointerenter', handlePointerEnter);
      window.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('pointerout', handlePointerOut);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousemove', onFirstMove);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseleave', onMouseLeave);
        document.documentElement.removeEventListener('mouseenter', onMouseEnter);
        
        // Clean up pointer event listeners
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointerenter', handlePointerEnter);
        window.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('pointerout', handlePointerOut);
      };
    }, svgRef);

    return () => ctx.revert();
  }, [hasInteractionInTree, handlePointerMove, handlePointerDown, handlePointerUp, 
      handlePointerEnter, handlePointerLeave, handlePointerOut, hoverColor]);

  /**
   * Controls animation timeline based on pointer state
   */
  useEffect(() => {
    if (state.isPointer) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, [state.isPointer]);

  // Determine if cursor should be shown based on device and input type
  const shouldShowCursor = useMemo(() => {
    // Show cursor if it's a non-touch device
    if (!inputDevice.hasTouch) return true;
    
    // Show cursor only if stylus is in range
    if (inputDevice.isStylus && inputDevice.stylusInRange) return true;
    
    // Hide cursor on touch devices without stylus
    return false;
  }, [inputDevice]);

  return shouldShowCursor ? (
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
        transition: `opacity ${cursorConfig.current.MORPH_DURATION}s ease`
      }}
    >
      <rect id="default" x="0" y="0" width="32" height="32" fill="none"/>
      <g id="cursor-group">
        <path 
          ref={headPathRef}
          id="head" 
          d="M6,6C6.5,6 20.738,16.452 22.739,18.453C22.74,18.454 17.116,21.269 14.34,22.659C11.564,24.049 6,26.83 6,26.83C6,20.83 6,12 6,6Z"
          fill={cursorConfig.current.COLORS.DEFAULT_FILL}
        />
        <path 
          ref={headStrokeRef}
          d="M6,6C6.5,6 20.738,16.452 22.739,18.453C22.74,18.454 17.116,21.269 14.34,22.659C11.564,24.049 6,26.83 6,26.83C6,20.83 6,12 6,6ZM8,9.98C8,13.934 8,19.923 8,23.594C9.781,22.704 11.994,21.597 13.445,20.871C14.901,20.141 17.14,19.021 18.94,18.119C15.988,15.923 11.175,12.342 8,9.98Z"
          fill={cursorConfig.current.COLORS.DEFAULT_STROKE}
        />
        <path 
          ref={tailPathRef}
          id="tail" 
          d="M11.477,26.336L19.034,22.547L17.997,28.591L19.052,29.381L19.034,31.991L15.701,29.496L16.256,26.305L13.354,27.74L11.477,26.336Z"
          fill={cursorConfig.current.COLORS.DEFAULT_STROKE}
        />
      </g>
    </svg>
  ) : null;
};




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
  const hasInteractionInTree = useMemo(() => {
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
   * Handles mouse down interaction
   * Creates new splash animation if clicking a link
   * @param {MouseEvent} e - Mouse down event
   */
  const handleMouseDown = useCallback((e) => {
    if (!hasInteractionInTree(e.target)) return;
    
    setState(prev => ({ ...prev, isPressed: true }));
    
    setSplashes(prev => [...prev, {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    }]);
  }, [hasInteractionInTree]);

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
    window.addEventListener('mousedown', handleMouseDown, captureOptions);
    window.addEventListener('mouseup', handleMouseUp, options);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, options);
      window.removeEventListener('mousedown', handleMouseDown, captureOptions);
      window.removeEventListener('mouseup', handleMouseUp, options);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

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
  // Render
  // =========================================
  return (
    <>
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