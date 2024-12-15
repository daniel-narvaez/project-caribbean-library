import React, { memo } from "react";

import { useSmoothScroll } from "../../utils/useSmoothScroll";

import styles from './Button.module.css';

export const CreateButton = memo(({
  title = 'Button',
  url = '',
  style = 'solid',
  onCustomClick // no default value needed, will be undefined if not provided
}) => {
  const smoothScrollTo = useSmoothScroll();

  const handleClick = (e) => {
    // Check if onCustomClick exists before calling it
    if (onCustomClick) {
      onCustomClick(e);
      return;
    }

    // If it's a hash link, do smooth scroll
    if (url.startsWith('#')) {
      e.preventDefault();
      const targetId = url.slice(1);
      smoothScrollTo(targetId);
    }
  };

  return (
    <button
      type="button"
      href={url}
      className={`${styles.button} ${styles[style]}`}
      onClick={handleClick}
    >
      <span>{title}</span>
    </button>
  );
});

export const SolidButton = (props) => <CreateButton {...props} style = 'solid'/>;

export const IslandButton = (props) => <CreateButton {...props} style = 'island'/>;

export const WavesButton = (props) => <CreateButton {...props} style = 'waves'/>;