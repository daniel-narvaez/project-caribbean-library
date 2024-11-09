import React from 'react';
import { useRef, useEffect, useContext } from 'react';

import { MainItem, MenuItem } from '../MenuItem/MenuItem';

import { ScreenSizeContext } from '../../../contexts/ScreenSize';
import { MenuContext } from '../../../contexts/MenuContext';

import styles from './Menu.module.css';

import { zeroToAutoHeight } from '../../../utils';


const MenuWrapper = ({ children, onMenuChange, submenuRef, menuOpened}) => (
    <ul
        className={`${styles.wrapper} ${menuOpened && styles.menuOpened}`}
        onMouseEnter={() => {
            zeroToAutoHeight(submenuRef.current, true);
            onMenuChange(true);
        }}
        onMouseLeave={() => {
            zeroToAutoHeight(submenuRef.current, false);
            onMenuChange(false);
        }}
    >
        {children}
    </ul>
);

export function Menu({mainLabel = 'Main Item', submenuItems = []}) {
    const submenuRef = useRef(null);
    const { size } = useContext(ScreenSizeContext);
    const { menuOpened, setMenuOpened } = useContext(MenuContext);
    
    return (
        <li className={`
            ${styles.menu} 
            ${styles[size]}
        `}>
            <MenuWrapper
                onMenuChange={setMenuOpened}
                submenuRef={submenuRef}
                menuOpened={menuOpened}
            >
                <MainItem itemLabel={mainLabel} />
                <li>
                    <ul className={styles.submenu} ref={submenuRef}>
                        <SubmenuItems submenuItems={submenuItems} />
                    </ul>
                </li>
            </MenuWrapper>
        </li>
    );
}

function SubmenuItems({submenuItems}) {
    return submenuItems.map((item, index) => (
        <MenuItem 
            key={index} 
            itemLabel={item.itemLabel}
            href={item.href}
        />
    ));
}