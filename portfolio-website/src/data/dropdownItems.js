/**********************************
* DROPDOWN MENU DATA STRUCTURE
**********************************/
import { gameProjectsData } from "./gameProjects";
import { appIcons, socialMediaData } from "./appIcons";

/**
* Factory function to create consistent dropdown menu items
* Ensures all items follow the same data structure
* 
* @param {Object} params - Item configuration
* @param {string} params.title - Display text for the menu item
* @param {string} [params.url=''] - Navigation URL (optional)
* @param {ReactNode} [params.icon=null] - Icon element (optional)
* @param {Function} [params.action=()=>{}] - Click handler (optional)
* @param {Array} [params.submenu=[]] - Nested menu items (optional)
* @returns {Object} Formatted menu item
*/
export const createDropdownItem = ({
  title,
  url = '/',
  icon = null,
  action = () => {},
  submenu = []
 }) => ({
  title,
  url,
  icon,
  action,
  submenu
 });
 
 /**
 * Main menu data structure
 * Array of top-level menu items
 * Each item can contain nested submenus to any depth
 * Items are created using createDropdownItem for consistency
 * 
 * Structure Example:
 * [
 *   {
 *     title: 'Item',
 *     submenu: [
 *       {
 *         title: 'Subitem',
 *         submenu: [...] // Can nest indefinitely
 *       }
 *     ]
 *   }
 * ]
 */

/**********************************
* DROPDOWN ITEMS
**********************************/

/* Games */
const gamesItem = createDropdownItem({
  title: 'Games',
  url: '/',
  submenu: [
    createDropdownItem({
      title: gameProjectsData.chihuahuaChamp.title,
      submenu: [
        createDropdownItem({
          title: 'Read More',
          url: gameProjectsData.chihuahuaChamp.portfolioUrl,
        }),
        createDropdownItem({
          title: 'Play',
          url: gameProjectsData.chihuahuaChamp.gameUrl,
        })
      ]
    }),
    // createDropdownItem({
    //   title: 'Star Sweepers',
    //   url: '/',
    // }),
    // createDropdownItem({
    //   title: 'Project: Boricuas',
    //   submenu: [
    //     createDropdownItem({
    //       title: 'Part 1',
    //       url: '/',
    //     }),
    //     createDropdownItem({
    //       title: 'Part 2',
    //       url: '/',
    //     })
    //   ]
    // }),
    createDropdownItem({
      title: gameProjectsData.clockOut.title,
      submenu: [
        createDropdownItem({
          title: 'Read More',
          url: gameProjectsData.clockOut.urls.portfolio,
        }),
        createDropdownItem({
          title: 'Play',
          url: gameProjectsData.clockOut.urls.game,
        })
      ]
    }),
    createDropdownItem({
      title: gameProjectsData.theHexPerplex.title,
      submenu: [
        createDropdownItem({
          title: 'Read More',
          url: gameProjectsData.theHexPerplex.portfolioUrl,
        }),
        createDropdownItem({
          title: 'Play',
          url: gameProjectsData.theHexPerplex.gameUrl,
        })
      ]
    }),
    createDropdownItem({
      title: 'All Games',
      url: '/',
    })
  ]
});

/* About */
const aboutItem = createDropdownItem({
  title: 'About',
  url: '/',
});

/* Contact */
const contactItem = createDropdownItem({
  title: 'Contact',
  submenu: [
    createDropdownItem({
      title: 'Email',
      url: "/contact"
    }),
    createDropdownItem({
      title: socialMediaData.linkedInIcon.appName,
      url: socialMediaData.linkedInIcon.profileUrl,
    }),
    createDropdownItem({
      title: 'Social Media',
      submenu: [
        createDropdownItem({
          title: socialMediaData.blueskyIcon.appName,
          url: socialMediaData.blueskyIcon.profileUrl
        }),
        createDropdownItem({
          title: socialMediaData.theXPlaceIcon.appName,
          url: socialMediaData.theXPlaceIcon.profileUrl
        }),
        createDropdownItem({
          title: socialMediaData.youngArtsPostIcon.appName,
          url: socialMediaData.youngArtsPostIcon.profileUrl
        }),
        createDropdownItem({
          title: socialMediaData.discordIcon.appName,
          url: socialMediaData.discordIcon.profileUrl
        })
      ]
    }),
    createDropdownItem({
      title: 'Creator Profiles',
      submenu: [
        createDropdownItem({
          title: socialMediaData.gitHubIcon.appName,
          url: socialMediaData.gitHubIcon.profileUrl
        }),
        createDropdownItem({
          title: socialMediaData.itchIcon.appName,
          url: socialMediaData.itchIcon.profileUrl
        }),
        createDropdownItem({
          title: socialMediaData.machinationsIcon.appName,
          url: socialMediaData.machinationsIcon.profileUrl
        })
      ]
    })
  ]
});

const resumeItem = createDropdownItem({
  title: 'Résumé',
  submenu: [
    createDropdownItem({
      title: 'Read',
      url: '/resume'
    }),
    createDropdownItem({
      title: 'Download',
      url: '/'
    })
  ]
})

/* Array of menu items */
export const mainMenuData = [gamesItem, resumeItem, contactItem, aboutItem];

