import React, { useContext } from 'react';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './AboutSection.module.css';

import { getAboutItem, aboutMedia } from '../../data/aboutMedia';
import { IslandButton, SolidButton } from '../Button/Button';

export const AboutSection = () => {
  const {size} = useContext(ScreenSizeContext);

  return (
    <section 
      id='about'
      className={styles.aboutSection}
      >
      <img 
        className={styles.aboutMedia}
        src={getAboutItem().src}
        alt={getAboutItem().alt}
      />
      <div className={styles.aboutContent}>
        <div className={styles.aboutInfo}>
          <h1 className={`${styles.heading} ${styles[size]}`}>
            About Myself
          </h1>
          <p>
            I currently volunteer as a Transitional Fellow for the <a target='_blank' href='https://www.egdcollective.org/transitional-program'>EGD Collective's Game Studio Program</a> where I lead the design team's balancing division.
          </p>
          <p>
            I'm now seeking full-time opportunities to bring my design expertise to the video games industry.
          </p>
          <p>
            I graduated from Parsons School of Design in Spring 2022 with a BFA in Design & Technology with a focus in Game Design.
          </p>
          <p>
            During the Summer of 2021 I interned as a Game Designer at <a target='_blank' href='https://www.massdigi.org'>MassDigi</a>, where I prototyped & fine-tuned player progression systems for Clock Out!!.
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