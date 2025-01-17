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

import { Background } from '../../components/Background/Background';
import { ScrollAnchor } from '../../components/ScrollAnchor/ScrollAnchor';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { ProjectsSection } from '../../components/ProjectsSection/ProjectsSection';
import { AboutSection } from '../../components/AboutSection/AboutSection';
import { ContactSection } from '../../components/ContactSection/ContactSection';
import { Footer, FooterNav } from '../../components/Footer/Footer';
import styles from './Home.module.css';

/**
 * Home Component
 * Serves as the main landing page and organizes all major sections
 * of the portfolio in a scrollable layout.
 */
function Home() {
    return (
        <div className={styles.Home}>
            <Background>
                {/* Screen reader accessible title */}
                <h1 className="sr-only">Home Daniel Narvaez</h1>
                
                {/* Scroll navigation utility */}
                <ScrollAnchor />
                
                {/* Main content sections */}
                <HeroSection />
                <ProjectsSection />
                <AboutSection />
                <ContactSection />
                
                {/* Footer */}
                <Footer>
                    <FooterNav />
                </Footer>
            </Background>
        </div>
    );
}

export default Home;