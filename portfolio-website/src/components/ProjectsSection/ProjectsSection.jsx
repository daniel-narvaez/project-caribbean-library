import React, { useContext } from "react";

import { GameProjectArticle } from "../GameProjectArticle/GameProjectArticle";

import styles from './ProjectsSection.module.css';

import { gameProjectsData, featuredProjectsData } from "../../data/gameProjectRegistry";

import { DeviceContext } from "../../contexts/DeviceContext";
import { WavesButton } from "../Button/WavesButton";
import { Chapter } from "../Chapter/Chapter";

export const ProjectsSection = () => {
  const { size, layout } = useContext(DeviceContext);
  return (
    <Chapter
      id='projects'
      className={styles.projectsSection}
      >
      <div className={`${styles.featuredWorks} ${styles[layout]}`}>
        <h2 className={`${styles.heading} ${styles[size]}`}>
          Featured Works
        </h2>
        <div className={`${styles.projectArticles} ${styles[layout]}`}>
          {featuredProjectsData.map((project, index) => (
            <GameProjectArticle 
              key={project.title || index} 
              projectData={project.projectArticle}
            />
          ))}
        </div>
        {/* <WavesButton title='Explore my full portfolio' url='/'/> */}
      </div>
    </Chapter>
  );
}