import React from 'react'

import { Title } from '../Title/Title';
import { MainMenu } from '../MainMenu/MainMenu';
import { MainDropdown } from '../DropdownMenu/DropdownMenu';

import { MenuProvider } from '../../contexts/MenuContext';

import styles from './Navbar.module.css'

import { mainMenuData } from '../../dropdownItemData';

export const Navbar = () => {
  return <nav className={styles.navbar}>
    <Title />
    <MainDropdown buttonLabel={'Main Menu'} items={mainMenuData} />
    <MenuProvider>
      <MainMenu />
    </MenuProvider>
  </nav>;
}