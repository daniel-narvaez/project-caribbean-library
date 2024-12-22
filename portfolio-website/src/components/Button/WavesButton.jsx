/**
 * Waves Button Component
 * Standalone implementation with wave animation
 */
import React, { useRef, useState, useEffect } from "react";
import styles from './WavesButton.module.css';
import { useButtonLogic } from './ButtonLogic';  // We'll extract this to a separate file

export const WavesButton = ({
  title = 'Waves Button',
  url = '/',
  className = '',
  onCustomClick,
  newTab = false
}) => {
  // Wave animation state
  const buttonRef = useRef(null);
  const [waveSize, setWaveSize] = useState(0);
  const [scale, setScale] = useState(1);

  // Reuse the same button logic for consistency
  const {
    size,
    isActionButton,
    isDisabled,
    finalUrl,
    handleClick
  } = useButtonLogic(url, className, onCustomClick);

  // Calculate wave size
  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current;
      const width = button.offsetWidth;
      const height = button.offsetHeight;
      const diagonal = Math.sqrt(width * width + height);
      setWaveSize(diagonal * 2.25);
    }
  }, []);

  // Wave animation handlers
  const handleMouseEnter = () => !isDisabled && setScale(0.75);
  const handleMouseLeave = () => !isDisabled && setScale(1);

  const buttonClassName = `${styles.button} ${styles.waves} ${styles[size]} ${styles[className]}`;

  // Wave element that's shared between button and anchor
  const waveElement = (
    <div
      className={styles.wave}
      style={{
        width: `${waveSize}px`,
        height: `${waveSize}px`,
        marginTop: `-${waveSize}px`,
        transform: `scale(${scale})`
      }}
    />
  );

  if (isActionButton) {
    return (
      <button
        type="button"
        ref={buttonRef}
        className={buttonClassName}
        onClick={handleClick}
        disabled={isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {waveElement}
        <span>{title}</span>
      </button>
    );
  }

  // Link button (using <a>)
  const newTabProps = newTab ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  return (
    <a
      href={isDisabled ? "#" : finalUrl}
      ref={buttonRef}
      className={buttonClassName}
      onClick={handleClick}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...newTabProps}
    >
      {waveElement}
      <span>{title}</span>
    </a>
  );
};