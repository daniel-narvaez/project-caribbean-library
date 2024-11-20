import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { TypographyProvider } from './contexts/Typography';

import { Navbar } from './components/Navbar/Navbar';
import { HeroSection } from './components/HeroSection/HeroSection';

function App() {

  return (
    <ScreenSizeProvider>
      <TypographyProvider>
        <div className={styles.App}>
          <HeroSection />
        </div>
      </TypographyProvider>
    </ScreenSizeProvider>
  )
}

export default App
