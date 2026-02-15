import { createContext, useState, useEffect } from 'react';

export const AppearanceContext = createContext();

const themes = {
  light: 'light',
  dark: 'dark'
}

export const AppearanceProvider = ({children}) => {
  const [theme, setTheme] = useState(themes.light)

  // Write the function that will change the appearance of the website.

  return (
    <AppearanceContext.Provider value={{ theme }}>
      {children}
    </AppearanceContext.Provider>
  )
}