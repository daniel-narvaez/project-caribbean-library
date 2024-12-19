// ContactItem.jsx
import React from "react";
import { useState, useContext, useEffect, useRef } from 'react';
import { AppIcon } from "../AppIcon/AppIcon";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import styles from './ContactItem.module.css';

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

export const ContactItem = ({ iconName = 'linkedin' }) => {
  const itemConfig = useRef(INITIAL_ITEM_CONFIG);
  const [appName, setAppName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [containerColor, setContainerColor] = useState('#ece9e4');
  const [iconColor, setIconColor] = useState('#0047ab');
  const [transitionDuration, setTransitionDuration] = useState('350ms');
  const [transitionEase, setTransitionEase] = useState('cubic-bezier(0.21, 0.65, 0.32, 0.89)')
  const { size } = useContext(ScreenSizeContext);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    itemConfig.current = {
      ...INITIAL_ITEM_CONFIG,
      TRANSITIONS: {
        ...INITIAL_ITEM_CONFIG.TRANSITIONS
      },
      COLORS: {
        ...INITIAL_ITEM_CONFIG.COLORS,
        CONTAINER: {
          ...INITIAL_ITEM_CONFIG.COLORS.CONTAINER,
          NORMAL: root.getPropertyValue('--color-bg1').trim(),
          HOVER: root.getPropertyValue('--color-link-hover').trim(),
          ACTIVE: root.getPropertyValue('--color-link-active').trim()
        },
        ICON:  {
          ...INITIAL_ITEM_CONFIG.COLORS.ICON,
          NORMAL: root.getPropertyValue('--color-link').trim(),
          HOVER: root.getPropertyValue('--color-bg1-hover').trim(),
          ACTIVE: root.getPropertyValue('--color-bg1-active').trim()
        }
      }
    };
  }, []);

  const handleIconLoad = ({ appName, profileUrl }) => {
    setAppName(appName);
    setProfileUrl(profileUrl);
  };

  const handleMouseEnter = () => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.HOVER);
    setIconColor(itemConfig.current.COLORS.ICON.HOVER);
    setTransitionDuration(itemConfig.current.TRANSITIONS.DURATION.HOVER);
    setTransitionEase(itemConfig.current.TRANSITIONS.EASE.HOVER);
  };

  const handleMouseLeave = () => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.NORMAL);
    setIconColor(itemConfig.current.COLORS.ICON.NORMAL);
  };

  const handleMouseDown = () => {
    setContainerColor(itemConfig.current.COLORS.CONTAINER.ACTIVE);
    setIconColor(itemConfig.current.COLORS.ICON.ACTIVE);
    setTransitionDuration(itemConfig.current.TRANSITIONS.DURATION.ACTIVE);
    setTransitionEase(itemConfig.current.TRANSITIONS.EASE.ACTIVE);
  };

  return (
    <div className={`${styles.contactItem} ${styles[size]}`}>
      <a
        target="_blank"
        href={profileUrl}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseEnter}
      >
        <AppIcon 
          iconName={iconName}
          containerColor={containerColor}
          iconColor={iconColor}
          transitionDuration={transitionDuration}
          ease={transitionEase}
          onIconLoad={handleIconLoad}
        />
      </a>
      <span>
        {appName}
      </span>
    </div>
  );
};