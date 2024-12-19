import React from 'react';
import gsap from 'gsap';
import { useEffect, useContext, useRef } from 'react';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import { appIcons } from '../../data/appIcons';
import styles from './AppIcon.module.css';

export const AppIcon = ({
  iconName,
  containerColor = '#0047AB',
  iconColor = 'none',
  transitionDuration = 0.35,  // in seconds
  ease = "power2.out",
  onIconLoad = () => {}
}) => {
  const { size } = useContext(ScreenSizeContext);
  const appIcon = appIcons.findByName(iconName);
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  
  useEffect(() => {
    if (appIcon) {
      onIconLoad({ 
        appName: appIcon.appName,
        profileUrl: appIcon.profileUrl
      });
    }
  }, [iconName, onIconLoad]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        fill: containerColor,
        duration: transitionDuration,
        ease: ease
      });
    }
  }, [containerColor, transitionDuration, ease]);

  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        fill: iconColor,
        duration: transitionDuration,
        ease: ease
      });
    }
  }, [iconColor, transitionDuration, ease]);

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