import React from 'react'

import { useContext } from 'react';

import { DeviceContext } from '../../contexts/DeviceContext';

import Logo from '../../../assets/images/dn-logo-w20.svg?react';

import styles from './Title.module.css'
import typographies from '../../typography.module.css';

const fullName = 'Daniel Narvaez';

export const Title = () => {
  const { device } = useContext(DeviceContext);
    return (
      <a 
        className={styles.title}
        href='/'
      >
        <Logo 
          className={`
            ${styles.logo}
            ${styles[device]}
          `}
        />
        {device === 'desktop' && (
          <span
            className={`${typographies.ui1} ${styles.fullName}`}>
            {fullName}
          </span>
        )}
      </a>
  );
}