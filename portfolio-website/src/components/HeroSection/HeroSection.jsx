import React, { useRef } from "react";

import { useState, createContext, useCallback, useEffect, memo } from "react";

import { Navbar } from "../Navbar/Navbar";

import { Slideshow } from "../Slideshow/Slideshow";

import styles from './HeroSection.module.css';

import { testSlides, heroSlides } from "../../data/HeroMedia";

export const CTAButton = memo(({title = 'Call-to-Action', url = '', style = 'solid'}) => {
  return (
    <a
      href={url}
      className={`${styles.ctaButton} ${styles[style]}`}
    >
      <span>{title}</span>
    </a>
  );
})

export const TiltContext = createContext()

export const HeroSection = () => {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [tilt, setTilt] = useState({
    scale: 100,
    xRot: 0,
    yRot: 0,
  });

  // Debounced transform update
  const updateTilt = useCallback((newTransform) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setTilt(newTransform);
    });
  }, []);

  // Memoized mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Get relative mouse position
    const xVal = e.clientX - rect.left;
    const yVal = e.clientY - rect.top;

    // Calculate rotation values
    const yRotation = 15 * ((xVal - width / 2) / width);
    const xRotation = -15 * ((yVal - height / 2) / height);

    updateTilt({
      scale: 104.2,
      xRot: xRotation,
      yRot: yRotation
    });
  }, [updateTilt]);

  // Memoized mouse leave handler
  const handleMouseLeave = useCallback(() => {
    updateTilt({
      scale: 100,
      xRot: 0,
      yRot: 0,
    });
  }, [updateTilt]);

  // Cleanup requestAnimationFrame on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [frameRef]);


  
  return (
    <main 
      className={styles.heroSection}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Navbar/>
      <div className={styles.heroContent}> 
        <h1 className={styles.headline}>
          Elevating experiences <br/> 
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
      <TiltContext.Provider value={{ tilt, setTilt }}>
        <div className={styles.heroMedia}>
          <Slideshow slides={heroSlides}/>
        </div>
      </TiltContext.Provider>
    </main>
  )
}