import { React, useState } from 'react';

const DropdownItem = ({item, level = 0}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleIsOpen = () => {
    // if (hasSubmenu)
    //   setIsOpen(!isOpen);
    // else if (item.action)
    //   item.action();

    // Shortest-hand
    {hasSubmenu ? setIsOpen(!isOpen) : item.action && item.action() };
  };

  return (
    <li>
      {item.url ? 
        (<a
          href={item.url}
        >
          {item.icon}
          {item.title}
        </a>) : 
        (<button
          type="button"
          onClick={handleIsOpen}
        >
          {/* {hasSubmenu && ('LEFT Chevron')} */}
          <div>
            {item.icon}
            <span>{item.title}</span>
          </div>
        </button>
      )}

      {(hasSubmenu && isOpen) && (
        <ul>
          {item.submenu.map((subItem, index) => {
            <DropdownItem
              key={`${subItem.title}-${index}`}
              item={subItem}
              level={level + 1}
            />
          })}
        </ul>
      )}
    </li>
  )
}