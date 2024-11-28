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

const useDesktopParallax = (articleRef, backgroundRef, size) => {
  useEffect(() => {
    const article = articleRef.current;
    const background = backgroundRef.current;

    if (!article || !background || size === 'Mobile') return;

    let frameId;
    const handleMouseParallax = (e) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const rect = article.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = (e.clientY - rect.top) / rect.height * 2 - 1;
        const translateX = -x * 4.5;
        const translateY = -y * 4.5;
        background.style.transform = `translate(${translateX}%, ${translateY}%)`;
      });
    };

    const resetMouseParallax = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      background.style.transform = 'translate(0%, 0%)';
    };

    if (size === 'Desktop') {
      article.addEventListener('mousemove', handleMouseParallax, { passive: true });
      article.addEventListener('mouseleave', resetMouseParallax);
    }

    return () => {
      if (size === 'Desktop') {
        article.removeEventListener('mousemove', handleMouseParallax);
        article.removeEventListener('mouseleave', resetMouseParallax);
      }
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [size]);
};

const useMobileParallax = (articleRef, backgroundRef, size) => {
  useEffect(() => {
    const article = articleRef.current;
    const background = backgroundRef.current;
    
    if (!article || !background || size === 'Desktop') return;
  
    // Debounce scroll handler
    let frameId;
    const handleScrollParallax = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const rect = article.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
          const viewportHeight = window.innerHeight;
          const progress = 1 - (rect.bottom / (viewportHeight + rect.height));
          const translateY = (progress - 0.5) * -9;
          background.style.transform = `translate(0%, ${translateY}%)`;
        }
      });
    };
  
    window.addEventListener('scroll', handleScrollParallax, { passive: true });
    handleScrollParallax();
  
    return () => {
      window.removeEventListener('scroll', handleScrollParallax);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [size]);
};

const useContentExpansion = (articleRef, wrapperRef, titleRef, size) => {
  useEffect(() => {
    const article = articleRef.current;
    const wrapper = wrapperRef.current;
    const title = titleRef.current;
    
    if (!article || !wrapper || !title) return;

    // Cache the scroll height to avoid reflow
    const titleHeight = title.scrollHeight;

    if (size === 'Mobile') {
      zeroToAutoHeight(wrapper, true, {}, titleHeight);
      return;
    }

    zeroToAutoHeight(wrapper, false, {}, titleHeight);
  
    const handleMouseEnter = () => {
      zeroToAutoHeight(wrapper, true, {}, titleHeight);
    };
  
    const handleMouseLeave = () => {
      zeroToAutoHeight(wrapper, false, {}, titleHeight);
    };
  
    article.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    article.addEventListener('mouseleave', handleMouseLeave, { passive: true });
  
    return () => {
      article.removeEventListener('mouseenter', handleMouseEnter);
      article.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size]);
};

export const GameProjectArticle = ({ projectData }) => {
  const { size, layout } = useContext(ScreenSizeContext);
  const articleRef = useRef(null);
  const backgroundRef = useRef(null);
  const wrapperRef = useRef(null);
  const titleRef = useRef(null);

  useContentExpansion(articleRef, wrapperRef, titleRef, size);
  useDesktopParallax(articleRef, backgroundRef, size);
  useMobileParallax(articleRef, backgroundRef, size);

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