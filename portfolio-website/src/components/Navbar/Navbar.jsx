import React, { useContext, useRef, useEffect } from 'react'

import { Title } from '../Title/Title';
import { MobileDropdown } from '../DropdownMenu/DropdownMobile';
import { DesktopDropdown } from '../DropdownMenu/DropdownDesktop';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './Navbar.module.css'

export const Navbar = () => {
  const { size } = useContext(ScreenSizeContext);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const updateNavbarOpacity = () => {
      if (!backgroundRef.current) 
        return;
      
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollPercentage = Math.min(scrollPosition / viewportHeight, 1);
      
      backgroundRef.current.style.opacity = scrollPercentage;
    };

    window.addEventListener('scroll', updateNavbarOpacity);
    updateNavbarOpacity();

    return () => window.removeEventListener('scroll', updateNavbarOpacity);
  }, []);

  return <nav 
    className={`
      ${styles.navbar}
      ${styles[size]}
    `}
  >
    {/* <div 
      className={styles.background}
      // ref={backgroundRef}
    /> */}
    <Title />
    {size === 'Mobile' ? 
      <MobileDropdown /> : 
      <DesktopDropdown />
    }
  </nav>;
}