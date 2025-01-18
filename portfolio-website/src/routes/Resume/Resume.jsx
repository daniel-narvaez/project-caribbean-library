import React, { useContext } from "react";
import { useState, useEffect } from "react";

import { Background } from "../../components/Background/Background";
import Chapter from "../../components/Chapter/Chapter";

import styles from './Resume.module.css'
import { ActionButton } from "../../components/Button/Button";
import { ContactSection } from "../../components/ContactSection/ContactSection";
import { Footer, FooterNav } from "../../components/Footer/Footer";
import ResumeContent from "./ResumeContent";
import ScrollAnchor from "../../components/ScrollAnchor/ScrollAnchor";
import { ScreenSizeContext } from "../../contexts/ScreenSize";

function Resume() {
  const [resumeData, setResumeData] = useState({
    url: '',
    uploadedAt: null,
    filename: ''
  });
  const [uploadDate, setUploadDate] = useState(null);
  const { size } = useContext(ScreenSizeContext);
  
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch('https://project-caribbean-library.vercel.app/api/resume-url?type=docx');
        const data = await response.json();
        setResumeData(data);
        
        // Format the date here if needed
        const date = new Date(data.uploadedAt);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setUploadDate(formattedDate);
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
    };

    fetchResumeData();
  }, []);

  return (
    <div className={styles.Resume}>
      <Background>
        <ScrollAnchor />
        <main>
          <h1 className="sr-only">Resume Résume Resumé Résumé Daniel Narvaez</h1>
          <Chapter 
            id='hero' 
            className={`
              ${styles.heroSection}
              ${styles[size]}
            `}
          >
            <div 
              className={`
                ${styles.heroContent}
                ${styles[size]}
              `}
            >
              <h2 className={styles.headline}>
                Résumé
              </h2>
              
              <p className={styles.tagline}>
                I'm currently seeking entry-level <b>game designer</b><br/>
                roles. Although based in <b>New York, USA</b>,<br/>
                I'm willing to relocate worldwide.
              </p>
            </div>
            <div 
              className={`
                ${styles.heroMedia}
                ${styles[size]}
              `}
            >
              <div 
                className={`
                  ${styles.pdfDownloader}
                  ${styles[size]}
                `}
              >
                <span>Updated: {uploadDate || 'Loading...'}</span>
                <ActionButton
                  className={styles.heroButton}
                  title="Download PDF"
                  style="solid"
                  onCustomClick={async () => {
                    try {
                      const response = await fetch('https://project-caribbean-library.vercel.app/api/resume-url?type=pdf');
                      const data = await response.json();
                      window.open(data.url);
                    } catch (error) {
                      console.error('Error fetching PDF URL:', error);
                    }
                  }}
                />
              </div>
            </div>
          </Chapter>
        </main>
        <section
          id='resume'
          className={`
            ${styles.resumeSection}
            ${styles[size]}
          `}
        >
          <ResumeContent />
        </section>
        <ContactSection />
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </div>
  )
}

export default Resume;