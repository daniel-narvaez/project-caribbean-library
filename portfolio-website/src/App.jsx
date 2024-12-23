import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';
import { ChaptersProvider } from './contexts/ChaptersContext';

import { AnimatedCursor, SplashEffect } from './components/Cursor/Cursor';
import { Background } from './components/Background/Background';
import { HeroSection } from './components/HeroSection/HeroSection';
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection';
import { AboutSection } from './components/AboutSection/AboutSection';
import { ContactSection } from './components/ContactSection/ContactSection';
import { Footer, FooterNav } from './components/Footer/Footer';
import { ScrollAnchor } from './components/ScrollAnchor/ScrollAnchor';

function App() {
  return (
    
    <ScreenSizeProvider>
        <TypographyProvider>
          <SplashEffect />
          <AnimatedCursor />
          <ChaptersProvider>
            <div className={styles.App}>
              <Background>
                <ScrollAnchor />
                <HeroSection />
                <ProjectsSection />
                <AboutSection />
                <ContactSection />
                <Footer>
                  <FooterNav/>
                </Footer>
              </Background>
            </div>
          </ChaptersProvider>
        </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
