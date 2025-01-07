import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ScreenSizeProvider } from '../../contexts/ScreenSize';
import { TypographyProvider } from '../../contexts/Typography';
import { ChaptersProvider } from '../../contexts/ChaptersContext';
import { AnimatedCursor, SplashEffect } from '../../components/Cursor/Cursor';

import Home from '../Home/Home';

import styles from './App.module.css'
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
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  {/* {
                    Object.entries().map(([path, props]) => (
                      <Route
                        key={path}
                        path={`./GameProjects/${path}`}
                        element={<GameProjectPage {...props} />}
                      />
                    ))
                  } */}
                </Routes>
              </BrowserRouter>
            </div>
          </ChaptersProvider>
        </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
