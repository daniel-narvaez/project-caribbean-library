// Footer.jsx
import React from 'react';
import { useRef, useEffect } from 'react';
import styles from './Footer.module.css';

const INITIAL_WAVE_CONFIG = {
  // COLOR: '#00a9ce'
  COLOR: '#0047ab'
};

const Footer = ({ children }) => {
  const waveConfig = useRef(INITIAL_WAVE_CONFIG);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    waveConfig.current = {
      ...INITIAL_WAVE_CONFIG,
      COLOR: root.getPropertyValue('--color-link').trim()
    };
  }, []);

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.waves}>
        <svg
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
          className={styles.wavesSvg}
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className={styles.parallax}>
            <use 
              href="#gentle-wave" 
              x="48" 
              y="0" 
              fill={waveConfig.current.COLOR} 
              opacity="0.7" 
            />
            <use 
              href="#gentle-wave" 
              x="48" 
              y="3" 
              fill={waveConfig.current.COLOR} 
              opacity="0.5" 
            />
            <use 
              href="#gentle-wave" 
              x="48" 
              y="5" 
              fill={waveConfig.current.COLOR} 
              opacity="0.3" 
            />
            <use 
              href="#gentle-wave" 
              x="48" 
              y="7" 
              fill={waveConfig.current.COLOR} 
              opacity="1" 
            />
          </g>
        </svg>
      </div>
      <div className={styles.footerBackground}>
        <div className={styles.footerContent}>
          {children}
        </div>
        <div className={styles.footerBottom}>
          <span>
            &copy; Daniel Narvaez. All content and trademarks property of their respective owners.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;