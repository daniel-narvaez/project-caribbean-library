import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling to elements using refs
 * @returns {Function} smoothScrollTo function
 * 
 * @example
 * const MyComponent = () => {
 *   const ref = useRef(null);
 *   const smoothScrollTo = useSmoothScroll();
 * 
 *   return (
 *     <button onClick={() => smoothScrollTo(ref)}>
 *       Scroll to Element
 *     </button>
 *   );
 * };
 */
export const useSmoothScroll = () => {
  const smoothScrollTo = useCallback((target, options = {}) => {
    const {
      duration = 1000,
      offset = 0,
      easing = (t) => t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    } = options;

    // Get the element either from ref or id
    const element = target?.current || document.getElementById(target);
    if (!element) return;
    
    const targetPosition = element.getBoundingClientRect().top + window.scrollY + offset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Animation frame recursive function
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easeProgress = easing(progress);
      window.scrollTo({
        top: startPosition + (distance * easeProgress),
        behavior: 'auto' // We're handling the smoothness ourselves
      });

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, []);

  return smoothScrollTo;
};

/**
 * Pre-defined easing functions that can be used with the scroll hook
 */
export const easingFunctions = {
  // Standard easing - smooth acceleration and deceleration
  easeInOutCubic: (t) => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  // Quick at the beginning, then slows down
  easeOutQuad: (t) => 
    t * (2 - t),
  
  // Slow at the beginning, then speeds up
  easeInQuad: (t) => 
    t * t,
  
  // Material Design standard easing (approximation)
  materialStandard: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
};