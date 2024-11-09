import React from 'react'

import { Title } from '../Title/Title';
import { MainMenu } from '../MainMenu/MainMenu';
import { NewMenu } from '../MainMenu/NewMenu/Menu';

import { MenuProvider } from '../../contexts/MenuContext';
import styles from './Navbar.module.css'

export const Navbar = () => {
  return <nav className={styles.navbar}>
    <Title />
    <NewMenu menuLabel={"Dropdown Menu"} items={[{title: "Games"}, {title: "Contact"}, {title:'About'}]} />
    <MenuProvider>
      <MainMenu />
    </MenuProvider>
  </nav>;
}