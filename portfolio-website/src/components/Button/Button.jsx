import React, { memo, useContext } from "react";
import styles from './Button.module.css';
import { useButtonLogic } from "./buttonLogic";

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
 * - Optional newTab prop to open links in new tab
 */
export const CreateButton = memo(({
  title = 'Button',
  url = '/',
  style = 'solid',
  className = '',
  onCustomClick,
  newTab = false
}) => {
  const {
    size,
    isActionButton,
    isDisabled,
    finalUrl,
    handleClick
  } = useButtonLogic(url, className, onCustomClick);

  const buttonClassName = `${styles.button} ${styles[style]} ${styles[size]} ${styles[className]}`;

  // Action button (using <button>)
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

  // Link button (using <a>)
  const newTabProps = newTab ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  return (
    <a
      href={isDisabled ? "#" : finalUrl}
      className={buttonClassName}
      onClick={handleClick}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      {...newTabProps}
    >
      <span>{title}</span>
    </a>
  );
});

// Export button variants with specific styles
export const SolidButton = (props) => <CreateButton {...props} style='solid' />;
export const IslandButton = (props) => <CreateButton {...props} style='island' />;