import React from 'react'

import { useContext } from 'react';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import Logo from '../../../assets/images/Logo.svg?react';
import styles from './Title.module.css'

const fullName = 'Daniel Narvaez';

export const Title = () => {
  const { size } = useContext(ScreenSizeContext);
    return (
      <a 
        className={styles.title}
        href='/'
      >
        <Logo 
          className={`
            ${styles.logo}
            ${styles[size]}
          `}
        />
        {size === 'desktop' && (
          <h1 
            className={`${styles.fullName}`}>
            {fullName}
          </h1>
        )}
      </a>
  );
}