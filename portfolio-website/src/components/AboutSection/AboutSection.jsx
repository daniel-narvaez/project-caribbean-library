/**
 * AboutSection.jsx
 * ===============
 * 
 * Overview:
 * Interactive about section component featuring an image gallery with smooth
 * transitions. Images change based on text interaction, with preloaded assets
 * to ensure smooth transitions. The component uses a polaroid-style presentation
 * with a white flash effect during image transitions.
 * 
 * Key Features:
 * - Background image preloading
 * - Smooth image transitions with flash effect
 * - Interactive text triggers for image changes
 * - Responsive design handling through ScreenSizeContext
 * - Custom buttons integrated within text content
 * 
 * Technical Implementation:
 * - RequestAnimationFrame for smooth animations
 * - Image preloading on component mount
 * - Debounced image transitions
 * - CSS-based animations using transitions
 * 
 * Dependencies:
 * - ScreenSizeContext for responsive handling
 * - aboutMedia data source
 * - Button components for CTAs
 * - CSS modules for styling
 */

import React, { useContext, useRef, useCallback, useEffect } from 'react';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import styles from './AboutSection.module.css';
import { getAboutItem, aboutMedia } from '../../data/aboutMedia';
import { LinkButton } from '../Button/Button';
import { Chapter } from '../Chapter/Chapter';
import { clockOutProject } from '../../data/gameProjects';

/**
 * Main About Section Component
 * Manages image transitions and content display
 */
export const AboutSection = () => {
  const { size } = useContext(ScreenSizeContext);
  const mediaRef = useRef(null);
  const sectionRef = useRef(null);
  const mediaContainerRef = useRef(null);  // New ref for the media container

  useEffect(() => {
    const section = sectionRef.current;
    const mediaContainer = mediaContainerRef.current;
    
    if (!section || !mediaContainer) return;
  
    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      const mediaRect = mediaContainer.getBoundingClientRect();
      
      const viewportHeight = window.innerHeight;
      const sectionCenter = sectionRect.top + (sectionRect.height / 2);
      const viewportCenter = viewportHeight / 2;
      
      const scrollProgress = (viewportCenter - sectionCenter) / (sectionRect.height / 2);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      
      const maxOffset = sectionRect.height - mediaRect.height;
      mediaContainer.style.transform = `translateY(${maxOffset * clampedProgress}px)`;
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();  // Initial position
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Preload all images on mount to ensure smooth transitions
   * Creates new Image objects and sets their src to trigger browser caching
   */
  useEffect(() => {
    aboutMedia.forEach(item => new Image().src = item.src);
  }, []);

  /**
   * Handles image transitions with a white flash effect
   * @param {string} id - The identifier for the target image
   */
  const setMedia = useCallback((id = 'default') => {
    const imgElement = mediaRef.current;
    if (!imgElement) return;

    const mediaItem = getAboutItem(id);
    const isSameImage = imgElement.src === mediaItem.src || 
                       imgElement.alt === mediaItem.alt;
    
    if (isSameImage) return;

    /**
     * Initiates the transition animation sequence
     * Sets up the white flash effect and prepares for image swap
     */
    const startTransition = () => {
      // Remove transition temporarily for instant effect
      imgElement.style.transition = 'none';
      imgElement.style.filter = 'brightness(300%) contrast(50%)';
      
      // Force browser reflow to ensure animation triggers
      void imgElement.offsetHeight;
      
      // Restore transition for smooth animation
      imgElement.style.transition = 'filter 1.5s cubic-bezier(0.7, 0, 0.3, 1)';
    };

    /**
     * Completes the transition by loading new image and resetting filters
     * Uses onload to ensure timing with actual image load
     */
    const completeTransition = () => {
      imgElement.onload = () => {
        requestAnimationFrame(() => {
          imgElement.style.filter = 'brightness(100%) contrast(100%)';
        });
      };

      imgElement.src = mediaItem.src;
      imgElement.alt = mediaItem.alt;
    };

    startTransition();
    setTimeout(completeTransition, 20);
  }, []);

  return (
    <Chapter
      id='about'
      className={`${styles.aboutSection} ${styles[size]}`}
    >
      <div className={styles.aboutMedia}>
        <img
          className={styles.polaroid}
          ref={mediaRef}
          src={getAboutItem().src}
          alt={getAboutItem().alt}
        />
      </div>

      <div className={styles.aboutContent}>
        <div className={styles.aboutInfo}>
          <h2 className={`${styles.heading} ${styles[size]}`}>
            About Myself
          </h2>
          
          <p>
            <span className='action' type='button' onClick={() => setMedia('default')}>Currently</span>
            , I volunteer as a Transitional Fellow for the{' '}
            <a target='_blank' href='https://www.egdcollective.org/transitional-program'>
              EGD Collective's Game Studio Program
            </a> where I lead the design team's balancing division.
          </p>
          
          <p>
            I'm now seeking full-time opportunities to bring my design expertise to the video games industry. I{' '}
            <span className='action' type='button' onClick={() => setMedia('participate')}>
              participate in game jams
            </span>
            {' '}to consistently improve my skills.
          </p>
          
          <p>
            I{' '}
            <span className='action' type='button' onClick={() => setMedia('graduated')}>
              graduated from Parsons School of Design
            </span>
            {' '}in Spring 2022 with a BFA in Design & Technology with a focus in Game Design.
          </p>
          
          <p>
            During the Summer of 2021 I interned as a Game Designer at{' '}
            <a target='_blank' href='https://www.massdigi.org'>MassDigi</a>
            , where I prototyped & fine-tuned player progression systems for{' '}
            <a href='game-projects/clock-out'><i>Clock Out!!</i></a>.
          </p>
          
          <p>
            In my spare time I enjoy reading books, lifting weights, and dancing Salsa at socials.
          </p>
        </div>

        <div className={`${styles.ctaMenu}`}>
          <LinkButton
            title="Read my résumé"
            url='/resume'
            style='solid'
          />
          <LinkButton
            title="Reach out"
            url='#contact'
            style='island'
          />
        </div>
      </div>
    </Chapter>
  );
};