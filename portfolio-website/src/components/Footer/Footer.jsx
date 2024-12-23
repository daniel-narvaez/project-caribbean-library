/**
 * Footer.jsx
 * =========
 * 
 * Overview:
 * A responsive footer component featuring an animated wave effect and social media links.
 * Includes a wave SVG animation and a grid of contact items for social platforms.
 * 
 * Key Features:
 * - Animated wave effect with parallax scrolling
 * - Responsive design using ScreenSizeContext
 * - Dynamic color handling using CSS custom properties
 * - Social media grid with icon support
 * 
 * Technical Implementation:
 * - SVG waves with variable opacity for depth effect
 * - CSS custom property integration for theming
 * - Modular component structure with FooterNav
 */

import { useRef, useEffect, useContext, memo } from 'react';
import { ContactItem } from '../ContactItem/ContactItem';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import styles from './Footer.module.css';
import { Chapter } from '../Chapter/Chapter';

// Configuration for wave animation and contact items
const WAVE_CONFIG = {
  COLOR: '#0047ab',  // Default color if CSS variable isn't available
  WAVE_PATTERNS: [
    { y: 0, opacity: 0.7 },
    { y: 3, opacity: 0.5 },
    { y: 5, opacity: 0.3 },
    { y: 7, opacity: 1.0 }
  ]
};

const CONTACT_PLATFORMS = [
  'Itch',
  'GitHub',
  'LinkedIn',
  'Bluesky',
  'TheXPlace',
  'YoungArts Post',
  'Discord',
];

/**
 * Main Footer component
 * Renders the wave animation and contains footer content
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Content to be rendered in the footer
 */
export const Footer = ({ children }) => {
  const waveConfig = useRef(WAVE_CONFIG);
  const { size } = useContext(ScreenSizeContext);

  // Update wave color from CSS custom property if available
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const linkColor = root.getPropertyValue('--color-link').trim();
    
    if (linkColor) {
      waveConfig.current = {
        ...WAVE_CONFIG,
        COLOR: linkColor
      };
    }
  }, []);

  return (
    <footer>
      <Chapter className={`${styles.footerContainer} ${styles[size]}`}>
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
              {WAVE_CONFIG.WAVE_PATTERNS.map(({ y, opacity }, index) => (
                <use
                  key={`wave-${index}`}
                  href="#gentle-wave"
                  x="48"
                  y={y}
                  fill={waveConfig.current.COLOR}
                  opacity={opacity}
                />
              ))}
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
      </Chapter>
    </footer>
  );
};

/**
 * FooterNav component
 * Displays social media links and contact information
 * Memoized to prevent unnecessary re-renders
 */
export const FooterNav = memo(() => {
  const { size } = useContext(ScreenSizeContext);

  return (
    <>
      <div className={`${styles.footerCta} ${styles[size]}`}>
        <span>Find me around the web</span>
      </div>
      <div className={`${styles.footerNav} ${styles[size]}`}>
        {CONTACT_PLATFORMS.map(platform => (
          <ContactItem key={platform} iconName={platform} />
        ))}
      </div>
    </>
  );
});

FooterNav.displayName = 'FooterNav';