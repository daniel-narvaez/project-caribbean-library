/**
* HeroSection.jsx
* ==============
* 
* Overview:
* The main hero section component for a game designer's portfolio website.
* Features an interactive 3D tilt effect on hover, animated slideshow,
* and responsive call-to-action buttons. Provides context for 3D transforms
* to child components.
* 
* Key Features:
* - 3D tilt effect with smooth animations
* - Performance-optimized mouse tracking
* - Responsive design with consistent animations
* - Modular button component with variants
* - Context-based state management for 3D effects
* 
* Technical Implementation:
* - RequestAnimationFrame for smooth animations
* - Memoized event handlers
* - Proper cleanup of animation frames
* - Context API for tilt state distribution
* 
* Dependencies:
* - Navbar component
* - Slideshow component
* - heroSlides media data
* - CSS modules for styling
*/

import { useContext } from "react";

import { Slideshow } from "../Slideshow/Slideshow";
import { DeviceContext } from "../../contexts/DeviceContext";

import { heroGifSlides } from "../../data/HeroMedia";
import { LinkButton } from "../Button/Button";

import styles from './HeroSection.module.css';
import typographies from '../../typography.module.css';

import { Chapter } from "../Chapter/Chapter";
import { socialMediaData } from "../../data/appIcons";
 
 
 /**
 * Main Hero Section Component
 * Manages 3D tilt effect and layout structure
 */
 export const HeroSection = () => {

  const { device } = useContext(DeviceContext)
 
  return (
    <main>
      <Chapter
        id='hero'
        className={`${styles.heroSection}`}
      >
        <div className={`${styles.heroContainer}`}>   
          <div className={styles.heroContent}>
            <h1 className={`${typographies.h1} ${styles.headline}`}>
              Elevating experiences <br/>
              through meticulous <br/>
              game design.
            </h1>
            
            <p className={`${typographies.b1} ${styles.tagline}`}>
              Hi, I'm Dan, a <b>game designer</b> based in <br/>
              The Bronx, NY. I specialize in economy <br/>
              and progression systems design.
            </p>
            
            <div className={`${styles.ctaMenu}`}>
              <LinkButton
                className={`${styles.heroButton}`}
                title="Browse my work"
                url="#projects"
                style="solid"
              />
              <LinkButton
                className={`${styles.heroButton}`}
                title="Connect on LinkedIn"
                url={socialMediaData.linkedInIcon.profileUrl}
                style="island"
              />
            </div>
          </div>
  
          <div className={styles.heroMedia} >
            <Slideshow slides={heroGifSlides} playbackMode = 'automatic' aspectRatio = '4/3'/>
          </div>
        </div>
      </Chapter>
    </main>
  );
 };