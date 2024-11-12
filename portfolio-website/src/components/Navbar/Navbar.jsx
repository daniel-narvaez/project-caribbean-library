import React from 'react'

import { Title } from '../Title/Title';
import { MainMenu } from '../DropdownMenu/DropdownDesktop';

import styles from './Navbar.module.css'

export const Navbar = () => {
  return <nav className={styles.navbar}>
    <Title />
    <MainMenu />
  </nav>;
}