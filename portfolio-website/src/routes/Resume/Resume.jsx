/**
 * Resume.jsx
 * =========
 * 
 * Main resume page component featuring:
 * - PDF download functionality
 * - Resume content display
 * - Last updated date
 * - Contact section
 */

import { useState, useEffect, useContext, useCallback } from "react";
import { Background } from "../../components/Background/Background";
import Chapter from "../../components/Chapter/Chapter";
import { ActionButton } from "../../components/Button/Button";
import { ContactSection } from "../../components/ContactSection/ContactSection";
import { Footer, FooterNav } from "../../components/Footer/Footer";
import { ResumeContent } from "../../components/ResumeContent/ResumeContent";
import ScrollAnchor from "../../components/ScrollAnchor/ScrollAnchor";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import styles from './Resume.module.css';

const RESUME_CONFIG = {
  API_URL: 'https://project-caribbean-library.vercel.app/api/resume-url',
  DATE_FORMAT: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

function Resume() {
  const [resumeData, setResumeData] = useState({
    url: '',
    uploadedAt: null,
    filename: ''
  });
  const [uploadDate, setUploadDate] = useState(null);
  const { size } = useContext(ScreenSizeContext);

  const fetchResumeData = useCallback(async () => {
    try {
      const response = await fetch(`${RESUME_CONFIG.API_URL}?type=pdf`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setResumeData(data);
      
      const date = new Date(data.uploadedAt);
      const formattedDate = date.toLocaleDateString('en-US', RESUME_CONFIG.DATE_FORMAT);
      setUploadDate(formattedDate);
    } catch (error) {
      console.error('Error fetching resume data:', error);
      setUploadDate('Error loading date');
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (resumeData.url) {
      window.open(resumeData.url, '_blank');
    } else {
      try {
        const response = await fetch(`${RESUME_CONFIG.API_URL}?type=pdf`);
        const data = await response.json();
        window.open(data.url, '_blank');
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    }
  }, [resumeData.url]);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  return (
    <div className={styles.Resume}>
      <Background>
        <ScrollAnchor />
        <main>
          <h1 className="sr-only">
            Resume Résume Resumé Résumé Daniel Narvaez
          </h1>

          <Chapter
            id="hero"
            className={`${styles.heroSection} ${styles[size]}`}
          >
            <div className={`${styles.heroContent} ${styles[size]}`}>
              <h2 className={styles.headline}>Résumé</h2>
              <p className={styles.tagline}>
                I'm currently seeking entry-level <b>game designer</b><br />
                roles. Although based in <b>New York, USA</b>,<br />
                I'm willing to relocate worldwide.
              </p>
            </div>

            <div className={`${styles.heroMedia} ${styles[size]}`}>
              <div className={`${styles.pdfDownloader} ${styles[size]}`}>
                <span>Updated: {uploadDate || 'Loading...'}</span>
                <ActionButton
                  className={styles.heroButton}
                  title="Download PDF"
                  style="solid"
                  // onCustomClick={handleDownload}
                />
              </div>
            </div>
          </Chapter>
        </main>

        <section
          id="resume"
          className={`${styles.resumeSection} ${styles[size]}`}
        >
          <ResumeContent />
        </section>

        <ContactSection />
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </div>
  );
}

export default Resume;