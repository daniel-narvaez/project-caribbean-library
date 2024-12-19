import React from 'react';
import { useEffect, useContext } from 'react';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import { appIcons } from '../../data/appIcons';
import styles from './AppIcon.module.css';

export const AppIcon = ({ 
  iconName,
  containerColor = '#0047AB',
  iconColor = 'none',
  onIconLoad = () => {}
}) => {
  const { size } = useContext(ScreenSizeContext);
  const appIcon = appIcons.findByName(iconName);
  
  useEffect(() => {
    if (appIcon) {
      onIconLoad({ 
        appName: appIcon.appName,
        profileUrl: appIcon.profileUrl
      });
    }
  }, [iconName, onIconLoad]);

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
        id="container" 
        d={paths.container} 
        fill={containerColor}
      />
      <path 
        id="icon" 
        d={paths.icon} 
        fill={iconColor}
      />
    </svg>
  );
};