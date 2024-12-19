import React, { createContext, useContext, useEffect } from 'react';
import { ScreenSizeContext } from './ScreenSize';

const SafeAreaContext = createContext();

const SafeAreaProvider = ({ children }) => {
  const { size } = useContext(ScreenSizeContext);
  
  useEffect(() => {
    const root = document.documentElement;

    const safeTop = root.style.getPropertyValue(`--safe-area-inset-top`);
    const safeRight = root.style.getPropertyValue(`--safe-area-inset-right`);
    const safeBottom = root.style.getPropertyValue(`--safe-area-inset-bottom`);
    const safeLeft = root.style.getPropertyValue(`--safe-area-inset-left`);

    const safePaddings = {
      Desktop: {
        top: '--safe-area-inset-top',
        right: '--safe-area-inset-right',
        bottom: '--safe-area-inset-bottom',
        left: '--safe-area-inset-left'
      },
      Mobile: {
        top: '--safe-area-inset-top',
        right: '--safe-area-inset-right',
        bottom: '--safe-area-inset-bottom',
        left: '--safe-area-inset-left'
      }
    }

    const device = size;
  
    root.style.setProperty('--safe-padding-top', safePaddings[device].top);
    root.style.setProperty('--safe-padding-right', safePaddings[device].right);
    root.style.setProperty('--safe-padding-bottom', safePaddings[device].bottom);
    root.style.setProperty('--safe-padding-left', safePaddings[device].left);
  }, [size]);

  return (
    <SafeAreaContext.Provider value={{}}>
      {children}
    </SafeAreaContext.Provider>
  );
};
