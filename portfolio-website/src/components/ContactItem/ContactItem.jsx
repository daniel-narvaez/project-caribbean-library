/**
 * ContactItem.jsx
 * =============
 * 
 * Overview:
 * A contact link component featuring an interactive icon with hover and active states.
 * Integrates with CSS custom properties for theming and provides smooth state transitions.
 * 
 * Key Features:
 * - Interactive states (normal, hover, active)
 * - CSS variable integration for theming
 * - Smooth state transitions
 * - Responsive sizing
 * 
 * Technical Implementation:
 * - Uses CSS custom properties for dynamic theming
 * - Manages complex state transitions
 * - Handles mouse events for interaction
 * - Maintains configuration in ref to prevent rerenders
 */

import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { AppIcon } from "../AppIcon/AppIcon";
import { DeviceContext } from "../../contexts/DeviceContext";
import styles from './ContactItem.module.css';

/**
 * Default configuration for transitions and colors
 */
const INITIAL_ITEM_CONFIG = {
    TRANSITIONS: {
        DURATION: {
            HOVER: '0.35',
            ACTIVE: '0.1'
        },
        EASE: {
            HOVER: 'cubic-bezier(0.21, 0.65, 0.32, 0.89)',
            ACTIVE: 'ease'
        }
    },
    COLORS: {
        CONTAINER: {
            NORMAL: '#ece9e4',
            HOVER: '#00a9ce',
            ACTIVE: '#007a99'
        },
        ICON: {
            NORMAL: '#0047ab',
            HOVER: '#f7f5f2',
            ACTIVE: '#dcd8d1'
        }
    }
};

/**
 * ContactItem Component
 * A clickable contact item with an animated icon and label
 * 
 * @param {Object} props
 * @param {string} [props.iconName='linkedin'] - Name of the icon to display
 */
export const ContactIcon = ({ icon = appIcons.linkedin }) => {
  // Refs and state
  const itemConfig = useRef(INITIAL_ITEM_CONFIG);
  const [appName, setAppName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [containerColor, setContainerColor] = useState(INITIAL_ITEM_CONFIG.COLORS.CONTAINER.NORMAL);
  const [iconColor, setIconColor] = useState(INITIAL_ITEM_CONFIG.COLORS.ICON.NORMAL);
  const [transitionDuration, setTransitionDuration] = useState('350ms');
  const [transitionEase, setTransitionEase] = useState(INITIAL_ITEM_CONFIG.TRANSITIONS.EASE.HOVER);
  const { device } = useContext(DeviceContext);

  // Initialize colors from CSS custom properties
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    itemConfig.current = {
      ...INITIAL_ITEM_CONFIG,
      COLORS: {
        CONTAINER: {
          NORMAL: root.getPropertyValue('--color-bg1').trim(),
          HOVER: root.getPropertyValue('--color-link-hover').trim(),
          ACTIVE: root.getPropertyValue('--color-link-active').trim()
        },
        ICON: {
          NORMAL: root.getPropertyValue('--color-link').trim(),
          HOVER: root.getPropertyValue('--color-bg1-hover').trim(),
          ACTIVE: root.getPropertyValue('--color-bg1-active').trim()
        }
      }
    };
    // Initialize with themed colors
    setContainerColor(itemConfig.current.COLORS.CONTAINER.NORMAL);
    setIconColor(itemConfig.current.COLORS.ICON.NORMAL);
  }, []);

  // Event handlers
  const handleIconLoad = useCallback(({ appName, profileUrl }) => {
    setAppName(appName);
    setProfileUrl(profileUrl);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.HOVER);
    setIconColor(itemConfig.current.COLORS.ICON.HOVER);
    setTransitionDuration(itemConfig.current.TRANSITIONS.DURATION.HOVER);
    setTransitionEase(itemConfig.current.TRANSITIONS.EASE.HOVER);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.NORMAL);
    setIconColor(itemConfig.current.COLORS.ICON.NORMAL);
  }, []);

  const handleMouseDown = useCallback(() => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.ACTIVE);
    setIconColor(itemConfig.current.COLORS.ICON.ACTIVE);
    setTransitionDuration(itemConfig.current.TRANSITIONS.DURATION.ACTIVE);
    setTransitionEase(itemConfig.current.TRANSITIONS.EASE.ACTIVE);
  }, []);

  return (
    <div className={`${styles.contactIcon} ${styles[device]}`}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={profileUrl}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseLeave}
      >
        <AppIcon
          icon={icon}
          containerColor={containerColor}
          iconColor={iconColor}
          transitionDuration={transitionDuration}
          ease={transitionEase}
          onIconLoad={handleIconLoad}
        />
      </a>
      <span>{appName}</span>
    </div>
  );
};

export const ContactBook = ({ icon = appIcons.linkedin }) => {
  const itemConfig = useRef(INITIAL_ITEM_CONFIG);
  const [appName, setAppName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [containerColor, setContainerColor] = useState(INITIAL_ITEM_CONFIG.COLORS.CONTAINER.NORMAL);
  const [iconColor, setIconColor] = useState(INITIAL_ITEM_CONFIG.COLORS.ICON.NORMAL);
  const [transitionDuration, setTransitionDuration] = useState('350ms');
  const [transitionEase, setTransitionEase] = useState(INITIAL_ITEM_CONFIG.TRANSITIONS.EASE.HOVER);
  const { device } = useContext(DeviceContext);

  // Initialize colors from CSS custom properties
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    itemConfig.current = {
      ...INITIAL_ITEM_CONFIG,
      COLORS: {
        CONTAINER: {
          NORMAL: root.getPropertyValue('--color-bg1').trim(),
          HOVER: root.getPropertyValue('--color-bg1-hover').trim(),
          ACTIVE: root.getPropertyValue('--color-bg1-active').trim()
        },
        ICON: {
          NORMAL: root.getPropertyValue('--color-link').trim(),
          HOVER: root.getPropertyValue('--color-link-hover').trim(),
          ACTIVE: root.getPropertyValue('--color-link-active').trim()
        }
      }
    };
    // Initialize with themed colors
    setContainerColor(itemConfig.current.COLORS.CONTAINER.NORMAL);
    setIconColor(itemConfig.current.COLORS.ICON.NORMAL);
  }, []);

  // Event handlers
  const handleIconLoad = useCallback(({ appName, profileUrl }) => {
    setAppName(appName);
    setProfileUrl(profileUrl);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.HOVER);
    setIconColor(itemConfig.current.COLORS.ICON.HOVER);
    setTransitionDuration(itemConfig.current.TRANSITIONS.DURATION.HOVER);
    setTransitionEase(itemConfig.current.TRANSITIONS.EASE.HOVER);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.NORMAL);
    setIconColor(itemConfig.current.COLORS.ICON.NORMAL);
  }, []);

  const handleMouseDown = useCallback(() => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.ACTIVE);
    setIconColor(itemConfig.current.COLORS.ICON.ACTIVE);
    setTransitionDuration(itemConfig.current.TRANSITIONS.DURATION.ACTIVE);
    setTransitionEase(itemConfig.current.TRANSITIONS.EASE.ACTIVE);
  }, []);

  return (
    <a
      className={`
        ${styles.contactBook}
      `}
      target="_blank"
      rel="noopener noreferrer"
      href={profileUrl}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseLeave}
    >
      <div
        className={`
          ${styles.spine}
          ${styles.top}
        `}
      />
      <div
        className={`
          ${styles.spine}
          ${styles.middle}
        `}
      >
        <span>{appName}</span>
      </div>
      <div
        className={`
          ${styles.spine}
          ${styles.bottom}
        `}
      >
        <AppIcon
          icon={icon}
          containerColor={containerColor}
          iconColor={iconColor}
          transitionDuration={transitionDuration}
          ease={transitionEase}
          onIconLoad={handleIconLoad}
        />
      </div>
    </a>
  );
}