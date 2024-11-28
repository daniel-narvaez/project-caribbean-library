import React, { useContext } from "react";

import { GameProjectArticle } from "../GameProjectArticle/GameProjectArticle";

import styles from './ProjectsSection.module.css';

import { clockOutProject, chihuahuaChampProject } from "../../data/gameProjects";

import { ScreenSizeContext } from "../../contexts/ScreenSize";

export const ProjectsSection = () => {
  const { size, layout } = useContext(ScreenSizeContext) 
  return (
    <section className={styles.projectsSection}>
      <div className={`${styles.featuredWorks} ${styles[layout]}`}>
        <h2 className={`${styles.heading} ${styles[size]}`}>
          Featured Works
        </h2>
        <div className={`${styles.projectArticles} ${styles[layout]}`}>
          <GameProjectArticle projectData={clockOutProject.projectArticle}/>
          <GameProjectArticle projectData={chihuahuaChampProject.projectArticle}/>
          <GameProjectArticle projectData={clockOutProject.projectArticle}/>
        </div>
      </div>
    </section>
  );
}