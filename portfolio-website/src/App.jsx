import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';
import { SafeAreaProvider } from './contexts/SafeArea';

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
        </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
