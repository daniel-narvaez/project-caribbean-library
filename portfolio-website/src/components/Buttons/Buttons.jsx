import React from "react";

import styles from './Buttons.module.css';

export const AnchorButton = ({title = 'Title', url = '', style = 'solid' }) => {
  return (
    <a
      href={url}
      className={`${styles[style]}`}
    >
      <span>{title}</span>
    </a>
  );
}

export const CTAButton = ({title = 'Call-to-Action', url = '', style = 'solid'}) => {
  return (
    <a
      href={url}
      className={`${styles.ctaButton} ${styles[style]}`}
    >
      <span>{title}</span>
    </a>
  );
}