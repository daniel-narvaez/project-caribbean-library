import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';
import { SafeAreaProvider } from './contexts/SafeArea';

import { AnimatedCursor, SplashEffect } from './components/Cursor/Cursor';
import { Background } from './components/Background/Background';
import { HeroSection } from './components/HeroSection/HeroSection';
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection';
import { AboutSection } from './components/AboutSection/AboutSection';
import { Footer, FooterNav } from './components/Footer/Footer';

function App() {
  return (
    
    <ScreenSizeProvider>
      <SafeAreaProvider>
        <TypographyProvider>
          <SplashEffect />
          <AnimatedCursor />
          <div className={styles.App}>
            <Background>
              <HeroSection />
              <ProjectsSection />
              <AboutSection />
              <Footer>
                <FooterNav/>
              </Footer>
            </Background>
          </div>
        </TypographyProvider>
      </SafeAreaProvider>
    </ScreenSizeProvider>
  )
}

export default App
