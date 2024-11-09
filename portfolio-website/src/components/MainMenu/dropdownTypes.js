
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