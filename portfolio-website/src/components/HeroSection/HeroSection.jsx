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

import React, {
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  memo
 } from "react";

import { Slideshow } from "../Slideshow/Slideshow";
import { DeviceContext } from "../../contexts/DeviceContext";

import { testSlides, heroGifSlides } from "../../data/HeroMedia";
import { LinkButton } from "../Button/Button";

import styles from './HeroSection.module.css';
import { Chapter } from "../Chapter/Chapter";
import { socialMediaData } from "../../data/appIcons";
 /**
 * Configuration for 3D tilt effect
 * - MAX_ROTATION: Maximum angle of rotation (degrees)
 * - HOVER_SCALE: Zoom effect on hover (percentage)
 * - DEFAULT values: Initial/rest state values
 */
 const TILT_CONFIG = {
  MAX_ROTATION: 15,
  HOVER_SCALE: 104.2,
  DEFAULT_SCALE: 100,
  DEFAULT_ROTATION: 0
 };
 
 const DEFAULT_TILT_STATE = {
  scale: TILT_CONFIG.DEFAULT_SCALE,
  xRot: TILT_CONFIG.DEFAULT_ROTATION,
  yRot: TILT_CONFIG.DEFAULT_ROTATION
 };
 
 // Context for sharing tilt state with child components
 export const TiltContext = createContext();
 
 /**
 * Main Hero Section Component
 * Manages 3D tilt effect and layout structure
 */
 export const HeroSection = () => {

  const { size } = useContext(DeviceContext)
 
  return (
    <main>
      <Chapter
        id='hero'
        className={`
          ${styles.heroSection}
          ${styles[size]}
        `}
      >

        <div className={`
            ${styles.heroContainer}
            ${styles[size]}
          `}
        >   
          <div className={styles.heroContent}>
            <h2 className={styles.headline}>
              Elevating experiences <br/>
              through meticulous <br/>
              game design.
            </h2>
            
            <p className={styles.tagline}>
              Hi, I'm Dan, a <b>game designer</b> based in <br/>
              The Bronx, NY. I specialize in economy <br/>
              and progression systems design.
            </p>
            
            <div className={`
                ${styles.ctaMenu}
                ${styles[size]}
              `}
            >
              <LinkButton
                className={styles.heroButton}
                title="Browse my work"
                url="#projects"
                style="solid"
              />
              <LinkButton
                className={styles.heroButton}
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