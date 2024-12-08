import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';

import { SplashEffect } from './components/Cursor/Cursor';
import { Background } from './components/Background/Background';
import { HeroSection } from './components/HeroSection/HeroSection';
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection';

function App() {
  return (
    <ScreenSizeProvider>
      <TypographyProvider>
        <div className={styles.App}>
          <Background>
            <HeroSection />
            <ProjectsSection />
          </Background>
        </div>
        <SplashEffect />
      </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
