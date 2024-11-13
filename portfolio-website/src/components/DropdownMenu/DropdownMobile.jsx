/**
 * Mobile Dropdown Menu Components
 * 
 * A responsive accordion-style dropdown menu specifically designed for mobile interfaces.
 * Features include:
 * - Hamburger menu toggle (Burgershelf)
 * - Accordion-style submenu expansion
 * - Right-aligned menu items
 * - Click-outside detection
 * - Path tracking for nested menu state
 * 
 * @file DropdownMobile.jsx
 */

import React from 'react';
import { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo, 
  memo 
} from 'react';

// Component Imports
import { Burgershelf } from '../Burgershelf/Burgershelf';
import { Chevron } from '../Chevron/Chevron';

// Data and Utilities
import { mainMenuData } from '../../data/dropdownItems';
import { zeroToAutoHeight } from '../../utils';

// Styles
import styles from './DropdownMobile.module.css';

/**
 * Individual menu item component that handles both regular items and submenus
 * Manages accordion behavior and submenu rendering
 */
const DropdownItem = memo(({
  item,
  level = 0,
  itemPath = [],
  activePath = [],
  onMenuToggle,
  onClose
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const submenuRef = useRef(null);
  
  // Determine item's state within the accordion
  const isInActivePath = JSON.stringify(itemPath) === JSON.stringify(activePath.slice(0, itemPath.length));
  const isSiblingActive = activePath.length > itemPath.length - 1
    && JSON.stringify(activePath.slice(0, itemPath.length - 1)) === JSON.stringify(itemPath.slice(0, -1))
    && activePath[itemPath.length - 1] !== itemPath[itemPath.length - 1];

  // Handle clicks on menu items
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (hasSubmenu) {
      onMenuToggle(itemPath);
    } else if (item.action) {
      item.action();
      onClose();
    }
  }, [hasSubmenu, itemPath, item.action, onMenuToggle, onClose]);

  // Generate nested menu items recursively
  const submenuItems = useMemo(() =>
    item.submenu?.map((subItem, subIndex) => (
      <DropdownItem
        key={`${subItem.title}-${subIndex}`}
        item={subItem}
        level={level + 1}
        itemPath={[...itemPath, subIndex]}
        activePath={activePath}
        onMenuToggle={onMenuToggle}
        onClose={onClose}
      />
    ))
  , [item.submenu, level, itemPath, activePath, onMenuToggle, onClose]);

  // Unified content for both button and link variants
  const buttonContent = (
    <>
      {hasSubmenu && <Chevron 
        direction={isInActivePath ? 'up' : 'down'} 
      />}
      {item.icon}
      <span>{item.title}</span>
    </>
  );

  return (
    <li className={`
      ${styles.menuItem}
      ${styles['menuLevel'+level]}
      ${isSiblingActive ? styles.menuItemHidden : ''}
    `}>
      <div className={styles.wrapper}>
        {item.url ? (
          <a
            href={item.url}
            onClick={handleClick}
            className={`${styles.menuLink} ${isInActivePath ? styles.menuLinkActive : ''}`}
          >
            {buttonContent}
          </a>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className={`${styles.menuButton} ${isInActivePath ? styles.menuButtonActive : ''}`}
          >
            <div>
              {buttonContent}
            </div>
          </button>
        )}

        {hasSubmenu && (
          <ul 
            ref={submenuRef}
            className={`
              ${styles.submenuContainer}
              ${styles['level'+(level+1)]}
              ${isInActivePath ? styles.submenuVisible : ''}
          `}>
            {submenuItems}
          </ul>
        )}
      </div>
    </li>
  );
});

/**
 * Main container component for the mobile dropdown menu
 * Manages overall menu state and handles click-outside behavior
 */
const MainDropdown = ({ items = [] }) => {
  // State for menu visibility and active submenu path
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState([]);
  const menuRef = useRef(null);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setActivePath([]);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Toggle submenu states in accordion
  const handleMenuToggle = useCallback((itemPath) => {
    setActivePath(prevPath => {
      if (JSON.stringify(prevPath) === JSON.stringify(itemPath)) {
        return itemPath.slice(0, -1); // Collapse if same path
      }
      return itemPath; // Expand new path
    });
  }, []);

  // Handle burger menu clicks
  const handleBurgerClick = useCallback(() => {
    setIsOpen(prev => {
      if (prev) setActivePath([]); // Reset accordion when closing
      return !prev;
    });
  }, []);

  return (
    <nav ref={menuRef} className={`${styles.mainNav} ${isOpen ? styles.menuOpen : ''}`}>
      <button
        type="button"
        onClick={handleBurgerClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Burgershelf isOpen={isOpen}/>
      </button>

      {isOpen && (
        <ul className={styles.menuLevel0}>
          {items.map((item, index) => (
            <DropdownItem
              key={`${item.title}-${index}`}
              item={item}
              itemPath={[index]}
              activePath={activePath}
              onMenuToggle={handleMenuToggle}
              onClose={() => setIsOpen(false)}
            />
          ))}
        </ul>
      )}
    </nav>
  );
};

/**
 * Export wrapper with performance monitoring
 */
export const MobileDropdown = () => {
  console.time('Mobile Dropdown Menu Render');
  const result = <MainDropdown items={mainMenuData}/>;
  console.timeEnd('Mobile Dropdown Menu Render');
  return result;
};