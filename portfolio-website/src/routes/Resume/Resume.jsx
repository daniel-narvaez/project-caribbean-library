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
import { Footer, FooterNav } from "../../components/Footer/Footer";
import { ResumeContent } from "../../components/ResumeContent/ResumeContent";
import ScrollAnchor from "../../components/ScrollAnchor/ScrollAnchor";
import { DeviceContext } from "../../contexts/DeviceContext";
import styles from './Resume.module.css';
import { Helmet } from 'react-helmet';

const RESUME_CONFIG = {
  ENDPOINT: '/api/resume-url',
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
  const { device } = useContext(DeviceContext);

  const fetchResumeData = useCallback(async () => {
    try {
      const response = await fetch(`${RESUME_CONFIG.ENDPOINT}?type=pdf`);
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
        const response = await fetch(`${RESUME_CONFIG.ENDPOINT}?type=pdf`);
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
    <>
      <Helmet>
        <title>{`Résumé | Daniel Narvaez`}</title>
      </Helmet>
      <Background>
        <div 
          className={`
            ${styles.Resume}
            ${styles[device]}
          `}
        >
          <ScrollAnchor />
          <h1 className="sr-only">
            Resume Résume Resumé Résumé | Daniel Narvaez
          </h1>

          <Chapter
            id="hero"
            className={`${styles.heroSection} ${styles[device]}`}
          >
            <div className={`${styles.heroContent} ${styles[device]}`}>
              <h2 className={styles.headline}>Résumé</h2>
              <p className={styles.tagline}>
                I'm currently seeking entry-level <b>game designer</b><br />
                roles. Although based in <b>New York, USA</b>,<br />
                I'm willing to relocate worldwide.
              </p>
            </div>

            <div className={`${styles.heroMedia} ${styles[device]}`}>
              <div className={`${styles.pdfDownloader} ${styles[device]}`}>
                <span>Updated: {uploadDate || 'Loading...'}</span>
                <ActionButton
                  className={styles.heroButton}
                  title="Download PDF"
                  style="solid"
                  onCustomClick={handleDownload}
                />
              </div>
            </div>
          </Chapter>

          <main
            id="resume"
            className={`${styles.resumeSection} ${styles[device]}`}
          >
            <ResumeContent />
          </main>

        </div>
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </>
  );
}

export default Resume;