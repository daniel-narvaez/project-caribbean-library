import React, { createContext, useContext, useEffect } from 'react';
import { ScreenSizeContext } from './ScreenSize';

const SafeAreaContext = createContext();

const DEFAULT_PADDING = {
  DESKTOP: {
    TOP: '5rem',
    RIGHT: '2rem',
    BOTTOM: '5rem',
    LEFT: '2rem'
  },
  MOBILE: {
    TOP: '4rem',
    RIGHT: '1.5rem',
    BOTTOM: '4rem',
    LEFT: '1.5rem'
  }
}

export const SafeAreaProvider = ({ children }) => {
  const { size } = useContext(ScreenSizeContext);
  
  useEffect(() => {
    const root = document.documentElement;

    const getSafeAreaValue = (side) => {
      // Get the computed style value for the safe area
      const value = root.style.getPropertyValue(`env(safe-area-inset-${side})`).trim();
      
      // Parse it as a number, default to 0 if not available
      return parseInt(value) || 0;
    };

    const topInset = getSafeAreaValue('top');
    const rightInset = getSafeAreaValue('right');
    const bottomInset = getSafeAreaValue('bottom');
    const leftInset = getSafeAreaValue('left');

    const safePaddings = {
      Desktop: {
        top: topInset === 0 ? DEFAULT_PADDING.DESKTOP.TOP : topInset,
        right: rightInset === 0 ? DEFAULT_PADDING.DESKTOP.RIGHT : rightInset,
        bottom: bottomInset === 0 ? DEFAULT_PADDING.DESKTOP.BOTTOM : bottomInset,
        left: leftInset === 0 ? DEFAULT_PADDING.DESKTOP.LEFT : leftInset
      },
      Mobile: {
        top: topInset === 0 ? DEFAULT_PADDING.MOBILE.TOP : topInset,
        right: rightInset === 0 ? DEFAULT_PADDING.MOBILE.RIGHT : rightInset,
        bottom: bottomInset === 0 ? DEFAULT_PADDING.MOBILE.BOTTOM : bottomInset,
        left: leftInset === 0 ? DEFAULT_PADDING.MOBILE.LEFT : leftInset
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