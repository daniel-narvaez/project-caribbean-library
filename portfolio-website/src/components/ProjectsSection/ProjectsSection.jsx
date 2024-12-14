import React, { useContext, memo, useState, useRef, useEffect } from "react";

import { GameProjectArticle } from "../GameProjectArticle/GameProjectArticle";

import styles from './ProjectsSection.module.css';

import { clockOutProject, chihuahuaChampProject, theHexPerplexProject } from "../../data/gameProjects";

import { ScreenSizeContext } from "../../contexts/ScreenSize";


/**
 * Waves-Style Button Component
 * Memoized to prevent unnecessary re-renders
 * 
 * @param {string} title - Button text
 * @param {string} url - Button link destination
 */
export const WavesButton = memo(({
title = 'Waves Button',
url = '/'
}) => {
  const buttonRef = useRef(null);
  const [waveSize, setWaveSize] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if(buttonRef.current) {
      const button = buttonRef.current;
      const width = button.offsetWidth;
      const height = button.offsetHeight;
      const diagonal = Math.sqrt(width * width + height)
      //multiply by 2 for safe coverage
      setWaveSize(diagonal * 2.25);
    }
  }, []);

  return (
    <a
      href={url}
      className={`${styles.wavesButton}`}
      ref={buttonRef}
      onMouseEnter={() => setScale(0.75)}
      onMouseLeave={() => setScale(1)}
    >
      <div 
        className={styles.wave} 
        style={{
          width: `${waveSize}px`,
          height: `${waveSize}px`,
          marginTop: `-${waveSize}px`,
          scale: `${scale}`
        }}
      />
      <span>{title}</span>
    </a>
  )
});

export const ProjectsSection = () => {
  const { size, layout } = useContext(ScreenSizeContext);
  return (
    <section 
      id='projects'
      className={styles.projectsSection}
      >
      <div className={`${styles.featuredWorks} ${styles[layout]}`}>
        <h2 className={`${styles.heading} ${styles[size]}`}>
          Featured Works
        </h2>
        <div className={`${styles.projectArticles} ${styles[layout]}`}>
          <GameProjectArticle projectData={clockOutProject.projectArticle}/>
          <GameProjectArticle projectData={chihuahuaChampProject.projectArticle}/>
          <GameProjectArticle projectData={theHexPerplexProject.projectArticle}/>
        </div>
        <WavesButton title="Explore my full portfolio" url="/"/>
      </div>
    </section>
  );
}