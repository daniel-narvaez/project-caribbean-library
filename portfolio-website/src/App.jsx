import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';

import { AnimatedCursor, SplashEffect } from './components/Cursor/Cursor';
import { Background } from './components/Background/Background';
import { HeroSection } from './components/HeroSection/HeroSection';
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection';
import { AboutSection } from './components/AboutSection/AboutSection';

function App() {
  return (
    
    <ScreenSizeProvider>
      <TypographyProvider>
        <AnimatedCursor />
        <div className={styles.App}>
          <Background>
            <HeroSection />
            <ProjectsSection />
            <AboutSection />
          </Background>
        </div>
        <SplashEffect />
      </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
