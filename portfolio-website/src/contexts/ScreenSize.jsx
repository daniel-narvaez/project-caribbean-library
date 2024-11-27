import { createContext, useState, useEffect } from "react";

export const ScreenSizeContext = createContext();

export const ScreenSizeProvider = ({children}) => {
  const [size, setSize] = useState('Desktop');
  const [layout, setLayout] = useState('desktop-card');

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