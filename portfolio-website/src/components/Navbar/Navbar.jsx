import React, { useContext, useRef, useEffect, useState } from 'react';
import { Title } from '../Title/Title';
import { MobileDropdown } from '../DropdownMenu/DropdownMobile';
import { DesktopDropdown } from '../DropdownMenu/DropdownDesktop';
import { DeviceContext } from '../../contexts/DeviceContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { device } = useContext(DeviceContext);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = lastScrollY.current - currentScrollY;
  
      // Show navbar at the very top of the page
      if (currentScrollY < 16) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
  
      // Only show navbar when scrolling up more than the threshold
      if (currentScrollY > lastScrollY.current)
        setIsVisible(false);
      else if (scrollDifference > 16) // Check if scrolled up more than the threshold
        setIsVisible(true);
      
      lastScrollY.current = currentScrollY;
    };
  
    // Rest of the code remains the same...
    let timeoutId;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        controlNavbar();
        timeoutId = null;
      }, 50);
    };
  
    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <nav
      className={`
        ${styles.navbar}
        ${styles[device]}
        ${isVisible ? styles.visible : styles.hidden}
      `}
    >
      <Title />
      {device === 'Mobile' ? <MobileDropdown /> : <DesktopDropdown />}
    </nav>
  );
};

export default Navbar;