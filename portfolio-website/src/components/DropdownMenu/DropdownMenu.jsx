import React from 'react';
import { useState, useContext, useRef, useEffect } from 'react';
import { ScreenSizeContext } from '../../contexts/ScreenSize';

const DropdownItem = ({item, level = 0, onClose}) => {
  const { size } = useContext(ScreenSizeContext);
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  useEffect(() => {
    const handleNavigation = () => setIsOpen(false);
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const handleAction = () => {
    if (!hasSubmenu && item.action) {
      item.action();
      onClose(); // Close menu after action
    }
  };

  const handleMouseEnter = () => (hasSubmenu && size === 'desktop') && setIsOpen(true);

  const handleMouseLeave = () => (hasSubmenu && size === 'desktop') && setIsOpen(false);

  const handleTouchEnd = (e) => {
    if (hasSubmenu && size === 'mobile') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (!hasSubmenu && item.url) {
      onClose(); // Close menu when clicking a link
    }
  };


  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.url ? 
        (<a
          href={item.url}
          onTouchEnd={handleTouchEnd}
        >
          {item.icon}
          {item.title}
        </a>) : 
        (<button
          type="button"
          onClick={handleAction}
          onTouchEnd={handleTouchEnd}
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
            return <DropdownItem
              key={`${subItem.title}-${index}`}
              item={subItem}
              level={level + 1}
              onClose={onClose}
            />
          })}
        </ul>
      )}
    </li>
  );
}

export const MainDropdown = ({ buttonLabel, items = [] }) => {
  const { size }= useContext(ScreenSizeContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleNavigation = () => setIsOpen(false);
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (size === 'mobile' && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, size]);

  const handleMouseEnter = () => size === 'desktop' && setIsOpen(true);

  const handleMouseLeave = () => size === 'desktop' && setIsOpen(false);

  const handleTouchEnd = (e) => {
    if (size === 'mobile') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => setIsOpen(false);

  return (
    <nav
    ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onTouchEnd={handleTouchEnd}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <ul>
          {items.map((item, index) => (
            <DropdownItem
              key={(`${item.title}-${index}`)}
              item={item}
              onClose={handleClose}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}