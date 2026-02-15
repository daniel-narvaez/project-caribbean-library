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
import { ContactIcon } from '../ContactItem/ContactItem';
import styles from './Footer.module.css';
import typographies from '../../typography.module.css';
import { Chapter } from '../Chapter/Chapter';
import { socialMediaData } from '../../data/appIcons';

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
  'Machinations'
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
      <Chapter 
        id='footer'
        className={`${styles.footerContainer}`}
      >
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

        <div className={`${styles.footerContent}`}>
          {children}
        </div>

        <div className={`${styles.footerBottom}`}>
          <p className={`${typographies.b3}`}>
            &copy; {new Date().getFullYear()} designed & developed by Daniel Narvaez. <br/>
            All rights reserved.
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
  return (
    <>
      <div className={`${styles.footerCta}`}>
        <h4 className={`${typographies.h4} ${styles.ctaHeading}`}>Find me around the web</h4>
      </div>
      <div className={`${styles.footerNav}`}>
        {Object.values(socialMediaData).map(icon => (
          <ContactIcon 
            key={icon.appName} 
            icon={icon} 
          />
        ))}
      </div>
    </>
  );
});

FooterNav.displayName = 'FooterNav';