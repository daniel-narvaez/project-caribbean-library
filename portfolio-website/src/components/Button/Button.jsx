import React, { memo, useContext } from "react";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import { useSmoothScroll } from "../../utils/useSmoothScroll";
import styles from './Button.module.css';

/**
 * Hook for shared button logic
 * @param {string} url - The URL for link buttons
 * @param {string} className - Class names including 'action' if it's an action button
 * @param {Function} onCustomClick - Click handler for action buttons
 * @returns {Object} Button state and handlers
 */
const useButtonLogic = (url, className, onCustomClick) => {
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

/**
 * Base Button Component
 * Supports both action and link functionality based on className
 *
 * Action Buttons (className includes 'action'):
 * - Require onCustomClick handler
 * - Ignore url prop
 * - Disabled when onCustomClick is undefined
 *
 * Link Buttons (className excludes 'action'):
 * - Require url prop
 * - Ignore onCustomClick
 * - Disabled when url is ' ' or '/'
 */
export const CreateButton = memo(({
  title = 'Button',
  url = '/',
  style = 'solid',
  className = '',
  onCustomClick
}) => {
  const {
    size,
    isActionButton,
    isDisabled,
    finalUrl,
    handleClick
  } = useButtonLogic(url, className, onCustomClick);

  const buttonClassName = `${styles.button} ${styles[style]} ${styles[size]} ${styles[className]}`;

  if (isActionButton) {
    return (
      <button 
        type="button"
        className={buttonClassName}
        onClick={handleClick}
        disabled={isDisabled}
      >
        <span>{title}</span>
      </button>
    );
  }

  return (
    <a 
      href={isDisabled ? "#" : finalUrl}
      className={buttonClassName}
      onClick={handleClick}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
    >
      <span>{title}</span>
    </a>
  );
});

// Export button variants with specific styles
export const SolidButton = (props) => <CreateButton {...props} style='solid' />;
export const IslandButton = (props) => <CreateButton {...props} style='island' />;