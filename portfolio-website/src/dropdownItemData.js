
export const createDropdownItem = ({
  title, 
  url = '',
  icon = null,
  action = () => {},
  submenu = [] // Array of nested dropdown items
}) => ({
  title,
  url,
  icon,
  action,
  submenu
});

// const dropdownItemExample = {
//   title: '',
//   url: '',
//   icon: null,
//   action: () => {},
//   submenu: []
// };

const gamesItem = createDropdownItem({
  title: 'Games',
  url: '',
  submenu: [
    createDropdownItem({
      title: 'Chihuahua Champ',
      url: '',
    }),
    createDropdownItem({
      title: 'Star Sweepers',
      url: '',
    }),
    createDropdownItem({
      title: 'Project: Boricuas',
      url: '',
      submenu: [
        createDropdownItem({
          title: 'Part 1',
          url: '',
        }),
        createDropdownItem({
          title: 'Part 2',
          url: '',
        })
      ]
    }),
    createDropdownItem({
      title: 'Clock Out!!',
      url: '',
    })
  ]
});

const aboutItem = createDropdownItem({
  title: 'About',
  url: '',
});

const contactItem = createDropdownItem({
  title: 'Contact',
  url: '',
});

export const mainMenuData = [gamesItem, aboutItem, contactItem];