import React, { useContext, useRef, useCallback } from 'react';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './AboutSection.module.css';

import { getAboutItem } from '../../data/aboutMedia';
import { IslandButton, SolidButton } from '../Button/Button';

export const AboutSection = () => {
  const {size} = useContext(ScreenSizeContext);
  const mediaRef = useRef(null);

  const setMedia = useCallback((id = 'default') => {
    if (!mediaRef.current)
      return;
      
    const imgElement = mediaRef.current;
    const mediaItem = getAboutItem(id);

    // avoid transitioning to the same image
    if (imgElement.src === mediaItem.src || imgElement.alt === mediaItem.alt)
      return;
    
    // Step 1: Remove transition and flash white immediately
    imgElement.style.transition = 'none';
    imgElement.style.filter = 'brightness(300%) contrast(50%)';
    
    // Step 2: Force a browser reflow
    void imgElement.offsetHeight;
    
    
    // Step 3: Add transition and prepare for image swap
    imgElement.style.transition = 'filter 1.5s cubic-bezier(0.7, 0, 0.3, 1)';
    
    // Step 4: Load new image after brief delay
    setTimeout(() => {
      imgElement.src = mediaItem.src;
      imgElement.alt = mediaItem.alt;
      
      // Step 5: Once new image is loaded, fade back to normal
      imgElement.onload = () => {
        // Small delay to ensure transition is ready
        requestAnimationFrame(() => {
          imgElement.style.filter = 'brightness(100%) contrast(100%)';
        });
      };

    }, 20);
  }, [mediaRef]);



  return (
    <section 
      id='about'
      className={`
        ${styles.aboutSection} 
        ${styles[size]}`
      }
      >
      <img 
        className={styles.aboutMedia}
        ref={mediaRef}
        src={getAboutItem().src}
        alt={getAboutItem().alt}
      />
      <div className={styles.aboutContent}>
        <div className={styles.aboutInfo}>
          <h1 className={`${styles.heading} ${styles[size]}`}>
            About Myself
          </h1>
          <p>
            <button type='button' onClick={() => setMedia('default')}>Currently</button> I volunteer as a Transitional Fellow for the <a target='_blank' href='https://www.egdcollective.org/transitional-program'>EGD Collective's Game Studio Program</a> where I lead the design team's balancing division.
          </p>
          <p>
            I'm now seeking full-time opportunities to bring my design expertise to the video games industry.
          </p>
          <p>
            <button type='button' onClick={() => setMedia('graduated')}>I graduated from Parsons School of Design</button> in Spring 2022 with a BFA in Design & Technology with a focus in Game Design.
          </p>
          <p>
            During the Summer of 2021 I interned as a Game Designer at <a target='_blank' href='https://www.massdigi.org'>MassDigi</a>, where I prototyped & fine-tuned player progression systems for <a href=''><i>Clock Out!!</i></a>.
          </p>
          <p>
            In my spare time I enjoy reading new books, lifting weights, and dancing Salsa at socials.
          </p>
        </div>
        <div className={styles.ctaMenu}>
          <SolidButton
            title = "Read my résumé"
            url = "/"
          />
          <IslandButton 
            title = "Get in touch"
            url="/"
          />
        </div>
      </div>
    </section>
  );
}