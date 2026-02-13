import { createContext, useContext, useEffect } from 'react';
import { DeviceContext } from './DeviceContext';

const MarginsContext = createContext();

export const MarginsProvider = ({children}) => {
  // Consume screen size context to determine which typography scale to use
  const { device } = useContext(DeviceContext);

  // Store the root style in a variable
  const rootCss = document.documentElement.style;

  // Define margin sizes for different devices
  // 
  // Developer's note: m1 is the base. and the number followed by 'm' is the multiple of that device's base (ex: desktop m8 = 8 * 4px = 32px)
  const margins = {
    desktop: {
      m1: '4px',
      m2: '8px',
      m3: '12px',
      m4: '16px',
      m8: '32px',
      m12: '48px',
      m20: '80px',
      m32: '128px',
    },
    tablet: {
      m1: '3px',
      m2: '6px',
      m3: '9px',
      m4: '12px',
      m8: '24px',
      m12: '36px',
      m20: '60px',
      m32: '96px',
    },
    mobile: {
      m1: '3px',
      m2: '6px',
      m3: '9px',
      m4: '12px',
      m8: '24px',
      m12: '36px',
      m20: '60px',
      m32: '96px',
    }
  };

  useEffect(() => {
    // Set CSS custom variables for margins, given the device context.
    // Because these are numbers, we use the 'num' prefix.
    rootCss.setProperty('--num-m1', margins[device].m1);
    rootCss.setProperty('--num-m2', margins[device].m2);
    rootCss.setProperty('--num-m3', margins[device].m3);
    rootCss.setProperty('--num-m4', margins[device].m4);
    rootCss.setProperty('--num-m8', margins[device].m8);
    rootCss.setProperty('--num-m12', margins[device].m12);
    rootCss.setProperty('--num-m20', margins[device].m20);
    rootCss.setProperty('--num-m32', margins[device].m32);
  }, [device]); // Re-run when the device context changes

  return (
    <MarginsContext.Provider value={{}}>
      {children}
    </MarginsContext.Provider>
  );
};

/**
 * Usage Example:
 * 
 * import { MarginsProvider } from './contexts/Margins';
 * 
 * function App() {
 *   return (
 *     <DeviceProvider>
 *       <MarginsProvider>
 *         <YourComponents />
 *       </MarginsProvider>
 *     </DeviceProvider>
 *   );
 * }
 */