/**
 * Custom hooks for Button functionality
 */

import { useContext, useRef, useState, useEffect } from "react";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import { useSmoothScroll } from "../../utils/useSmoothScroll";

/**
 * Hook for shared button logic between action and link buttons
 * @param {string} url - The URL for link buttons
 * @param {string} className - Class names including 'action' if it's an action button
 * @param {Function} onCustomClick - Click handler for action buttons
 * @returns {Object} Button state and handlers
 */
export const useButtonLogic = (url, className, onCustomClick) => {
  const { size } = useContext(ScreenSizeContext);
  const smoothScrollTo = useSmoothScroll();
  
  const isActionButton = className.includes('action');
  const finalUrl = isActionButton ? '' : url;
  
  // Calculate disabled state
  const isDisabled = isActionButton
    ? !onCustomClick
    : (finalUrl === ' ' || finalUrl === '/');

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
 * Hook for wave effect animation logic
 * Manages wave size calculation and hover animations
 * @param {boolean} isDisabled - Whether the button is disabled
 * @returns {Object} Wave state and handlers
 */
export const useWaveEffect = (isDisabled) => {
  const buttonRef = useRef(null);
  const [waveSize, setWaveSize] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current;
      const width = button.offsetWidth;
      const height = button.offsetHeight;
      const diagonal = Math.sqrt(width * width + height);
      setWaveSize(diagonal * 2.25);
    }
  }, []);

  const handleMouseEnter = () => !isDisabled && setScale(0.75);
  const handleMouseLeave = () => !isDisabled && setScale(1);

  return {
    buttonRef,
    waveSize,
    scale,
    handleMouseEnter,
    handleMouseLeave
  };
};

import React, { memo } from "react";
import styles from './Button.module.css';


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
 * 
 * @param {string} title - Button text
 * @param {string} url - URL for link buttons (ignored for action buttons)
 * @param {string} style - Visual style ('solid', 'island', or 'waves')
 * @param {string} className - Additional classes, including 'action' for action buttons
 * @param {Function} onCustomClick - Click handler for action buttons (ignored for link buttons)
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

  const buttonProps = {
    type: "button",
    className: `${styles.button} ${styles[style]} ${styles[size]} ${styles[className]}`,
    onClick: handleClick,
    disabled: isDisabled,
    ...(isActionButton ? {} : { href: finalUrl })
  };

  return (
    <button {...buttonProps}>
      <span>{title}</span>
    </button>
  );
});

/**
 * Waves Button Component
 * Enhanced button with wave animation effect
 * Follows the same action/link behavior as CreateButton
 */
const WavesButtonComponent = memo(({
  title = 'Waves Button',
  url = '/',
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

  const {
    buttonRef,
    waveSize,
    scale,
    handleMouseEnter,
    handleMouseLeave
  } = useWaveEffect(isDisabled);

  const buttonProps = {
    type: "button",
    className: `${styles.button} ${styles.waves} ${styles[size]} ${className}`,
    onClick: handleClick,
    disabled: isDisabled,
    ref: buttonRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...(isActionButton ? {} : { href: finalUrl })
  };

  return (
    <button {...buttonProps}>
      <div
        className={styles.wave}
        style={{
          width: `${waveSize}px`,
          height: `${waveSize}px`,
          marginTop: `-${waveSize}px`,
          scale: `${scale}`
        }}
      />
      <span>{title}</span>
    </button>
  );
});

// Export button variants with specific styles
export const SolidButton = (props) => <CreateButton {...props} style='solid' />;
export const IslandButton = (props) => <CreateButton {...props} style='island' />;
export const WavesButton = (props) => <WavesButtonComponent {...props} />;