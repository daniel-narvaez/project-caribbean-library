import { createContext, useContext, useEffect } from 'react';
import { AppearanceContext } from './Appearance';

const ColorsContext = createContext();


export const ColorsProvider = ({children}) => {
  // Consume screen size context to determine which typography scale to use
  const { theme } = useContext(AppearanceContext); 
  
  // Store the root style in a variable
  const rootCss = document.documentElement.style;
  
  const swatches = {
    amethyst: rootCss.getPropertyValue('--swt-amethyst'),
    aquamarine: rootCss.getPropertyValue('--swt-aquamarine'),
    celeste: rootCss.getPropertyValue('--swt-celeste'),
    cobalt: rootCss.getPropertyValue('--swt-cobalt'),
    deepReef: rootCss.getPropertyValue('--swt-deepReef'),
    desertStone: rootCss.getPropertyValue('--swt-desertStone'),
    duneCrest: rootCss.getPropertyValue('--swt-duneCrest'),
    lilac: rootCss.getPropertyValue('--swt-lilac'),
    magaflower: rootCss.getPropertyValue('--swt-magaflower'),
    mahogany: rootCss.getPropertyValue('--swt-mahogany'),
    matcha: rootCss.getPropertyValue('--swt-matcha'),
    midnight: rootCss.getPropertyValue('--swt-midnight'),
    orchid: rootCss.getPropertyValue('--swt-orchid'),
    pinotNoir: rootCss.getPropertyValue('--swt-pinotNoir'),
    sand: rootCss.getPropertyValue('--swt-sand'),
    seaweed: rootCss.getPropertyValue('--swt-seaweed'),
  }
  
  // Define colors for each theme
  const colors = {
    light: {
      text1: swatches.midnight,
      nav1: {
        normal: swatches.cobalt,
        hover: swatches.aquamarine,
        active: swatches.deepReef
      },
      nav2: {
        normal: swatches.amethyst,
        hover: swatches.orchid,
        active: swatches.pinotNoir
      },
      bg1: swatches.sand,
      bg2: swatches.desertStone,
      frame1: swatches.duneCrest,
      error1: swatches.magaflower,
      ui: {
        text1: swatches.seaweed,
        nav1: {
          normal: swatches.sand,
          hover: swatches.duneCrest,
          active: swatches.desertStone
        },
        nav2: {
          normal: swatches.cobalt,
          hover: swatches.aquamarine,
          active: swatches.deepReef
        },
        bg1: {
          normal: swatches.cobalt,
          hover: swatches.aquamarine,
          active: swatches.deepReef
        },
        bg2: {
          normal: swatches.sand,
          hover: swatches.duneCrest,
          active: swatches.desertStone
        },
        bg3: {
          normal: swatches.amethyst,
          hover: swatches.orchid,
          active: swatches.pinotNoir
        },
      },
      pointer: {
        stroke: swatches.midnight,
        fill: {
          normal: swatches.sand,
          hover1: swatches.celeste,
          hover2: swatches.lilac
        }
      },
    },
  }

  useEffect(() => {
    // Set CSS custom properties for the palette colors
    rootCss.setProperty('--col-text1', colors[theme].text1);
    rootCss.setProperty('--col-nav1', colors[theme].nav1.normal);
    rootCss.setProperty('--col-nav1-hover', colors[theme].nav1.hover);
    rootCss.setProperty('--col-nav1-active', colors[theme].nav1.active);
    rootCss.setProperty('--col-nav2', colors[theme].nav2.normal);
    rootCss.setProperty('--col-nav2-hover', colors[theme].nav2.hover);
    rootCss.setProperty('--col-nav2-active', colors[theme].nav2.active);
    rootCss.setProperty('--col-bg1', colors[theme].bg1);
    rootCss.setProperty('--col-bg2', colors[theme].bg2);
    rootCss.setProperty('--col-frame1', colors[theme].frame1);
    rootCss.setProperty('--col-error1', colors[theme].error1);

    rootCss.setProperty('--col-ui-text1', colors[theme].ui.text1);
    rootCss.setProperty('--col-ui-nav1', colors[theme].ui.nav1.normal);
    rootCss.setProperty('--col-ui-nav1-hover', colors[theme].ui.nav1.hover);
    rootCss.setProperty('--col-ui-nav1-active', colors[theme].ui.nav1.active);
    rootCss.setProperty('--col-ui-nav2', colors[theme].ui.nav2.normal);
    rootCss.setProperty('--col-ui-nav2-hover', colors[theme].ui.nav2.hover);
    rootCss.setProperty('--col-ui-nav2-active', colors[theme].ui.nav2.active);
    rootCss.setProperty('--col-ui-bg1', colors[theme].ui.bg1.normal);
    rootCss.setProperty('--col-ui-bg1-hover', colors[theme].ui.bg1.hover);
    rootCss.setProperty('--col-ui-bg1-active', colors[theme].ui.bg1.active);
    rootCss.setProperty('--col-ui-bg2', colors[theme].ui.bg2.normal);
    rootCss.setProperty('--col-ui-bg2-hover', colors[theme].ui.bg2.hover);
    rootCss.setProperty('--col-ui-bg2-active', colors[theme].ui.bg2.active);
    rootCss.setProperty('--col-ui-bg3', colors[theme].ui.bg3.normal);
    rootCss.setProperty('--col-ui-bg3-hover', colors[theme].ui.bg3.hover);
    rootCss.setProperty('--col-ui-bg3-active', colors[theme].ui.bg3.active);

    rootCss.setProperty('--col-pointer-stroke', colors[theme].pointer.stroke);
    rootCss.setProperty('--col-pointer-fill', colors[theme].pointer.fill.normal);
    rootCss.setProperty('--col-pointer-fill-hover1', colors[theme].pointer.fill.hover1);
    rootCss.setProperty('--col-pointer-fill-hover2', colors[theme].pointer.fill.hover2);
  }, [theme]); // Re-run when the website theme changes

  return (
    <ColorsContext.Provider>
      {children}
    </ColorsContext.Provider>
  );
}