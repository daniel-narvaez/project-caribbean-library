import { useState, useEffect, useContext } from 'react';
import mammoth from 'mammoth';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './ResumeContent.module.css';

const ResumeContent = () => {
  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { size } = useContext(ScreenSizeContext);

  // Define which sections go in which column
  const leftColumnSections = ['core competencies','projects'];
  const rightColumnSections = ['education', 'experience', 'skills'];

  const parseHTMLContent = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return Array.from(doc.body.children);
  };

  const getSectionType = (heading) => {
    const title = heading.toLowerCase(); // heading is already the text content
    if (leftColumnSections.some(section => title.includes(section))) return 'left';
    if (rightColumnSections.some(section => title.includes(section))) return 'right';
    return 'right'; // Default to right column if unknown
  };

  const processContent = (elements) => {
    const elementToReact = (element, index) => {
      const key = `${element.tagName}-${index}`;
      
      switch (element.tagName.toLowerCase()) {
          case 'h2':
              return (
                <h2 
                  key={key} 
                  className={styles.heading}
                >
                  {element.textContent}
                </h2>
              );
          case 'h3':
            return (
              <h3 
                key={key} 
                className={styles.subheading}
              >
                {element.textContent}
              </h3>
            );
          case 'p':
            return (
              <p 
                key={key} 
                className={styles.paragraph}
              >
                {element.textContent}
              </p>
            );
          case 'ul':
              return (
                  <ul 
                    key={key} 
                    className={`
                      ${styles.list} 
                      ${styles[size]}
                    `}
                  >
                      {Array.from(element.children).map((li, liIndex) => (
                          <li key={`${key}-li-${liIndex}`} className={styles.listItem}>
                              {li.textContent}
                          </li>
                      ))}
                  </ul>
              );
          default:
              return null;
      }
    };

    const sections = [];
    let currentSection = [];
          
    elements.forEach((element, index) => {
      if (element.tagName.toLowerCase() === 'h2' && currentSection.length > 0) {
        sections.push(
          <section 
            key={`section-${index}`}
            className={`
              ${styles.section} 
              ${styles[size]}
            `}
          >
            {currentSection}
          </section>
        );
        currentSection = [];
      }
      currentSection.push(elementToReact(element, index));
    });

    if (currentSection.length > 0) {
      sections.push(
        <section 
          key={`section-${sections.length}`}
          className={`
            ${styles.section} 
            ${styles[size]}
          `}
        >
          {currentSection}
        </section>
      );
    }

    // Sort into columns after sections are created
    const columns = {
      leftContent: [],
      rightContent: []
    };

    sections.forEach(section => {
      const firstHeading = section.props.children[0];
      if (firstHeading && getSectionType(firstHeading.props.children) === 'left') {
          columns.leftContent.push(section);
      } else if (firstHeading && getSectionType(firstHeading.props.children) === 'right') {
          columns.rightContent.push(section);
      }
    });

    return columns;
  };

  useEffect(() => {
    const loadResume = async () => {
        try {
            // First get the URL from our API
            const urlResponse = await fetch('https://project-caribbean-library.vercel.app/api/resume-url?type=docx');
            if (!urlResponse.ok) {
                throw new Error(`HTTP error! status: ${urlResponse.status}`);
            }
            const { url } = await urlResponse.json();

            // Then use that URL to fetch the actual document
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const domElements = parseHTMLContent(result.value);
            const { leftContent, rightContent } = processContent(domElements);
            
            setLeftColumn(leftContent);
            setRightColumn(rightContent);
        } catch (err) {
            setError(`Failed to load resume: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    loadResume();
}, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading resume...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div 
      className={`
        ${styles.resumeContent}
        ${styles[size]}
      `}
    >
      <div 
        className={`
          ${styles.leftColumn} 
          ${styles[size]}
        `}
      >
        {leftColumn}
      </div>
      <div 
        className={`
          ${styles.rightColumn} 
          ${styles[size]}
        `}
      >
        {rightColumn}
      </div>
    </div>
  );
};

export default ResumeContent;