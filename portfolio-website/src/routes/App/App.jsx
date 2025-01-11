import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ScreenSizeProvider } from '../../contexts/ScreenSize';
import { TypographyProvider } from '../../contexts/Typography';
import { ChaptersProvider } from '../../contexts/ChaptersContext';
import { AnimatedCursor, SplashEffect } from '../../components/Cursor/Cursor';

import Home from '../Home/Home';

import styles from './App.module.css'

import { gameProjectsData } from '../../data/gameProjects';
import { GameProjectPage } from '../GameProjects/GameProjectPage';

function App() {
  return (
    
    <ScreenSizeProvider>
        <TypographyProvider>
          <ChaptersProvider>
            <div className={styles.App}>
              <BrowserRouter>
                <SplashEffect />
                <AnimatedCursor />
                <Routes>
                  <Route key='root' path="/" element={<Home />} />
                  <Route key='home' path="/home" element={<Home />} />
                  
                  {Object.values(gameProjectsData).map((gameProject) => {
                    return (
                      <Route
                        key={gameProject.path}
                        path={gameProject.urls.portfolio}
                        element={<GameProjectPage game={gameProject} />}
                      />
                    );
                  })}
                </Routes>
              </BrowserRouter>
            </div>
          </ChaptersProvider>
        </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
