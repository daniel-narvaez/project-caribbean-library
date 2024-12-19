// ContactItem.jsx
import React from "react";
import { useState, useContext } from 'react';
import { AppIcon } from "../AppIcon/AppIcon";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import styles from './ContactItem.module.css';

export const ContactItem = ({ iconName = 'linkedin' }) => {
  const [appName, setAppName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [containerColor, setContainerColor] = useState('#0047AB');
  const [iconColor, setIconColor] = useState('none');
  const { size } = useContext(ScreenSizeContext);

  const handleIconLoad = ({ appName, profileUrl }) => {
    setAppName(appName);
    setProfileUrl(profileUrl);
  };

  const handleMouseEnter = () => {
    setContainerColor('#ece9e4');
    setIconColor('#0047AB');
  };

  const handleMouseLeave = () => {
    setContainerColor('#0047AB');
    setIconColor('none');
  };

  const handleMouseDown = () => {
    setContainerColor('#c9c6c1');
    setIconColor('#0047AB');
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
          onIconLoad={handleIconLoad}
        />
      </a>
      <span>
        {appName}
      </span>
    </div>
  );
};