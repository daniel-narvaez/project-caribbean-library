import React from "react";

import { GameProjectArticle } from "../GameProjectArticle/GameProjectArticle";

import styles from './ProjectsSection.module.css';

export const ProjectsSection = () => {
  return (
    <section className={styles.projectsSection}>
      <div className={styles.featuredWorks}>
        <h2 className={styles.heading}>
          Featured Works
        </h2>
        <div className={styles.projectArticles}>
          <GameProjectArticle/>
          <GameProjectArticle/>
          <GameProjectArticle/>
        </div>
      </div>
    </section>
  );
}