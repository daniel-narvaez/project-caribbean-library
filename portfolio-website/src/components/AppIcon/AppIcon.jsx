/**
 * AppIcon.jsx
 * ==========
 *
 * Overview:
 * A responsive SVG icon component with animated color transitions.
 * Renders platform icons with customizable colors and animations.
 *
 * Key Features:
 * - GSAP-powered color transitions
 * - Direct icon object usage
 * - Responsive sizing through ScreenSizeContext
 * - Customizable animation timing and easing
 *
 * Technical Implementation:
 * - Uses GSAP for smooth color transitions
 * - Ref-based DOM manipulation for animations
 * - Context-based responsive design
 * - Prop-based customization
 */
import { useEffect, useContext, useRef } from 'react';
import gsap from 'gsap';
import { DeviceContext } from '../../contexts/DeviceContext';
import styles from './AppIcon.module.css';

/**
 * Default animation configuration
 */
const DEFAULT_CONFIG = {
  CONTAINER_COLOR: '#0047AB',
  ICON_COLOR: 'none',
  DURATION: 0.35,
  EASE: 'power2.out'
};

/**
 * AppIcon Component
 * Renders an animated SVG icon with container and icon paths
 *
 * @param {Object} props
 * @param {Object} props.icon - Icon object containing paths and metadata
 * @param {string} [props.containerColor] - Color for the container path
 * @param {string} [props.iconColor] - Color for the icon path
 * @param {number} [props.transitionDuration] - Animation duration in seconds
 * @param {string} [props.ease] - GSAP easing function
 * @param {Function} [props.onIconLoad] - Callback fired when icon loads
 */
export const AppIcon = ({
  icon,
  containerColor = DEFAULT_CONFIG.CONTAINER_COLOR,
  iconColor = DEFAULT_CONFIG.ICON_COLOR,
  transitionDuration = DEFAULT_CONFIG.DURATION,
  ease = DEFAULT_CONFIG.EASE,
  onIconLoad = () => {}
}) => {
  const { size } = useContext(DeviceContext);
  const containerRef = useRef(null);
  const iconRef = useRef(null);

  // Handle icon load callback
  useEffect(() => {
    if (icon) {
      onIconLoad({
        appName: icon.appName,
        profileUrl: icon.profileUrl
      });
    }
  }, [icon, onIconLoad]);

  // Animate container color
  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        fill: containerColor,
        duration: transitionDuration,
        ease: ease
      });
    }
  }, [containerColor, transitionDuration, ease]);

  // Animate icon color
  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        fill: iconColor,
        duration: transitionDuration,
        ease: ease
      });
    }
  }, [iconColor, transitionDuration, ease]);

  // Handle missing icon
  if (!icon) {
    console.warn('No icon provided to AppIcon component');
    return null;
  }

  const paths = icon.getPaths();

  return (
    <svg
      className={`${styles.appIcon} ${styles[size]}`}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={containerRef}
        id="container"
        d={paths.container}
        fill={containerColor}
      />
      <path
        ref={iconRef}
        id="icon"
        d={paths.icon}
        fill={iconColor}
      />
    </svg>
  );
};