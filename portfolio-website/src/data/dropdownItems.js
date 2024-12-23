/**********************************
* DROPDOWN MENU DATA STRUCTURE
**********************************/
import { clockOutProject, gameProjectsData, theHexPerplexProject } from "./gameProjects";
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
  url = '',
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
      title: 'Chihuahua Champ',
      url: '/',
    }),
    createDropdownItem({
      title: 'Star Sweepers',
      url: '/',
    }),
    createDropdownItem({
      title: 'Project: Boricuas',
      url: '/',
      submenu: [
        createDropdownItem({
          title: 'Part 1',
          url: '/',
        }),
        createDropdownItem({
          title: 'Part 2',
          url: '/',
        })
      ]
    }),
    createDropdownItem({
      title: clockOutProject.title,
      url: ' ',
      submenu: [
        createDropdownItem({
          title: 'Read More',
          url: clockOutProject.portfolioUrl,
        }),
        createDropdownItem({
          title: 'Play',
          url: clockOutProject.gameUrl,
        })
      ]
    }),
    createDropdownItem({
      title: theHexPerplexProject.title,
      url: ' ',
      submenu: [
        createDropdownItem({
          title: 'Read More',
          url: theHexPerplexProject.portfolioUrl,
        }),
        createDropdownItem({
          title: 'Play',
          url: theHexPerplexProject.gameUrl,
        })
      ]
    }),
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
  url: '/',
});

/* Array of menu items */
export const mainMenuData = [gamesItem, aboutItem, contactItem];

