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
import { Navbar } from "../Navbar/Navbar";
import { Slideshow } from "../Slideshow/Slideshow";
import { ScreenSizeContext } from "../../contexts/ScreenSize";

import { testSlides, heroGifSlides } from "../../data/HeroMedia";
import { useSmoothScroll } from "../../utils/useSmoothScroll";
import { LinkButton } from "../Button/Button";

import styles from './HeroSection.module.css';
import { Chapter } from "../Chapter/Chapter";
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
  // Refs for DOM elements and animation frame
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [tilt, setTilt] = useState(DEFAULT_TILT_STATE);
  const { size } = useContext(ScreenSizeContext)
 
  /**
   * Updates tilt state with animation frame optimization
   * Cancels previous frame request to prevent animation buildup
   */
  const updateTilt = useCallback((newTransform) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(() => {
      setTilt(newTransform);
    });
  }, []);
 
  /**
   * Handles mouse movement for tilt effect
   * Calculates rotation based on mouse position relative to container center
   */
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { width, height, left, top } = rect;
 
    const xVal = e.clientX - left;
    const yVal = e.clientY - top;
 
    const yRotation = TILT_CONFIG.MAX_ROTATION * ((xVal - width / 2) / width);
    const xRotation = -TILT_CONFIG.MAX_ROTATION * ((yVal - height / 2) / height);
 
    updateTilt({
      scale: TILT_CONFIG.HOVER_SCALE,
      xRot: xRotation,
      yRot: yRotation
    });
  }, [updateTilt]);
 
  /**
   * Resets tilt state when mouse leaves container
   */
  const handleMouseLeave = useCallback(() => {
    updateTilt(DEFAULT_TILT_STATE);
  }, [updateTilt]);
 
  /**
   * Cleanup animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
 
  return (
    <main ref={containerRef}>
      <Chapter
        id='hero'
        className={styles.heroSection}
        // onMouseMove={size === 'Desktop' ? handleMouseMove : null}
        // onMouseLeave={size === 'Desktop' ? handleMouseLeave : null}
      >

        <div className={styles.heroContainer}>   
          <div className={styles.heroContent}>
            <h2 className={styles.headline}>
              Elevating experiences <br/>
              through meticulous <br/>
              game design.
            </h2>
            
            <p className={styles.tagline}>
              Hi I'm Daniel, a <b>game designer</b> based in <br/>
              The Bronx, NY. I specialize in Economy <br/>
              Systems Design and UI/UX Design.
            </p>
            
            <div className={styles.ctaMenu}>
              <LinkButton
                className={styles.heroButton}
                title="Browse my work"
                url="#projects"
                style="solid"
              />
              <LinkButton
                className={styles.heroButton}
                title="Connect with me"
                url="#email"
                style="island"
              />
            </div>
          </div>
  
          <TiltContext.Provider value={{ tilt, setTilt }}>
            <div className={styles.heroMedia}>
              <Slideshow slides={heroGifSlides} playbackMode = 'automatic' />
            </div>
          </TiltContext.Provider>
        </div>
      </Chapter>
    </main>
  );
 };