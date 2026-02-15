/**
 * Typoscales Context Provider
 * 
 * This context manages responsive typescales throughout the application.
 * It consumes the DeviceContext to determine which set of font sizes to apply.
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
 * @file Typescales.jsx
 * @requires React
 * @requires DeviceContext
 */

import { createContext, useContext, useEffect } from 'react';
import { DeviceContext } from './DeviceContext';
// import '../typography.css';

// Initialize context for typography settings
const TypescalesContext = createContext();

/**
 * Typography Provider Component
 * 
 * @component
 * @param {Object} props
 * @param {ReactNode} props.children - Child components that will have access to typography settings
 */
export const TypescalesProvider = ({ children }) => {
  // Consume screen size context to determine which typography scale to use
  const { device } = useContext(DeviceContext);

  // Store the root style in a variable
  const rootCss = document.documentElement.style;

  // Define typography scales for different device sizes
  const fontSizes = {
    desktop: {
      // Major Third Scale
      h1: '48.83px',
      h2: '39.06px',
      h3: '31.25px',
      h4: '25px',
      b1: '20px',
      b2: '16px',
      b3: '12.8px',
      ui1: '31.25px',
      ui2: '25px',
      ui3: '20px',
      ui4: '16px',

      inline: '1.2rem',   // 19.2px  (1.2^1)
      heroHeadline: '3rem',
      heroTagline: '1.5rem',
      heroCtaButton: '1.5rem'
    },
    tablet: {
      // Minor Third Scale
      h1: '39.81px',
      h2: '33.18px',
      h3: '27.65px',
      h4: '23.04px',
      b1: '19.2px',
      b2: '16px',
      b3: '13.33px',
      ui1: '27.65px',
      ui2: '23.04px',
      ui3: '19.2px',
      ui4: '16px',

      inline: '1.2rem',   // 19.2px  (1.2^1)
      heroHeadline: '3rem',
      heroTagline: '1.5rem',
      heroCtaButton: '1.5rem'
    },
    mobile: {
      // Minor Third Scale
      h1: '39.81px',
      h2: '33.18px',
      h3: '27.65px',
      h4: '23.04px',
      b1: '19.2px',
      b2: '16px',
      b3: '13.33px',
      ui1: '27.65px',
      ui2: '23.04px',
      ui3: '19.2px',
      ui4: '16px',

      inline: '1.125rem', // 18px    (1.125^1)
      heroHeadline: '2rem',
      heroTagline: '1.25rem',
      heroCtaButton: '1.125rem'
    }
  };

    const lineHeights = {
    desktop: {
      h1: '58px',
      h2: '52px',
      h3: '44px',
      h4: '35px',
      b1: '28px',
      b2: '24px',
      b3: '21px',
      ui1: '39px',
      ui2: '33px',
      ui3: '28px',
      ui4: '26px',
    },
    tablet: {
      h1: '44px',
      h2: '40px',
      h3: '36px',
      h4: '30px',
      b1: '27px',
      b2: '24px',
      b3: '22px',
      ui1: '36px',
      ui2: '32px',
      ui3: '29px',
      ui4: '26px',
    },
    mobile: {
      h1: '44px',
      h2: '40px',
      h3: '36px',
      h4: '30px',
      b1: '27px',
      b2: '24px',
      b3: '22px',
      ui1: '36px',
      ui2: '32px',
      ui3: '29px',
      ui4: '26px',
    }
  };

  const calcRem = (pxStr) => {
    let pxNum = parseFloat(pxStr);

    if (typeof pxStr !== 'string' || isNaN(pxNum) || !isFinite(pxNum))
      return pxNum.toString();

    let remStr = (parseFloat(pxStr) / 16).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6
    }) + 'rem';

    return remStr
  }
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
    // Set CSS custom properties for the font sizes
    rootCss.setProperty('--fs-h1', calcRem(fontSizes[device].h1));
    rootCss.setProperty('--fs-h2', calcRem(fontSizes[device].h2));
    rootCss.setProperty('--fs-h3', calcRem(fontSizes[device].h3));
    rootCss.setProperty('--fs-h4', calcRem(fontSizes[device].h4));
    rootCss.setProperty('--fs-b1', calcRem(fontSizes[device].b1));
    rootCss.setProperty('--fs-b2', calcRem(fontSizes[device].b2));
    rootCss.setProperty('--fs-b3', calcRem(fontSizes[device].b3));
    rootCss.setProperty('--fs-ui1', calcRem(fontSizes[device].ui1));
    rootCss.setProperty('--fs-ui2', calcRem(fontSizes[device].ui2));
    rootCss.setProperty('--fs-ui3', calcRem(fontSizes[device].ui3));
    rootCss.setProperty('--fs-ui4', calcRem(fontSizes[device].ui4));

    // Set CSS custom properties for the lineheights
    rootCss.setProperty('--lh-h1', calcRem(lineHeights[device].h1));
    rootCss.setProperty('--lh-h2', calcRem(lineHeights[device].h2));
    rootCss.setProperty('--lh-h3', calcRem(lineHeights[device].h3));
    rootCss.setProperty('--lh-h4', calcRem(lineHeights[device].h4));
    rootCss.setProperty('--lh-b1', calcRem(lineHeights[device].b1));
    rootCss.setProperty('--lh-b2', calcRem(lineHeights[device].b2));
    rootCss.setProperty('--lh-b3', calcRem(lineHeights[device].b3));
    rootCss.setProperty('--lh-ui1', calcRem(lineHeights[device].ui1));
    rootCss.setProperty('--lh-ui2', calcRem(lineHeights[device].ui2));
    rootCss.setProperty('--lh-ui3', calcRem(lineHeights[device].ui3));
    rootCss.setProperty('--lh-ui4', calcRem(lineHeights[device].ui4));

    // obsolete
    rootCss.setProperty('--inline-size', fontSizes[device].inline);
    rootCss.setProperty('--hero-headline-size', fontSizes[device].heroHeadline);
    rootCss.setProperty('--hero-tagline-size', fontSizes[device].heroTagline);
    rootCss.setProperty('--hero-cta-button-size', fontSizes[device].heroCtaButton);
  }, [device]); // Re-run when screen size changes

  return (
    <TypescalesContext.Provider>
      {children}
    </TypescalesContext.Provider>
  );
};

/**
 * Usage Example:
 * 
 * import { TypographyProvider } from './contexts/Typography';
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