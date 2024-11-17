import React from "react";

import { Slideshow } from "../Slideshow/Slideshow";
import { CTAButton } from "../Buttons/Buttons";

import styles from './HeroSection.module.css';

import { testSlides } from "../../data/HeroMedia";

export const HeroSection = () => {
  return (
    <main className={styles.heroSection}>
      <div className={styles.heroContent}> 
        <h1 className={styles.headline}>
          Crafting adventures <br/> 
          through meticulous <br/>
          game design.
        </h1>
        <p className={styles.tagline}>
          Hi I’m Daniel, a <b>game designer</b> based in <br/>
          The Bronx, NY. I specialize in Economy <br/>
          Systems Design and UI/UX Design.
        </p>
        <div className={styles.ctaMenu}>
          <CTAButton title="Browse my work" style="solid"/>
          <CTAButton title="Connect with me" style="island"/>
        </div>
      </div>
      <div className={styles.heroMedia}>
        <Slideshow slides={testSlides}/>
      </div>
    </main>
  )
}