import { createContext, useState, useEffect } from "react";

export const ScreenSizeContext = createContext();

export const ScreenSizeProvider = ({children}) => {
  const [size, setSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSize('mobile');
        console.log(size);
      } else {
        setSize('desktop');
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