import { Background } from '../../components/Background/Background';
import { ScrollAnchor } from '../../components/ScrollAnchor/ScrollAnchor';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { ProjectsSection } from '../../components/ProjectsSection/ProjectsSection';
import { AboutSection } from '../../components/AboutSection/AboutSection';
import { ContactSection } from '../../components/ContactSection/ContactSection';
import { Footer, FooterNav } from '../../components/Footer/Footer';

import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.Home}>
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
  );
}

export default Home;