/**
 * Desktop Dropdown Menu Components
 * 
 * A hover-based dropdown menu designed for desktop interfaces.
 * Features include:
 * - Hover-triggered submenus
 * - Smooth height transitions
 * - Nested menu support
 * - Horizontal top-level navigation
 * - Directional indicators for submenus
 * 
 * @file DropdownDesktop.jsx
 */

import React from 'react';
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  memo
} from 'react';

// Component Imports
import { Chevron } from '../Chevron/Chevron';

// Data and Utilities
import { mainMenuData } from '../../data/dropdownItems';
import { zeroToAutoHeight } from '../../utils';
import { getLinkAttributes } from '../../utils/externalUrls';

// Styles
import styles from './DropdownDesktop.module.css';

/**
 * Individual menu item component handling both regular items and submenus
 * Controls hover-based interactions and submenu animations
 */
const DropdownItem = memo(({ item, level = 0, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const submenuRef = useRef(null);

  // Hover handlers for submenu interactions
  const handleMouseEnter = useCallback(() => {
    if (hasSubmenu || level === 0) {
      if (submenuRef.current) {
        zeroToAutoHeight(submenuRef.current, true);
      }
      setIsOpen(true);
    }
  }, [hasSubmenu, level]);

  const handleMouseLeave = useCallback(() => {
    if (hasSubmenu || level === 0) {
      if (submenuRef.current) {
        zeroToAutoHeight(submenuRef.current, false);
      }
      setIsOpen(false);
    }
  }, [hasSubmenu, level]);

  // Click handler for action items
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (!hasSubmenu && item.action) {
      item.action();
      onClose();
    }
  }, [hasSubmenu, item.action, onClose]);

  // Memoized button/link content creation
  const buttonContent = useMemo(() => (isActive = false) => {
    return item.url ? (
      <a
        href={item.url}
        {...getLinkAttributes(item.url)}
        className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
      >
        {(hasSubmenu && level !== 0) && <Chevron direction={isActive ? 'right' : 'left'} />}
        {item.icon}
        <span>{item.title}</span>
      </a>
    ) : (
      <button
        type="button"
        onClick={handleClick}
        className={`${styles.menuButton} ${isActive ? styles.menuButtonActive : ''}`}
      >
        <div>
          {hasSubmenu && <Chevron direction={isActive ? 'right' : 'left'} />}
          {item.icon}
          <span>{item.title}</span>
        </div>
      </button>
    );
  }, [item.url, item.icon, item.title, handleClick, hasSubmenu]);

  // Generate nested menu items
  const submenuItems = useMemo(() =>
    item.submenu?.map((subItem, subIndex) => (
      <DropdownItem
        key={`${subItem.title}-${subIndex}`}
        item={subItem}
        level={level + 1}
        onClose={onClose}
      />
    ))
  , [item.submenu, level, onClose]);

  return (
    <li
      className={`
        ${styles.menuItem}
        ${styles['menuLevel'+level]}
        ${hasSubmenu ? styles.hasSubmenu : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.phantom}>
        {buttonContent()}
      </div>
      <div className={styles.wrapper}>
        {buttonContent(isOpen)}
        {hasSubmenu && (
          <ul
            ref={submenuRef}
            className={`
              ${styles.submenuContainer}
              ${styles['level'+(level+1)]}
              ${isOpen ? styles.submenuVisible : ''}
            `}
          >
            {submenuItems}
          </ul>
        )}
      </div>
    </li>
  );
});

/**
 * Main container component for the desktop dropdown menu
 * Handles top-level menu visibility and structure
 */
const MainDropdown = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Special close handling to maintain menu state
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 0);
  }, []);

  return (
    <nav className={styles.mainNav}>
      {isOpen && (
        <ul className={styles.menuLevel0}>
          {items.map((item, index) => (
            <DropdownItem
              key={`${item.title}-${index}`}
              item={item}
              level={0}
              onClose={handleClose}
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
export const DesktopDropdown = () => {
  // console.time('Desktop Dropdown Render');
  const result = <MainDropdown items={mainMenuData}/>;
  // console.timeEnd('Desktop Dropdown Render');
  return result;
};