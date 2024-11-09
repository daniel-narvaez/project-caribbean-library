import { createContext, useState } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menuOpened, setMenuOpened] = useState(false);

    return ( 
        <MenuContext.Provider value={{ menuOpened, setMenuOpened }}>
            {children}
        </MenuContext.Provider>
    );
};