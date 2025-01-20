/**
 * Home.jsx
 * ========
 * 
 * Main landing page component that organizes the portfolio's primary sections
 * in a vertical scroll layout.
 * 
 * Section Order:
 * 1. Hero Section - Introduction and key visuals
 * 2. Projects Section - Portfolio work showcase
 * 3. About Section - Personal information
 * 4. Contact Section - Contact form and details
 * 
 * Features:
 * - Scroll-based navigation
 * - Background wrapper for consistent styling
 * - Screen reader accessible title
 * - Section-based organization
 */
import { useContext } from 'react';

import { Background } from '../../components/Background/Background';
import { ScrollAnchor } from '../../components/ScrollAnchor/ScrollAnchor';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { ProjectsSection } from '../../components/ProjectsSection/ProjectsSection';
import { AboutSection } from '../../components/AboutSection/AboutSection';
import { EmailForm } from '../../components/EmailForm/EmailForm';
import { Footer, FooterNav } from '../../components/Footer/Footer';
import styles from './Home.module.css';
import Chapter from '../../components/Chapter/Chapter';
import { ScreenSizeContext } from '../../contexts/ScreenSize';

/**
 * Home Component
 * Serves as the main landing page and organizes all major sections
 * of the portfolio in a scrollable layout.
 */
function Home() {
  const { size } = useContext(ScreenSizeContext);
  
  return (
    <div className={styles.Home}>
      <Background>
        {/* Screen reader accessible title */}
        <h1 className="sr-only">Home | Daniel Narvaez</h1>
        
        {/* Scroll navigation utility */}
        <ScrollAnchor />
        
        {/* Main content sections */}
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <Chapter
          id='contact'
          className={`
            ${styles.contactSection}
            ${styles[size]}
          `}
        >
          <EmailForm tagline="Want to reach out? Cast a message to my inbox, and let's begin our conversation." />
        </Chapter>
        
        {/* Footer */}
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </div>
  );
}

export default Home;