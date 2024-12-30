/**
 * Typography Context Provider
 * 
 * This context manages responsive typography sizes throughout the application.
 * It consumes the ScreenSizeContext to determine which set of font sizes to apply.
 * Font sizes are applied via CSS variables to allow for efficient updates and maintainability.
 * 
 * Type Scales Used:
 * Desktop: Minor Third Scale (1.2) with base size of 1rem/16px
 * Mobile: Major Second Scale (1.125) with base size of 1rem/16px
 * 
 * Scale calculations:
 * Desktop (1.2 ratio): 1rem × 1.2^n
 * Mobile (1.125 ratio): 1rem × 1.125^n
 * 
 * @file Typography.jsx
 * @requires React
 * @requires ScreenSizeContext
 */

import React, { createContext, useContext, useEffect } from 'react';
import { ScreenSizeContext } from './ScreenSize';
import '../typography.css';

// Initialize context for typography settings
const TypographyContext = createContext();

/**
 * Typography Provider Component
 * 
 * @component
 * @param {Object} props
 * @param {ReactNode} props.children - Child components that will have access to typography settings
 */
export const TypographyProvider = ({ children }) => {
  // Consume screen size context to determine which typography scale to use
  const { size } = useContext(ScreenSizeContext);

  // Define typography scales for different device sizes
  const fontSizes = {
    Desktop: {
      // Minor Third Scale (1.2)
      h1: '2.074rem',     // 33.18 px (1.2^4)
      h2: '1.728rem',      // 27.65px (1.2^3)
      h3: '1.44rem',       // 23.04px (1.2^2)
      inline: '1.2rem',   // 19.2px  (1.2^1)

      heroHeadline: '3rem',
      heroTagline: '1.5rem',
      heroCtaButton: '1.5rem'
    },
    Mobile: {
      // Major Second Scale (1.125)
      h1: '1.602rem',     // 25.63px (1.125^4)
      h2: '1.424rem',     // 22.78px (1.125^3)
      h3: '1.266rem',     // 20.25px (1.125^2)
      inline: '1.125rem', // 18px    (1.125^1)

      heroHeadline: '1.8rem',
      heroTagline: '1rem',
      heroCtaButton: '0.8rem'
    }
  };

  /**
   * Effect: Update CSS Variables
   * 
   * Updates CSS custom properties whenever the screen size changes.
   * These variables are used in text.css to style typography elements.
   * 
   * CSS Variables Set:
   * --h1-size: Size for h1 headings
   * --h2-size: Size for h2 headings
   * --h3-size: Size for h3 headings
   * --text-size: Size for inline elements (spans, labels)
   */
  useEffect(() => {
    const root = document.documentElement;
    const device = size; // 'Mobile' or 'Desktop' from ScreenSizeContext

    // Set CSS custom properties for typography
    root.style.setProperty('--h1-size', fontSizes[device].h1);
    root.style.setProperty('--h2-size', fontSizes[device].h2);
    root.style.setProperty('--h3-size', fontSizes[device].h3);
    root.style.setProperty('--inline-size', fontSizes[device].inline);
    
    root.style.setProperty('--hero-headline-size', fontSizes[device].heroHeadline);
    root.style.setProperty('--hero-tagline-size', fontSizes[device].heroTagline);
    root.style.setProperty('--hero-cta-button-size', fontSizes[device].heroCtaButton);
  }, [size]); // Re-run when screen size changes

  return (
    <TypographyContext.Provider value={{}}>
      {children}
    </TypographyContext.Provider>
  );
};

/**
 * Usage Example:
 * 
 * import { TypographyProvider } from './Typography';
 * 
 * function App() {
 *   return (
 *     <ScreenSizeProvider>
 *       <TypographyProvider>
 *         <YourComponents />
 *       </TypographyProvider>
 *     </ScreenSizeProvider>
 *   );
 * }
 */