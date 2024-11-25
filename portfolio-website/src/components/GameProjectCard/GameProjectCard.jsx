import React, { useContext, useEffect } from 'react';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './gameProjectCard.module.css';

const GameProjectButton = ({title = 'Title', url = '', style = 'solid'}) => {
  const { size } = useContext(ScreenSizeContext);
  
  return (
    <a
      href={url}
      className={`${styles.projectButton} ${styles[style]} ${styles[size]}`}
    >
      <span>{title}</span>
    </a>
  );
}

export const GameProjectCard = () => {
  const { size } = useContext(ScreenSizeContext);

  const spacings = {
    Desktop: {
      width: '25rem',       // 400px
      height: '37.5rem',    // 600px
      padding: '0.5rem',    // 8px
      gap: '0.5rem'         // 8px
    },
    Mobile: {
      width: '18.75rem',    // 300px
      height: '28.125rem',  // 450px
      padding: '0.375rem',  // 6px
      gap: '0.375rem'       // 6px
    }
  }

  useEffect(() => {
    const root = document.documentElement;
    const device = size; // 'Mobile' or 'Desktop' from ScreenSizeContext

    // Set CSS custom properties
    root.style.setProperty('--card-width', spacings[device].width);
    root.style.setProperty('--card-height', spacings[device].height);
    root.style.setProperty('--padding-size', spacings[device].padding);
    root.style.setProperty('--gap-size', spacings[device].padding);
  }, [size]);

  return (
    <div className={`${styles.gameProjectCard}`}>
      <img 
        className={styles.cardBackground} 
        src="../../assets/images/games/ClockOut/projectCard/ClockOut-CardBackground.png" 
        alt="Clock Out bg" 
      />
      <img 
        className={styles.cardForeground} 
        src="../../assets/images/games/ClockOut/projectCard/ClockOut-CardForeground.png" 
        alt="Clock Out fg" 
      />
      <div className={`${styles.cardContent}`}>
        <div className={styles.wrapper}>
          <h1 className={styles.projectTitle}>
            <b>Clock Out!!</b>
          </h1>
          <h2 className={styles.projectTagline}>
            An unpaid intern decides to fight bosses—<i>literally</i>.
          </h2>
          <div className={styles.projectMenu}>
            <GameProjectButton 
              title='Read More'
              style='solid'
            />
            <GameProjectButton 
              title='Play'
              style='island'
            />
          </div>
        </div>
      </div>
    </div>
  );
}