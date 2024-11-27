import React, { useContext, useEffect, useRef } from 'react';

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

const ArticleLayout = ({
  layout,
  projectData,
  articleRef,
  backgroundRef,
  wrapperRef,
  titleRef
}) => {

  // Get the right image set based on layout
  const { src: backgroundSrc, alt: backgroundAlt } = layout.includes('Card') 
  ? projectData.images.cardBg 
  : projectData.images.bannerBg;

  const { src: foregroundSrc, alt: foregroundAlt } = layout.includes('Card')
  ? projectData.images.cardFg
  : projectData.images.bannerFg;

  return (
    <div
      ref={articleRef}
      className={`
        ${styles.gameProjectArticle} 
        ${styles[layout]}
      `}
    >
      <img 
        ref={backgroundRef}
        className={styles.articleBackground}
        src={backgroundSrc} 
        alt={backgroundAlt}
      />
      <img 
        className={styles.articleForeground} 
        src={foregroundSrc}
        alt={foregroundAlt}
      />
      <div className={styles.articleContent}>
        <div 
          ref={wrapperRef} 
          className={styles.contentWrapper}
        >
          <div className={styles.projectInfo}>
            <h2 
              ref={titleRef} 
              className={styles.projectTitle}
            >
              <b>{projectData.heading}</b>
            </h2>
            <p className={styles.projectTagline}>
              {projectData.tagline}
            </p>
          </div>
          <div className={styles.projectMenu}>
            <GameProjectButton 
              title='Read More'
              url={projectData.readMoreBtn}
              style='solid'
            />
            <GameProjectButton 
              title='Play'
              url={projectData.playBtn}
              style='island'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const GameProjectArticle = ({ projectData }) => {
  const { size, layout } = useContext(ScreenSizeContext);
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
  
  useEffect(() => {
    const root = document.documentElement;
    const device = size; // 'Mobile' or 'Desktop' from ScreenSizeContext

    // Set CSS custom properties
    root.style.setProperty('--card-width', spacings[device].width);
    root.style.setProperty('--card-height', spacings[device].height);
    root.style.setProperty('--padding-size', spacings[device].padding);
    root.style.setProperty('--gap-size', spacings[device].gap);
  }, [size]);

  useEffect(() => {
    // This code runs immediately on mount
    const article = articleRef.current;
    const wrapper = wrapperRef.current;
    const title = titleRef.current;
    
    if (!article || !wrapper || !title) return;

    // For mobile/tablet, set to full height immediately and don't add hover events
    if (size === 'Mobile') {
      zeroToAutoHeight(wrapper, true, {}, title.offsetHeight);
      return;
    }

    // Call your function immediately
    zeroToAutoHeight(wrapper, false, {}, title.offsetHeight);
  
    // The event listeners are still set up for future hover interactions
    const handleMouseEnter = () => {
      zeroToAutoHeight(wrapper, true, {}, title.offsetHeight);
    };
  
    const handleMouseLeave = () => {
      zeroToAutoHeight(wrapper, false, {}, title.offsetHeight);
    };
  
    article.addEventListener('mouseenter', handleMouseEnter);
    article.addEventListener('mouseleave', handleMouseLeave);
  
    return () => {
      article.removeEventListener('mouseenter', handleMouseEnter);
      article.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size, layout]);

  useEffect(() => {
    const article = articleRef.current;
    const background = backgroundRef.current;

    if (!article || !background || size === 'Mobile')
      return;

    const handleMouseParallax = (e) => {
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

    const resetMouseParallax = () => {
      // Reset position when mouse leaves
      background.style.transform = 'translate(0%, 0%)';
    }

    if (size === 'Desktop') {
      article.addEventListener('mousemove', handleMouseParallax);
      article.addEventListener('mouseleave', resetMouseParallax);
    }

    return () => {
      if (size === 'Desktop') {
        article.removeEventListener('mousemove', handleMouseParallax);
        article.removeEventListener('mouseleave', resetMouseParallax);
      }
    };
  }, [size]);

  useEffect(() => {
    const background = backgroundRef.current;

    if(!background || size === 'Desktop')
      return;

    const handleOrientationParallax = (e) => {
      // gamma is left/right tilt (-90 to 90)
      // beta is front/back tilt (-180 to 180)
      const x = (e.gamma || 0) / 90; // Normalize to -1 to 1
      const y = ((e.beta || 0) - 45) / 90; // Normalize to -1 to 1, adjust midpoint

      const translateX = -x * 4.5;
      const translateY = -y * 4.5;

      // Apply the transform with a smooth transition
      background.style.transform = `translate(${translateX}%, ${translateY}%)`;
    }

    // Check if device is supported and request permission if needed
    const initOrientationParallax = async () => {
      if (!window.DeviceOrientationEvent) return;

      // Request permission for iOS devices
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission !== 'granted') return;
        } catch (error) {
          console.error('Permission for device orientation was denied');
          return;
        }
      }

      window.addEventListener('deviceorientation', handleOrientationParallax);
    }

    initOrientationParallax();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientationParallax);
    };
  }, [size]);

  return (
    <ArticleLayout
      layout={layout}
      projectData={projectData}
      articleRef={articleRef}
      backgroundRef={backgroundRef}
      wrapperRef={wrapperRef}
      titleRef={titleRef}
    />
  );
}