import React from 'react'

import { useContext } from 'react';

import { DeviceContext, devices } from '../../contexts/DeviceContext';

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
        {device === devices.desktop && (
          <span
            className={`${typographies.ui1} ${styles.fullName}`}>
            {fullName}
          </span>
        )}
      </a>
  );
}