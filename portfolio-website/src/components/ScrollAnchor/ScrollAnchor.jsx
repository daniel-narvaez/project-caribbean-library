import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './ScrollAnchor.module.css';

const INITIAL_ARROW_CONFIG = {
  COLORS: {
    DEFAULT_FILL: "#0047ab",
    DEFAULT_STROKE: "#0047ab",
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
      duration: 1000, // Duration for programmatic scroll timeout
      behavior: 'smooth', // ScrollIntoView behavior
      ease: "ease-in-out" // CSS scroll-behavior timing function
    }
  }
};

export const ScrollAnchor = () => {
  const [isUp, setIsUp] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const topPathRef = useRef(null);
  const bottomPathRef = useRef(null);
  const tlRef = useRef(null);
  const timeoutRef = useRef(null);
  const arrowConfig = useRef(INITIAL_ARROW_CONFIG);
  const [state, setState] = useState({
    isHovered: false,
    isPressed: false
  });

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    
    arrowConfig.current = {
      ...INITIAL_ARROW_CONFIG,
      COLORS: {
        ...INITIAL_ARROW_CONFIG.COLORS,
        DEFAULT_FILL: root.getPropertyValue('--color-link').trim() || INITIAL_ARROW_CONFIG.COLORS.DEFAULT_FILL,
        DEFAULT_STROKE: root.getPropertyValue('--color-link').trim() || INITIAL_ARROW_CONFIG.COLORS.DEFAULT_STROKE,
        HOVER: root.getPropertyValue('--color-link-hover').trim() || INITIAL_ARROW_CONFIG.COLORS.HOVER,
        ACTIVE: root.getPropertyValue('--color-link-action').trim() || INITIAL_ARROW_CONFIG.COLORS.ACTIVE
      }
    };
  }, []);
  
  useEffect(() => {
    tlRef.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: arrowConfig.current.ANIMATION.MORPH.duration,
        ease: arrowConfig.current.ANIMATION.MORPH.ease
      }
    });

    const upTopPath = "M216.667,133.333L196.641,133.333L150,63.381L114.469,116.667L145.481,116.667L134.342,133.333L83.333,133.333L150,33.333L216.667,133.333Z";
    const upBottomPath = "M134.342,266.667L134.342,236.659L141.655,225.693L141.654,152.449L165.498,116.688L175.521,131.71L158.321,157.497L158.321,230.741L134.342,266.667Z";
    const downTopPath = "M165.623,33.334L165.645,63.341L158.333,74.308L158.333,147.552L134.489,183.313L124.467,168.29L141.667,142.504L141.667,69.26L165.623,33.334Z";
    const downBottomPath = "M83.333,166.667L103.358,166.667L150,236.617L185.531,183.333L154.509,183.333L165.623,166.667L216.667,166.667L150,266.667L83.333,166.667Z";

    tlRef.current
      .to(topPathRef.current, {
        attr: { d: upTopPath }
      })
      .to(bottomPathRef.current, {
        attr: { d: upBottomPath }
      }, "<");

    return () => {
      tlRef.current.kill();
    };
  }, []);

  useEffect(() => {
    const { COLORS } = arrowConfig.current;
    const color = state.isPressed 
      ? COLORS.ACTIVE 
      : state.isHovered 
        ? COLORS.HOVER 
        : COLORS.DEFAULT_FILL;

    gsap.to([topPathRef.current, bottomPathRef.current], {
      fill: color,
      duration: 0.2
    });
  }, [state.isHovered, state.isPressed]);

  useEffect(() => {
    const checkScrollPosition = () => {
      // If it's a programmatic scroll, don't check position
      if (isProgrammaticScroll) return;

      const currentScroll = window.scrollY;

      // Check if we're at the top
      if (currentScroll === 0 && isUp) {
        tlRef.current.reverse();
        setIsUp(false);
      } 
      // If we're not at the top and manually scrolling, morph it up
      else if (currentScroll > 0 && !isUp) {
        tlRef.current.play();
        setIsUp(true);
      }
    };

    window.addEventListener('scroll', checkScrollPosition);
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, [isUp, isProgrammaticScroll]);

  const handleClick = () => {
    if (!isUp) {
      const currentScroll = window.scrollY;
      const sections = document.querySelectorAll('section');
      let nextSection;
      
      sections.forEach(section => {
        if (!nextSection && section.offsetTop > currentScroll) {
          nextSection = section;
        }
      });
      
      if (nextSection) {
        // Set programmatic scroll flag
        setIsProgrammaticScroll(true);
        
        nextSection.scrollIntoView({ 
          behavior: arrowConfig.current.ANIMATION.SCROLL.behavior 
        });
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Reset the flag after scroll animation (1000ms = 1 second)
        timeoutRef.current = setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, arrowConfig.current.ANIMATION.SCROLL.duration);
      }
    } else {
      window.scrollTo({ 
        top: 0, 
        behavior: arrowConfig.current.ANIMATION.SCROLL.behavior 
      });
      tlRef.current.reverse();
      setIsUp(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={() => setState(prev => ({ ...prev, isHovered: true }))}
      onMouseLeave={() => setState(prev => ({ ...prev, isHovered: false, isPressed: false }))}
      onMouseDown={() => setState(prev => ({ ...prev, isPressed: true }))}
      onMouseUp={() => setState(prev => ({ ...prev, isPressed: false }))}
      className={styles.scrollAnchor}
      aria-label={isUp ? "Scroll down" : "Scroll up"}
    >
      <svg 
        width="100%"
        height="100%"
        viewBox="50 0 250 300" 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        className={styles.svg}
      >
        <path 
          ref={topPathRef}
          id="top" 
          d="M165.623,33.334L165.645,63.341L158.333,74.308L158.333,147.552L134.489,183.313L124.467,168.29L141.667,142.504L141.667,69.26L165.623,33.334Z"
          style={{ fillRule: "nonzero" }}
        />
        <path 
          ref={bottomPathRef}
          id="bottom" 
          d="M83.333,166.667L103.358,166.667L150,236.617L185.531,183.333L154.509,183.333L165.623,166.667L216.667,166.667L150,266.667L83.333,166.667Z"
          style={{ fillRule: "nonzero" }}
        />
      </svg>
    </button>
  );
};

export default ScrollAnchor;