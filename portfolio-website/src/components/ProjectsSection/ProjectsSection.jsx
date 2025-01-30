import React, { useContext } from "react";

import { GameProjectArticle } from "../GameProjectArticle/GameProjectArticle";

import styles from './ProjectsSection.module.css';

import { gameProjectsData } from "../../data/gameProjectRegistry";

import { ScreenSizeContext } from "../../contexts/ScreenSize";
import { WavesButton } from "../Button/WavesButton";
import { Chapter } from "../Chapter/Chapter";

export const ProjectsSection = () => {
  const { size, layout } = useContext(ScreenSizeContext);
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
          <GameProjectArticle projectData={gameProjectsData.dreamscape.projectArticle}/>
          <GameProjectArticle projectData={gameProjectsData.clockOut.projectArticle}/>
          <GameProjectArticle projectData={gameProjectsData.chihuahuaChamp.projectArticle}/>
        </div>
        {/* <WavesButton title='Explore my full portfolio' url='/'/> */}
      </div>
    </Chapter>
  );
}