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
      link1: {
        normal: swatches.cobalt,
        hover: swatches.aquamarine,
        active: swatches.deepReef
      },
      link2: {
        normal: swatches.amethyst,
        hover: swatches.orchid,
        active: swatches.pinotNoir
      },
      background1: swatches.sand,
      background2: swatches.desertStone,
      frame1: swatches.duneCrest,
      error1: swatches.magaflower,
      ui: {
        text1: swatches.seaweed,
        link1: {
          normal: swatches.sand,
          hover: swatches.duneCrest,
          active: swatches.desertStone
        },
        link2: {
          normal: swatches.cobalt,
          hover: swatches.aquamarine,
          active: swatches.deepReef
        },
        background1: {
          normal: swatches.cobalt,
          hover: swatches.aquamarine,
          active: swatches.deepReef
        },
        background2: {
          normal: swatches.sand,
          hover: swatches.duneCrest,
          active: swatches.desertStone
        },
        background3: {
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
    rootCss.setProperty('--col-link1', colors[theme].link1.normal);
    rootCss.setProperty('--col-link1-hover', colors[theme].link1.hover);
    rootCss.setProperty('--col-link1-active', colors[theme].link1.active);
    rootCss.setProperty('--col-link2', colors[theme].link2.normal);
    rootCss.setProperty('--col-link2-hover', colors[theme].link2.hover);
    rootCss.setProperty('--col-link2-active', colors[theme].link2.active);
    rootCss.setProperty('--col-background1', colors[theme].background1);
    rootCss.setProperty('--col-background2', colors[theme].background2);
    rootCss.setProperty('--col-frame1', colors[theme].frame1);
    rootCss.setProperty('--col-error1', colors[theme].error1);

    rootCss.setProperty('--col-ui-text1', colors[theme].ui.text1);
    rootCss.setProperty('--col-ui-link1', colors[theme].ui.link1.normal);
    rootCss.setProperty('--col-ui-link1-hover', colors[theme].ui.link1.hover);
    rootCss.setProperty('--col-ui-link1-active', colors[theme].ui.link1.active);
    rootCss.setProperty('--col-ui-link2', colors[theme].ui.link2.normal);
    rootCss.setProperty('--col-ui-link2-hover', colors[theme].ui.link2.hover);
    rootCss.setProperty('--col-ui-link2-active', colors[theme].ui.link2.active);
    rootCss.setProperty('--col-ui-background1', colors[theme].ui.background1.normal);
    rootCss.setProperty('--col-ui-background1-hover', colors[theme].ui.background1.hover);
    rootCss.setProperty('--col-ui-background1-active', colors[theme].ui.background1.active);
    rootCss.setProperty('--col-ui-background2', colors[theme].ui.background2.normal);
    rootCss.setProperty('--col-ui-background2-hover', colors[theme].ui.background2.hover);
    rootCss.setProperty('--col-ui-background2-active', colors[theme].ui.background2.active);
    rootCss.setProperty('--col-ui-background3', colors[theme].ui.background3.normal);
    rootCss.setProperty('--col-ui-background3-hover', colors[theme].ui.background3.hover);
    rootCss.setProperty('--col-ui-background3-active', colors[theme].ui.background3.active);

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