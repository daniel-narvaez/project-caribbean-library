import React, { useEffect, useRef, useState, useContext } from 'react';
import gsap from 'gsap';
import styles from './ScrollAnchor.module.css';
import { useChapters } from '../../contexts/Chapters';
import { useSmoothScroll } from '../../utils/useSmoothScroll';
import { ScreenSizeContext } from '../../contexts/ScreenSize';

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
      duration: 1500,
      behavior: 'smooth',
      ease: "ease-in-out"
    }
  }
};

export const ScrollAnchor = () => {
  const { size } = useContext(ScreenSizeContext);
  const { getNextChapter } = useChapters();
  const smoothScrollTo = useSmoothScroll();
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
      duration: arrowConfig.current.ANIMATION.COLOR.duration
    });
  }, [state.isHovered, state.isPressed]);

  useEffect(() => {
    const handleManualScroll = () => {
      // If we're in a programmatic scroll, don't do anything at all
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
    };
  
    const handleUserInteraction = (e) => {
      // Only handle user interactions if we're not in a programmatic scroll
      if (!isProgrammaticScroll && !e.target.closest('.scrollAnchor')) {
        setIsProgrammaticScroll(false);
      }
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('scroll', handleManualScroll);

    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleManualScroll);
    };
  }, [isUp, isProgrammaticScroll]);

  const handleClick = () => {
    if (!isUp) {
      const currentScroll = window.scrollY;
      const nextChapter = getNextChapter(currentScroll);
      
      if (nextChapter) {
        setIsProgrammaticScroll(true);
        
        const tempRef = { current: nextChapter };
        
        smoothScrollTo(tempRef, {
          duration: arrowConfig.current.ANIMATION.SCROLL.duration,
          easing: t => t < 0.5
            ? 2 * t * t // ease in
            : -1 + (4 - 2 * t) * t // ease out
        });
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, arrowConfig.current.ANIMATION.SCROLL.duration + 500);
      }
    } else {
      const topRef = { current: document.documentElement };
      smoothScrollTo(topRef, {
        duration: arrowConfig.current.ANIMATION.SCROLL.duration,
        easing: t => t < 0.5
          ? 2 * t * t // ease in
          : -1 + (4 - 2 * t) * t // ease out
      });
      tlRef.current.reverse();
      setIsUp(false);
    }
  };

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
      onMouseEnter={() => setState(prev => ({ ...prev, isHovered: (size === 'Desktop') }))}
      onMouseLeave={() => setState(prev => ({ ...prev, isHovered: false, isPressed: false }))}
      onMouseDown={() => setState(prev => ({ ...prev, isPressed: true }))}
      onMouseUp={() => setState(prev => ({ ...prev, isPressed: false }))}
      onTouchStart={() => setState(prev => ({ ...prev, isPressed: true }))}
      onTouchEnd={(e) => {
        setState(prev => ({ 
          ...prev, 
          isPressed: false,
          isHovered: false // Reset hover state on touch end
        }));
      }}
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