import React from "react";
import { useState, useEffect } from "react";

import { Background } from "../../components/Background/Background";
import Chapter from "../../components/Chapter/Chapter";

import styles from './Resume.module.css'
import { ActionButton } from "../../components/Button/Button";
import { ContactSection } from "../../components/ContactSection/ContactSection";
import { Footer, FooterNav } from "../../components/Footer/Footer";
import ResumeContent from "./ResumeContent";
import ScrollAnchor from "../../components/ScrollAnchor/ScrollAnchor";

function Resume() {
  const [uploadDate, setUploadDate] = useState(null);
  
  const fetchResumeMetadata = async () => {
    try {
      // Replace with your Vercel Blob URL
      const response = await fetch('https://tq0koclkz81vf3zv.public.blob.vercel-storage.com/DanielNarvaez_Resume-tyQaSXEAziDcmgp0FGGBWvGsZJzgnq.docx', {
        method: 'HEAD' // We only need headers, not the full file
      });
      
      if (!response.ok) throw new Error('Failed to fetch resume metadata');
      
      const lastModified = response.headers.get('last-modified');
      const date = new Date(lastModified);
      
      // Format the date (you can adjust the format as needed)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setUploadDate(formattedDate);
    } catch (error) {
      console.error('Error fetching resume date:', error);
    }
  };

  useEffect(() => {
    fetchResumeMetadata();
  }, []);

  return (
    <div className={styles.Resume}>
      <Background>
        <ScrollAnchor />
        <main>
          <h1 className="sr-only">Resume Résume Resumé Résumé Daniel Narvaez</h1>
          <Chapter 
            id='hero' 
            className={styles.heroSection}
          >
            <div className={styles.heroContent}>
              <h2 className={styles.headline}>
                Résumé
              </h2>
              
              <p className={styles.tagline}>
                I'm currently seeking entry-level <b>game designer</b><br/>
                roles. Although based in New York, USA,<br/>
                I'm willing to relocate <b>worldwide</b>.
              </p>
            </div>
            <div className={styles.heroMedia}>
              <div className={styles.pdfDownloader}>
                <span>Updated: {uploadDate || 'Loading...'}</span>
                <ActionButton
                  className={styles.heroButton}
                  title="Download PDF"
                  style="solid"
                  // onCustomClick={() => window.open('https://tq0koclkz81vf3zv.public.blob.vercel-storage.com/DanielNarvaez_Resume-tyQaSXEAziDcmgp0FGGBWvGsZJzgnq.docx', '_blank')}
                />
              </div>
            </div>
          </Chapter>
        </main>
        <Chapter 
          id='resume'
          className={styles.resumeSection}
        >
          <ResumeContent />
        </Chapter>
        <ContactSection />
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </div>
  )
}

export default Resume;