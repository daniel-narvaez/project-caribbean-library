// ButtonLogic.js
import { useContext } from "react";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import { useSmoothScroll } from "../../utils/useSmoothScroll";

/**
 * Hook for action button logic
 * Handles disabled state and screen size responsiveness
 * 
 * @param {Function} onCustomClick - Click handler for the action button
 * @returns {Object} Button state
 * @property {string} size - Current screen size from context
 * @property {boolean} isDisabled - Whether the button should be disabled
 */
export const useActionButtonLogic = (onCustomClick) => {
  const { size } = useContext(ScreenSizeContext);
  
  return {
    size,
    isDisabled: !onCustomClick
  };
};

/**
 * Hook for link button logic
 * Handles URL processing, smooth scroll, and disabled states
 * 
 * @param {string} url - The destination URL
 * @returns {Object} Link state and handlers
 * @property {string} size - Current screen size from context
 * @property {boolean} isDisabled - Whether the link should be disabled
 * @property {string} finalUrl - Processed URL for the link
 * @property {Function} handleClick - Click event handler
 */
export const useLinkButtonLogic = (url = '/') => {
  const { size } = useContext(ScreenSizeContext);
  const smoothScrollTo = useSmoothScroll();

  // Link buttons disabled for empty/root URLs
  const isDisabled = url === ' ' || url === '/';

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    // Handle smooth scroll for anchor links
    if (url.startsWith('#')) {
      e.preventDefault();
      const targetId = url.slice(1);
      smoothScrollTo(targetId, {
        duration: 1500,
        easing: t => t < 0.5
          ? 2 * t * t // ease in
          : -1 + (4 - 2 * t) * t // ease out
      });
    }
  };

  return {
    size,
    isDisabled,
    finalUrl: url,
    handleClick
  };
};