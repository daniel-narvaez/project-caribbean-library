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
 * - Dynamic icon loading from appIcons collection
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
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import { appIcons } from '../../data/appIcons';
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
 * @param {string} props.iconName - Name of the icon to display
 * @param {string} [props.containerColor] - Color for the container path
 * @param {string} [props.iconColor] - Color for the icon path
 * @param {number} [props.transitionDuration] - Animation duration in seconds
 * @param {string} [props.ease] - GSAP easing function
 * @param {Function} [props.onIconLoad] - Callback fired when icon loads
 */
export const AppIcon = ({
    iconName,
    containerColor = DEFAULT_CONFIG.CONTAINER_COLOR,
    iconColor = DEFAULT_CONFIG.ICON_COLOR,
    transitionDuration = DEFAULT_CONFIG.DURATION,
    ease = DEFAULT_CONFIG.EASE,
    onIconLoad = () => {}
}) => {
    const { size } = useContext(ScreenSizeContext);
    const containerRef = useRef(null);
    const iconRef = useRef(null);

    // Find icon in collection
    const appIcon = appIcons.findByName(iconName);

    // Handle icon load callback
    useEffect(() => {
        if (appIcon) {
            onIconLoad({
                appName: appIcon.appName,
                profileUrl: appIcon.profileUrl
            });
        }
    }, [iconName, onIconLoad, appIcon]);

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
    if (!appIcon) {
        console.warn(`Icon "${iconName}" not found`);
        return null;
    }

    const paths = appIcon.getPaths();

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