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
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      
      // First determine device size
      if (isMobile) {
        setSize('Mobile');
        // Mobile: Single article view
        if (height > width) {
          setLayout('mobileCard'); // Portrait: cards in column
        } else {
          setLayout('mobileBanner');      // Landscape: banners
        }
      } else {
        // Tablet and Desktop: Triple article view
        if (width >= 1440) {
          setSize('Desktop');
          setLayout('desktopCard');  // Large screens: desktop cards
        } else {
          setSize('Mobile');
          if (height > width) {
            setLayout('mobileBanner');      // Tablet portrait: banners
          } else {
            setLayout('mobileCard'); // Tablet landscape: mobile cards
          }
        }
      }
    };

    const root = document.documentElement;
    root.style.setProperty('--card-width', spacings[size].width);
    root.style.setProperty('--card-height', spacings[size].height);
    root.style.setProperty('--padding-size', spacings[size].padding);
    root.style.setProperty('--gap-size', spacings[size].gap);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ size, layout }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};