import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';

import { Navbar } from './components/Navbar/Navbar';
import { HeroSection } from './components/HeroSection/HeroSection';
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection';

function App() {

  return (
    <ScreenSizeProvider>
      <TypographyProvider>
        <div className={styles.App}>
          <HeroSection />
          <ProjectsSection />
        </div>
      </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
