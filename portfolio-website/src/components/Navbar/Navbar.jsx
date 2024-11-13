import React, { useContext } from 'react'

import { Title } from '../Title/Title';
import { Chevron } from '../Chevron/Chevron';
import { MobileDropdown } from '../DropdownMenu/DropdownMobile';
import { DesktopDropdown } from '../DropdownMenu/DropdownDesktop';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './Navbar.module.css'

export const Navbar = () => {
  const { size } = useContext(ScreenSizeContext);
  return <nav className={styles.navbar}>
    <Title />
    {size === 'Mobile' ? 
      <MobileDropdown /> : 
      <DesktopDropdown />
    }
  </nav>;
}