// Footer.jsx
import React from 'react';
import { useRef, useEffect, useContext } from 'react';
import { ContactItem } from '../ContactItem/ContactItem';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import styles from './Footer.module.css';

const INITIAL_WAVE_CONFIG = {
  // COLOR: '#00a9ce'
  COLOR: '#0047ab'
};

export const Footer = ({ children }) => {
  const waveConfig = useRef(INITIAL_WAVE_CONFIG);
  const { size } = useContext(ScreenSizeContext);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    waveConfig.current = {
      ...INITIAL_WAVE_CONFIG,
      COLOR: root.getPropertyValue('--color-link').trim()
    };
  }, []);

  return (
    <footer className={`${styles.footerContainer} ${styles[size]}`}>
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
      <div className={`${styles.footerContent} ${styles[size]}`}>
        {children}
      </div>
      <div className={`${styles.footerBottom} ${styles[size]}`}>
        <p>
          &copy; Daniel Narvaez. All rights reserved. <br/>
          v0.0.1
        </p>
      </div>
    </footer>
  );
};

export const FooterNav = () => {
  const { size } = useContext(ScreenSizeContext);

  return (
    <>
      <div className={`${styles.footerCta} ${styles[size]}`}>
        <span>
          Find me around the web
        </span>
      </div>
      <div className={`${styles.footerNav} ${styles[size]}`}>
        <ContactItem iconName='Itch' />
        <ContactItem iconName='GitHub' />
        <ContactItem iconName='LinkedIn' />
        <ContactItem iconName='Bluesky' />
        <ContactItem iconName='TheXPlace' />
        <ContactItem iconName='YoungArts Post' />
        <ContactItem iconName='Discord' />
      </div>
    </>
  )
}