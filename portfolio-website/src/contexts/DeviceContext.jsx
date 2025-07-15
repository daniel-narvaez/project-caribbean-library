import { createContext, useState, useEffect } from "react";

export const DeviceContext = createContext();

const desktop = 'desktop';
const tablet = 'tablet';
const mobile = 'mobile';

const spacings = {
  desktop: {
    width: '400px',
    height: '600px',
    padding: '8px',
    gap: '8px'
  },
  mobile: {
    width: '300px',
    height: '450px',
    padding: '6px',
    gap: '6px'
  }
}

export const DeviceProvider = ({children}) => {
  const [size, setSize] = useState('desktop');
  const [layout, setLayout] = useState('desktopCard');

  useEffect(() => {
    const getDeviceConfig = (width, height) => {
      if(width < 768 || height < 480)
        return {
          size: mobile,
          layout: height > width ? 'mobileCard' : 'mobileBanner',
          spacing: spacings.mobile
        };
      else {
        if(width >= 1440) {
          return {
            size: desktop,
            layout: 'desktopCard',
            spacing: spacings.desktop
          };
        } else {
          return {
            size: mobile,
            layout: height > width ? 'mobileBanner' : 'mobileCard',
            spacing: spacings.mobile
          };
        }
      }
    };

    const updateLayout = () => {
      const { innerWidth: width, innerHeight: height } = window;
      const config = getDeviceConfig(width, height);
      
      const root = document.documentElement;
      root.style.setProperty('--card-width', config.spacing.width);
      root.style.setProperty('--card-height', config.spacing.height);
      root.style.setProperty('--padding-size', config.spacing.padding);
      root.style.setProperty('--gap-size', config.spacing.gap);

      setSize(config.size);
      setLayout(config.layout);
    };

    // Debounced version
    let timeoutId;
    const debouncedUpdateLayout = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(updateLayout, 100);
    };

    window.addEventListener('resize', debouncedUpdateLayout);
    updateLayout(); // Initial check without debounce
    
    return () => {
      window.removeEventListener('resize', debouncedUpdateLayout);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [size, layout, spacings]);

  return (
    <DeviceContext.Provider value={{ size: size, layout }}>
      {children}
    </DeviceContext.Provider>
  );
};