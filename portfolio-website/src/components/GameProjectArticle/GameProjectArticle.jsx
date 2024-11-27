import React, { useContext, useEffect, useRef, useCallback } from 'react';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './GameProjectArticle.module.css';

import { zeroToAutoHeight } from '../../utils';

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

export const GameProjectArticle = () => {
  const { size } = useContext(ScreenSizeContext);
  const articleRef = useRef(null);
  const backgroundRef = useRef(null);
  const wrapperRef = useRef(null);
  const titleRef = useRef(null);

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

  // Hover handlers for submenu interactions
  const handleMouseEnter = useCallback(() => {
    const wrapper = wrapperRef.current;
    const title = titleRef.current;

    if (!wrapper || !title) 
      return;

    zeroToAutoHeight(wrapperRef.current, true, {}, title.offsetHeight);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const wrapper = wrapperRef.current;
    const title = titleRef.current;

    if (!wrapper || !title) 
      return;

    zeroToAutoHeight(wrapperRef.current, false, {}, title.offsetHeight);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const device = size; // 'Mobile' or 'Desktop' from ScreenSizeContext

    // Set CSS custom properties
    root.style.setProperty('--card-width', spacings[device].width);
    root.style.setProperty('--card-height', spacings[device].height);
    root.style.setProperty('--padding-size', spacings[device].padding);
    root.style.setProperty('--gap-size', spacings[device].padding);
  }, [size]);

  useEffect(() => {
    const article = articleRef.current;
    const background = backgroundRef.current;

    if (!article || !background )
      return;

    const handleMouseMove = (e) => {
      const rect = article.getBoundingClientRect();

      // Calculate relative position (-1 to 1)
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = (e.clientY - rect.top) / rect.height * 2 - 1;

      // Calculate the translation values (4.5% maximum movement)
      const translateX = -x * 4.5;
      const translateY = -y * 4.5;

      // Apply the transform with a smooth transition
      background.style.transform = `translate(${translateX}%, ${translateY}%)`;
    }

    const handleMouseLeave = () => {
      // Reset position when mouse leaves
      background.style.transform = 'translate(0%, 0%)';
    }

    article.addEventListener('mousemove', handleMouseMove);
    article.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      article.removeEventListener('mousemove', handleMouseMove);
      article.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // reset wrapper size;
  handleMouseLeave();

  return (
    <div 
      ref={articleRef}
      className={`${styles.gameProjectArticle} ${styles.card}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img 
        ref={backgroundRef}
        className={styles.articleBackground} 
        src="../../assets/images/games/ClockOut/projectArticle/ClockOut-CardBackground.png" 
        alt="game project card background" 
      />
      <img 
        className={styles.articleForeground} 
        src="../../assets/images/games/ClockOut/projectArticle/ClockOut-CardForeground.png" 
        alt="game project card foreground" 
      />
      <div className={`${styles.articleContent}`}>
        <div 
          ref={wrapperRef}
          className={styles.contentWrapper}
        >
          <div className={styles.projectInfo}>
            <h2 
              ref={titleRef}
              className={styles.projectTitle}
            >
              <b>Clock Out!!</b>
            </h2>
            <p className={styles.projectTagline}>
              An unpaid intern decides to fight bosses—<i>literally</i>.
            </p>
          </div>
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