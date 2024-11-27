import React from 'react';

import ChevronIcon from '../../../assets/images/chevronIcon.svg?react';

import styles from './Chevron.module.css';

export const Chevron = ({ direction = 'up', hover = false, active = false }) => {
  return (
    <div className={`${styles.chevron} ${styles[direction]}`}> 
      <ChevronIcon id={'icon'}/>
    </div>
  )
}