import React from 'react';

import styles from './Form.module.css'

export const Form = ({children}) => {
  return (
    <form className={styles.form}>
      {children}
    </form>
  );
}