/**
* GameProjectArticle.jsx
* =====================
* 
* Overview:
* A responsive project showcase component for a game designer's portfolio.
* Features adaptive layouts (cards/banners), parallax effects, and 
* interactive content expansion. Handles both desktop and mobile interactions
* with optimized performance.
* 
* Key Features:
* - Responsive layout switching between cards and banners
* - Desktop mouse-based parallax effect
* - Mobile scroll-based parallax effect
* - Interactive content expansion on desktop hover
* - Auto-expanded content on mobile
* - Touch event handling for mobile interactions
* 
* Technical Implementation:
* - RequestAnimationFrame for smooth animations
* - Custom hooks for effect isolation
* - Passive event listeners for scroll performance
* - Proper cleanup of event listeners and animation frames
* 
* Dependencies:
* - ScreenSizeContext for responsive behavior
* - zeroToAutoHeight utility for content animations
* - CSS modules for styling
*/

import React, { useContext, useEffect, useRef } from 'react';
import { DeviceContext } from '../../contexts/DeviceContext';
import styles from './GameProjectArticle.module.css';
import { zeroToAutoHeight } from '../../utils';
import { LinkButton } from '../Button/Button';

/**
 * Configuration for parallax effects
 * - DESKTOP_MAX_MOVE: Maximum percentage of background movement on mouse move
 * - MOBILE_MAX_MOVE: Maximum scroll-based movement range
 * - MOBILE_MIDPOINT: Center point for scroll-based parallax calculation
 */
const PARALLAX_CONFIG = {
  DESKTOP_MAX_MOVE: 4.5,
  MOBILE_MAX_MOVE: 9,
  MOBILE_MIDPOINT: 0.5
};

/**
* Desktop Parallax Effect Hook
* Manages mouse-based parallax animation for desktop view.
* Applies smooth transform translations to background based on mouse position.
* 
* @param {RefObject} articleRef - Reference to article container
* @param {RefObject} backgroundRef - Reference to background image
* @param {string} size - Current device size from ScreenSizeContext
*/
const useDesktopParallax = (articleRef, backgroundRef, size, layout) => {
  useEffect(() => {
    const article = articleRef.current;
    const background = backgroundRef.current;
 
    if (!article || !background || size === 'Mobile') 
      return () => background.style.transform = 'translate(0%, 0%)';
 
    let frameId;
    const handleMouseParallax = (e) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
 
      frameId = requestAnimationFrame(() => {
        const rect = article.getBoundingClientRect();
        // Convert mouse position to normalized coordinates (-1 to 1)
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = (e.clientY - rect.top) / rect.height * 2 - 1;
        
        // Apply configured movement range
        const translateX = -x * PARALLAX_CONFIG.DESKTOP_MAX_MOVE;
        const translateY = -y * PARALLAX_CONFIG.DESKTOP_MAX_MOVE;
        
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
  }, [size, layout]);
};
 
 /**
 * Mobile Parallax Effect Hook
 * Manages scroll-based parallax animation for mobile view.
 * Animates background based on article position in viewport.
 * 
 * @param {RefObject} articleRef - Reference to article container
 * @param {RefObject} backgroundRef - Reference to background image
 * @param {string} size - Current device size from ScreenSizeContext
 */
 const useMobileParallax = (articleRef, backgroundRef, size, layout) => {
  useEffect(() => {
    const article = articleRef.current;
    const background = backgroundRef.current;
    
    if (!article || !background || size === 'Desktop') 
      return () => background.style.transform = 'translate(0%, 0%)';
  
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
          // Calculate scroll progress through viewport
          const progress = 1 - (rect.bottom / (viewportHeight + rect.height));
          // Center the effect using MOBILE_MIDPOINT
          const translateY = (progress - PARALLAX_CONFIG.MOBILE_MIDPOINT) * 
            -PARALLAX_CONFIG.MOBILE_MAX_MOVE;
          
          background.style.transform = `translate(0%, ${translateY}%)`;
        }
      });
    };
  
    window.addEventListener('scroll', handleScrollParallax, { passive: true });
    handleScrollParallax(); // Initial position check
  
    return () => {
      window.removeEventListener('scroll', handleScrollParallax);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [size, layout]);
};

/**
* Content Expansion Hook
* Manages interactive content expansion for both desktop and mobile views.
* Desktop: Expands on hover. Mobile: Maintains expanded state.
* Uses zeroToAutoHeight utility for smooth height transitions.
* 
* @param {RefObject} articleRef - Reference to article container
* @param {RefObject} wrapperRef - Reference to content wrapper
* @param {RefObject} titleRef - Reference to title element
* @param {string} size - Current device size from ScreenSizeContext
*/
const useContentExpansion = (articleRef, wrapperRef, titleRef, size, layout) => {
  useEffect(() => {
    const article = articleRef.current;
    const wrapper = wrapperRef.current;
    const title = titleRef.current;
    
    if (!article || !wrapper || !title) return;

    var titleHeight;
    
    const resizeObserver = new ResizeObserver(entries => {
      titleHeight = entries[0].contentRect.height;
      if (size === 'Mobile' || layout.includes('Banner'))
        wrapper.style.height = 'auto';
      else
        zeroToAutoHeight(wrapper, false, {}, titleHeight);
    });

    resizeObserver.observe(title);

    // If it's mobile or banner, just setup the resize observer
    if (size === 'Mobile' || layout.includes('Banner')) {
      return () => {
        resizeObserver.disconnect();
      };
    }

    // Desktop card: setup mouse events
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
      resizeObserver.disconnect();
      article.removeEventListener('mouseenter', handleMouseEnter);
      article.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size, layout]);
 };
 
 /**
 * Article Layout Component
 * Handles structural layout and responsive image selection.
 * Supports card and banner layouts with appropriate image assets.
 * 
 * @param {string} layout - Current layout mode ('desktopCard' | 'mobileCard' | 'mobileBanner')
 * @param {Object} projectData - Project content and image data
 * @param {RefObject} articleRef - Reference to article container
 * @param {RefObject} backgroundRef - Reference to parallax background
 * @param {RefObject} wrapperRef - Reference to content wrapper
 * @param {RefObject} titleRef - Reference to title element
 */
 const ArticleLayout = ({
  layout,
  projectData,
  articleRef,
  backgroundRef,
  wrapperRef,
  titleRef
 }) => {
  // Select appropriate images based on layout type
  const { src: backgroundSrc, alt: backgroundAlt } = layout.includes('Card') 
    ? projectData.images.cardBg 
    : projectData.images.bannerBg;
 
  const { src: foregroundSrc, alt: foregroundAlt } = layout.includes('Card')
    ? projectData.images.cardFg
    : projectData.images.bannerFg;

  return (
    <article
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
            { projectData.readMoreBtn !== '/' && (
              <LinkButton
                title='Read More'
                url={projectData.readMoreBtn}
                style='solid'
              />
            )}
            { projectData.playBtn !== '/' && (
              <LinkButton
                title='Play'
                url={projectData.playBtn}
                style='island'
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

/**
* Main Game Project Article Component
* A responsive and interactive project showcase component.
* Manages layout switching, parallax effects, and content expansion
* based on device context and user interaction.
* 
* Features:
* - Responsive layout adaptation (desktop card, mobile card, banner)
* - Mouse-based parallax effect on desktop
* - Scroll-based parallax effect on mobile
* - Interactive content expansion on desktop hover
* - Touch-friendly mobile interaction
* 
* @param {Object} projectData - Project information including:
*   @param {Object} images - Card and banner image assets
*   @param {string} heading - Project title
*   @param {string} tagline - Short project description
*   @param {string} readMoreBtn - URL for read more action
*   @param {string} playBtn - URL for play action
*/
export const GameProjectArticle = ({ projectData }) => {
  // Access screen context for responsive behavior
  const { device, layout } = useContext(DeviceContext);
 
  // Refs for DOM manipulation and effects
  const articleRef = useRef(null);
  const backgroundRef = useRef(null);
  const wrapperRef = useRef(null);
  const titleRef = useRef(null);
 
  // Apply interactive effects based on device context
  useContentExpansion(articleRef, wrapperRef, titleRef, device, layout);
  useDesktopParallax(articleRef, backgroundRef, device, layout);
  useMobileParallax(articleRef, backgroundRef, device, layout);
 
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
};