import React from 'react'
import { useRef, useState, useContext } from 'react';

import { ScreenSizeContext } from '../../contexts/ScreenSize';
import { MenuContext } from '../../contexts/MenuContext';

import styles from './BurgerBooksButton.module.css'

export const BurgerBooksButton = () => {
    const buttonRef = useRef(null);
    const { size } = useContext(ScreenSizeContext);
    const { menuOpened, setMenuOpened } = useContext(MenuContext);

    const handleClick = () => {
        // setElementSize(buttonRef.current.parentElement, !menuOpened, {
        //     measureNatural: false,
        //     dimensions: {
        //         collapsedWidth: '36px',
        //         collapsedHeight: '36px',
        //         expandedWidth: 'auto',
        //         expandedHeight: 'auto',
        //     }
        // });
        setMenuOpened(!menuOpened);
    };

    return (
        <button 
            ref={buttonRef}
            className={`
                ${styles.burgerBooksButton}
                ${menuOpened && styles.menuOpened}
            `}
            onClick={handleClick}
        >
            <div className={styles.icon}>
                <span className={styles.one}></span>
                <span className={styles.two}></span>
                <span className={styles.three}></span>
            </div>
        </button>
    );
}