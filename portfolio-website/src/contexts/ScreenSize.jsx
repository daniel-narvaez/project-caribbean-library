import { createContext, useState, useEffect } from "react";

export const ScreenSizeContext = createContext();

export const ScreenSizeProvider = ({children}) => {
  const [size, setSize] = useState('Desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSize('Mobile');
        console.log(size);
      } else {
        setSize('Desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ size, setSize }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};