import React from 'react'
import { useContext } from 'react';

import { Label } from '../../Label/Label';
import { ScreenSizeContext } from '../../../contexts/ScreenSize';
import { MenuContext } from '../../../contexts/MenuContext';
import styles from './MenuItem.module.css';


export function MainItem({
        itemLabel = 'Menu Item', 
        href = '#'
    }) {

    const { size } = useContext(ScreenSizeContext);
    const { menuOpened } = useContext(MenuContext);

    return (
        <li className={`
            ${styles.menuItem} 
            ${styles[size]} 
            ${menuOpened && styles.menuOpened} 
        `}>
            <button 
                type='button' 
                aria-label={itemLabel} 
                data-href={href} 
            >
                <Label text={itemLabel}/>
            </button>
        </li>
    );
}

export function MenuItem({
        itemLabel = 'Menu Item', 
        href = '#'
    }) {

    const { size } = useContext(ScreenSizeContext);

    return (
        <li className={`
            ${styles.menuItem} 
            ${styles[size]}
            ${styles.subItem}
        `}>
            <button 
                type='button'
                aria-label={itemLabel}
                data-href={href}
            >
                <Label text={itemLabel}/>
            </button>
        </li>
    );
}