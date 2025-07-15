import React, { createContext, useContext, useEffect } from 'react';
import { DeviceContext } from './DeviceContext';

const MarginsContext = createContext();

export const MarginsProvider = ({children}) => {
  // Consume screen size context to determine which typography scale to use
  const { size } = useContext(DeviceContext);

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
      m32: '128px'
    },
    tablet: {
      m1: '3px',
      m2: '6px',
      m3: '9px',
      m4: '12px',
      m8: '24px',
      m12: '36px',
      m20: '60px',
      m32: '96px'
    },
    mobile: {
      m1: '3px',
      m2: '6px',
      m3: '9px',
      m4: '12px',
      m8: '24px',
      m12: '36px',
      m20: '60px',
      m32: '96px'
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const device = size;

    // Set CSS custom variables for margins, given the device context.
    // Because these are numbers, we use the 'num' prefix.
    root.style.setProperty('--num-m1', margins[device].m1);
    root.style.setProperty('--num-m2', margins[device].m2);
    root.style.setProperty('--num-m3', margins[device].m3);
    root.style.setProperty('--num-m4', margins[device].m4);
    root.style.setProperty('--num-m8', margins[device].m8);
    root.style.setProperty('--num-m12', margins[device].m12);
    root.style.setProperty('--num-m20', margins[device].m20);
    root.style.setProperty('--num-m32', margins[device].m32);
  }, [size]); // Re-run when the device context changes

  return (
    <MarginsContext.Provider  value={{}}>
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