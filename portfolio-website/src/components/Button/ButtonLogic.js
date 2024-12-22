// ButtonLogic.js
import { useContext } from "react";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import { useSmoothScroll } from "../../utils/useSmoothScroll";

/**
 * Hook for shared button logic
 * @param {string} url - The URL for link buttons
 * @param {string} className - Class names including 'action' if it's an action button
 * @param {Function} onCustomClick - Click handler for action buttons
 * @returns {Object} Button state and handlers
 */
export const useButtonLogic = (url, className, onCustomClick) => {
  const { size } = useContext(ScreenSizeContext);
  const smoothScrollTo = useSmoothScroll();
  
  const isActionButton = className.includes('action');
  const finalUrl = isActionButton ? '/' : url;
  
  // Calculate disabled state
  const isDisabled = isActionButton
    ? !onCustomClick // Action buttons disabled when no click handler
    : (url === ' ' || url === '/'); // Link buttons disabled for empty/root URLs

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    if (isActionButton) {
      if (onCustomClick) {
        onCustomClick(e);
      }
      return;
    }

    if (finalUrl.startsWith('#')) {
      e.preventDefault();
      const targetId = finalUrl.slice(1);
      smoothScrollTo(targetId);
    }
  };

  return {
    size,
    isActionButton,
    isDisabled,
    finalUrl,
    handleClick
  };
};