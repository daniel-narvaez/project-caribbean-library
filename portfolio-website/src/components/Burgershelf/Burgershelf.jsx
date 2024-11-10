import React from 'react';
import styles from './Burgershelf.module.css'; // Keep the same styles

export const Burgershelf = ({ isOpen }) => {
  return (
    <div
      className={`
        ${styles.burgershelf}
        ${isOpen && styles.open}
      `}
    >
      <div className={`
        ${styles.icon}
        ${isOpen && styles.open}
        `}>
        <span className={styles.one}></span>
        <span className={styles.two}></span>
        <span className={styles.three}></span>
      </div>
    </div>
  );
};