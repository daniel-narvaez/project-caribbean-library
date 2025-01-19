/**
 * ResumeContent.jsx
 * ================
 * 
 * A component that fetches, processes, and displays resume content from a DOCX file.
 * Handles conversion from DOCX to HTML and organizes content into two columns
 * based on predefined section assignments.
 */

import { useState, useEffect, useContext, useCallback } from 'react';
import mammoth from 'mammoth';
import { ScreenSizeContext } from '../../contexts/ScreenSize';
import styles from './ResumeContent.module.css';

/**
 * Configuration for resume section organization
 */
const RESUME_CONFIG = {
    SECTIONS: {
        LEFT: ['core competencies', 'projects'],
        RIGHT: ['education', 'experience', 'skills']
    },
    API_URL: 'https://project-caribbean-library.vercel.app/api/resume-url',
    FILE_TYPE: 'docx'
};

/**
 * Component for displaying and managing resume content
 */
export const ResumeContent = () => {
    // State management
    const [leftColumn, setLeftColumn] = useState([]);
    const [rightColumn, setRightColumn] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { size } = useContext(ScreenSizeContext);

    /**
     * Determines which column a section belongs in based on its heading
     * @param {string} heading - Section heading text
     * @returns {'left' | 'right'} Column assignment
     */
    const getSectionType = useCallback((heading) => {
        const title = heading.toLowerCase();
        if (RESUME_CONFIG.SECTIONS.LEFT.some(section => title.includes(section))) return 'left';
        if (RESUME_CONFIG.SECTIONS.RIGHT.some(section => title.includes(section))) return 'right';
        return 'right'; // Default to right column
    }, []);

    /**
     * Parses HTML string into DOM elements
     * @param {string} htmlString - HTML content to parse
     * @returns {Element[]} Array of DOM elements
     */
    const parseHTMLContent = useCallback((htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return Array.from(doc.body.children);
    }, []);
/**
     * Converts HTML elements into React components
     * @param {Element} element - DOM element to convert
     * @param {number} index - Element index for key generation
     * @returns {JSX.Element} React component
     */
const elementToReact = useCallback((element, index) => {
  const key = `${element.tagName}-${index}`;

  // Helper function to process text nodes and inline elements
  const processTextContent = (node, childIndex) => {
      if (!node) return null;
      
      if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
      }
      
      const childKey = `${key}-${childIndex}`;
      
      switch (node.nodeName.toLowerCase()) {
          case 'strong':
          case 'b':
              return <strong key={childKey}>{Array.from(node.childNodes).map((child, i) => processTextContent(child, `${childIndex}-${i}`))}</strong>;
          case 'em':
          case 'i':
              return <em key={childKey}>{Array.from(node.childNodes).map((child, i) => processTextContent(child, `${childIndex}-${i}`))}</em>;
          default:
              return Array.from(node.childNodes).map((child, i) => processTextContent(child, `${childIndex}-${i}`));
      }
  };
  
  const componentMap = {
      h2: () => (
          <h2 key={key} className={styles.heading}>
              {Array.from(element.childNodes).map((node, i) => processTextContent(node, i))}
          </h2>
      ),
      h3: () => (
          <h3 key={key} className={styles.subheading}>
              {Array.from(element.childNodes).map((node, i) => processTextContent(node, i))}
          </h3>
      ),
      p: () => (
          <p key={key} className={styles.paragraph}>
              {Array.from(element.childNodes).map((node, i) => processTextContent(node, i))}
          </p>
      ),
      ul: () => (
          <ul key={key} className={`${styles.list} ${styles[size]}`}>
              {Array.from(element.children).map((li, liIndex) => (
                  <li key={`${key}-li-${liIndex}`} className={styles.listItem}>
                      {Array.from(li.childNodes).map((node, i) => processTextContent(node, i))}
                  </li>
              ))}
          </ul>
      )
  };

  const tagName = element.tagName.toLowerCase();
  return componentMap[tagName]?.() || null;
}, [size]);

  /**
  * Processes HTML elements into organized sections and columns
  * @param {Element[]} elements - Array of DOM elements to process
  * @returns {{leftContent: JSX.Element[], rightContent: JSX.Element[]}} Organized content
  */
  const processContent = useCallback((elements) => {
    // First, organize elements into sections
    const sections = elements.reduce((acc, element, index) => {
        if (element.tagName.toLowerCase() === 'h2' && acc.currentSection.length > 0) {
            acc.sections.push(
                <section key={`section-${acc.sections.length}`} className={`${styles.section} ${styles[size]}`}>
                    {acc.currentSection}
                </section>
            );
            acc.currentSection = [];
        }
        
        acc.currentSection.push(elementToReact(element, index));
        return acc;
    }, { sections: [], currentSection: [] });

    // Handle last section if exists
    if (sections.currentSection.length > 0) {
        sections.sections.push(
            <section 
                key={`section-${sections.sections.length}`}
                className={`${styles.section} ${styles[size]}`}
            >
                {sections.currentSection}
            </section>
        );
    }

    // Sort sections into columns
    return sections.sections.reduce((columns, section) => {
        const firstHeading = section.props.children[0];
        if (firstHeading) {
            const columnType = getSectionType(firstHeading.props.children);
            const columnKey = columnType === 'left' ? 'leftContent' : 'rightContent';
            columns[columnKey].push(section);
        }
        return columns;
    }, { leftContent: [], rightContent: [] });
  }, [size, elementToReact, getSectionType]);

/**
     * Fetches and processes resume content
     */
useEffect(() => {
  const loadResume = async () => {
      try {
          // Fetch resume URL from API
          const urlResponse = await fetch(`${RESUME_CONFIG.API_URL}?type=${RESUME_CONFIG.FILE_TYPE}`);
          if (!urlResponse.ok) {
              throw new Error(`Failed to fetch resume URL: ${urlResponse.status}`);
          }
          const { url } = await urlResponse.json();

          // Fetch and process document
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`Failed to fetch resume document: ${response.status}`);
          }
          
          // Convert DOCX to HTML
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });

          // Process content and update state
          const domElements = parseHTMLContent(result.value);
          const { leftContent, rightContent } = processContent(domElements);
          
          setLeftColumn(leftContent);
          setRightColumn(rightContent);
      } catch (err) {
          setError(`Failed to load resume: ${err.message}`);
          console.error('Resume loading error:', err);
      } finally {
          setIsLoading(false);
      }
  };

  loadResume();
}, [parseHTMLContent, processContent]);

// Loading state
if (isLoading) {
  return <div className={styles.loading}>Loading resume...</div>;
}

// Error state
if (error) {
  return <div className={styles.error}>{error}</div>;
}

// Render resume content
return (
  <div className={`${styles.resumeContent} ${styles[size]}`}>
      <div className={`${styles.leftColumn} ${styles[size]}`}>
          {leftColumn}
      </div>
      <div className={`${styles.rightColumn} ${styles[size]}`}>
          {rightColumn}
      </div>
  </div>
);
};

export default ResumeContent;