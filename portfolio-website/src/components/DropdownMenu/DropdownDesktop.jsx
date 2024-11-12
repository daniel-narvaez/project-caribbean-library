import React from 'react';
import { 
  useState, 
  useContext, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo, 
  memo 
} from 'react';

import { Burgershelf } from '../Burgershelf/Burgershelf';
import { mainMenuData } from '../../data/dropdownItems';

import { ScreenSizeContext } from '../../contexts/ScreenSize';

import styles from './DropdownDesktop.module.css';

import { zeroToAutoHeight } from '../../utils';

const DropdownItem = memo(({ item, level = 0, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const submenuRef = useRef(null);

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

  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (!hasSubmenu && item.action) {
      item.action();
      onClose();
    }
  }, [hasSubmenu, item.action, onClose]);

  const menuControl = useMemo(() => (isActive = false) => {
    return item.url ? (
      <a
        href={item.url}
        onClick={handleClick}
        className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
      >
        {item.icon}
        {item.title}
      </a>
    ) : (
      <button
        type="button"
        onClick={handleClick}
        className={`${styles.menuButton} ${isActive ? styles.menuButtonActive : ''}`}
      >
        <div>
          {item.icon}
          <span>{item.title}</span>
        </div>
      </button>
    );
  }, [item.url, item.icon, item.title, handleClick]);

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
        {menuControl()}
      </div>
      <div className={styles.wrapper}>
        {menuControl(isOpen)}
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

const MainDropdown = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  
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

export const MainMenu = () => {
  console.time('MainMenu Render');    // Performance monitoring
  const result = <MainDropdown items={mainMenuData}/>;
  console.timeEnd('MainMenu Render'); // Performance monitoring
  return result;
  };