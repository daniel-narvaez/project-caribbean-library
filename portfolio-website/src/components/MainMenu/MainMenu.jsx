import React from 'react';
import { useState, useContext } from 'react';

import { Menu } from './Menu/Menu';
import { Burgershelf } from '../Burgershelf/Burgershelf';

import { ScreenSizeContext } from '../../contexts/ScreenSize';
import { MenuProvider, MenuContext } from '../../contexts/MenuContext';

import styles from './MainMenu.module.css';

export const MainMenu = () => {
    const { size } = useContext(ScreenSizeContext);
    const { menuOpened } = useContext(MenuContext);

    return (
        <ul 
            className={`
                ${styles.mainMenu}
                ${styles[size]}
                ${menuOpened && styles.menuOpened}
            `}
        >
            <Burgershelf />
            <MenuProvider>
                <Menu 
                    mainLabel='Games' 
                    submenuItems={[
                        { itemLabel: 'Game 1' },
                        { itemLabel: 'Game 2' },
                        { itemLabel: 'Game 3' }
                    ]}
                />
            </MenuProvider>
            <MenuProvider>
                <Menu 
                    mainLabel='About'
                />
            </MenuProvider>
            <MenuProvider>
                <Menu 
                    mainLabel='Contact'
                />
            </MenuProvider>
        </ul>
    );
}