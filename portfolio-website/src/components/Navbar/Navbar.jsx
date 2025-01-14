import React, { useContext, useRef, useEffect, useState } from 'react';
import { Title } from '../Title/Title';
import { MobileDropdown } from '../DropdownMenu/DropdownMobile';
import { DesktopDropdown } from '../DropdownMenu/DropdownDesktop';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { size } = useContext(ScreenSizeContext);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Add scroll event listener with throttling
    let timeoutId;
    const throttledScroll = () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        controlNavbar();
        timeoutId = null;
      }, 50); // Adjust this value to control sensitivity
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
        ${styles[size]}
        ${isVisible ? styles.visible : styles.hidden}
      `}
    >
      <Title />
      {size === 'Mobile' ? <MobileDropdown /> : <DesktopDropdown />}
    </nav>
  );
};

export default Navbar;