import { createContext, useState, useEffect } from "react";

export const ScreenSizeContext = createContext();

const spacings = {
  Desktop: {
    width: '25rem',       // 400px
    height: '37.5rem',    // 600px
    padding: '0.5rem',    // 8px
    gap: '0.5rem'         // 8px
  },
  Mobile: {
    width: '18.75rem',    // 300px
    height: '28.125rem',  // 450px
    padding: '0.375rem',  // 6px
    gap: '0.375rem'       // 6px
  }
}

export const ScreenSizeProvider = ({children}) => {
  const [size, setSize] = useState('Desktop');
  const [layout, setLayout] = useState('desktopCard');

  useEffect(() => {
    const getDeviceConfig = (width, height) => {
      if(width < 768)
        return {
          size: 'Mobile',
          layout: height > width ? 'mobileCard' : 'mobileBanner',
          spacing: spacings.Mobile
        };
      else
        return {
          size: 'Desktop',
          layout: width > 1440 ? 'desktopCard' : height > width ? 'mobileBanner' : 'mobileCard',
          spacing: width > 1440 ? spacings.Desktop : spacings.Mobile
        };
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
      timeoutId = window.setTimeout(updateLayout, 150);
    };

    window.addEventListener('resize', debouncedUpdateLayout);
    updateLayout(); // Initial check without debounce
    
    return () => {
      window.removeEventListener('resize', debouncedUpdateLayout);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ size, layout }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};