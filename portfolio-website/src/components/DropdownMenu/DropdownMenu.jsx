/**
 * DropdownMenu.jsx
 * A responsive, multi-level dropdown menu component that handles both desktop and mobile interactions.
 * 
 * Key Features:
 * - Desktop: Horizontal menu with hover-based submenus
 * - Mobile: Hamburger menu with touch-based accordion submenus
 * - Responsive behavior based on screen size
 * - Maintains accessibility standards
 * - Performance optimized with React hooks
 */

/****************************
 * IMPORTS
 ****************************/

/**
 * Core React imports and hooks
 * useState: Local state management for menu open/close states
 * useContext: Access screen size context
 * useRef: DOM references for click detection
 * useEffect: Side effects for event listeners
 * useCallback: Function memoization
 * useMemo: Value memoization
 * memo: Component memoization
 */
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

/**
 * Component Imports
 * Burgershelf: Mobile hamburger menu icon that transforms into toppled books on click
 * mainMenuData: Static menu structure containing all menu items and their relationships
 */
import { Burgershelf } from '../Burgershelf/Burgershelf';
import { mainMenuData } from '../../data/dropdownItems';

/**
 * Context Imports
 * ScreenSizeContext: Provides viewport size state ('mobile' or 'Desktop')
 * Used throughout component to determine render behavior and interaction patterns
 */
import { ScreenSizeContext } from '../../contexts/ScreenSize';

/**
 * CSS Module Import
 * Scoped styling for the dropdown menu components
 * Uses CSS Modules to avoid style conflicts and maintain modularity
 * Styles are locally scoped and can only be accessed through the styles object
 * 
 * Key classes defined in module:
 * - menuItemHidden: Controls visibility in mobile accordion behavior
 * - Other menu-specific styles that need to be module-scoped
 */
import styles from './DropdownMenu.module.css';

import { zeroToAutoHeight } from '../../utils';

/**********************************
 * DROPDOWN ITEM COMPONENT
 **********************************/

/**
 * DropdownItem
 * A recursive component that renders individual menu items and their submenus.
 * Handles both mobile (touch/accordion) and desktop (hover) interactions.
 * Memoized to prevent unnecessary re-renders of unchanged items.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - Menu item data (title, url, icon, action, submenu)
 * @param {number} props.level - Nesting depth of item (0 = top level)
 * @param {Array} props.itemPath - Array tracking item's position in menu hierarchy
 * @param {Array} props.activePath - Currently active path in mobile accordion
 * @param {Function} props.onMenuToggle - Callback for mobile accordion state
 * @param {Function} props.onClose - Callback to close parent menu
 */
const DropdownItem = memo(({
    item,
    level = 0,
    itemPath = [],
    activePath = [],
    onMenuToggle,
    onClose
  }) => {
  /**
   * State & Context
   */
  const { size } = useContext(ScreenSizeContext);  // Viewport size
  const [isOpen, setIsOpen] = useState(false);     // Local submenu state
  const hasSubmenu = item.submenu && item.submenu.length > 0;  // Submenu check
  const submenuRef = useRef(null);

  /**
   * Path & Activity Calculations
   * Determines item's state in the menu hierarchy
   */
  const isInActivePath = JSON.stringify(itemPath) === JSON.stringify(activePath.slice(0, itemPath.length));
  const isActive = size === 'Mobile' ? isInActivePath : isOpen;
  const isSiblingActive = activePath.length > itemPath.length - 1
    && JSON.stringify(activePath.slice(0, itemPath.length - 1)) === JSON.stringify(itemPath.slice(0, -1))
    && activePath[itemPath.length - 1] !== itemPath[itemPath.length - 1];

  /**********************************
  * EVENT HANDLERS
  **********************************/

  /**
  * Desktop Hover Handlers
  * Control submenu visibility through mouse events on desktop only
  */
  const handleMouseEnter = useCallback(() => {
    if((hasSubmenu || level === 0) && size === 'Desktop') {
      if (submenuRef.current) {
        zeroToAutoHeight(submenuRef.current, true);
      }
      setIsOpen(true);
    }
  }, [hasSubmenu, size, level]);

  const handleMouseLeave = useCallback(() => {
    if((hasSubmenu || level === 0) && size === 'Desktop')
      if (submenuRef.current) {
        zeroToAutoHeight(submenuRef.current, false);
      }
      setIsOpen(false);
  }, [hasSubmenu, size, level]);

  /**
   * Mobile & Action Handlers
   * Handle touch interactions and menu item actions
   */
  const handleItemToggle = useCallback(() => {
    if (hasSubmenu && size === 'Mobile') {
      onMenuToggle(itemPath);    // Update accordion state
      setIsOpen(!isOpen);        // Toggle local submenu
    }
  }, [hasSubmenu, size, isOpen]);

  const handleAction = useCallback(() => {
    if (!hasSubmenu && item.action) {
      item.action();             // Execute item's action
      onClose();                 // Close menu after action
    }
  }, [hasSubmenu, item.action, onClose]);

  /**
   * Unified Click Handler
   * Prevents default behavior and routes to appropriate handler
   * based on device type
   */
  const handleClick = useCallback((e) => {
    e.preventDefault();
    size === 'Mobile' ? handleItemToggle() : handleAction();
  }, [size, handleItemToggle, handleAction]);

  const menuControl = useMemo(() =>
    /**
    * Conditional Element Rendering
    * Renders either an <a> tag for URL items
    * or a <button> for action/submenu items
    */
    (isActive = false) => {
      return item.url ? (
        <a
          href={item.url}
          onClick={handleClick}
          className={`
            ${styles.menuLink}
            ${isActive ? styles.menuLinkActive : ''}
          `}
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
      )
    }, [item.url, item.icon, item.title, handleClick]
  );

  /**
   * Submenu Items Generation
   * Memoized recursive rendering of child menu items
   */
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

  /**********************************
  * RENDER LOGIC
  **********************************/

  return (
    <li
      className={`
        ${styles.menuItem}
        ${styles['menuLevel'+level+size]}
        ${styles['menuItem'+size]} 
        ${isInActivePath ? styles.menuItemActive : ''}    
        ${hasSubmenu ? styles.hasSubmenu : ''}           
        ${size === 'Mobile' && isSiblingActive ? styles.menuItemHidden : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.phantom}>
        {menuControl()}
      </div>
      <div className={styles.wrapper}> {/* wrapper*/}
        {menuControl(isActive)}

        {/**
         * Submenu Container
         * Renders when:
         * - Item has submenu AND
         * - Mobile: item is in active path
         * - Desktop: item is being hovered
         */}
        {hasSubmenu && (
          <ul 
            ref={submenuRef}
            className={`
              ${styles.submenuContainer} 
              ${styles['submenu'+size]} 
              ${styles['level'+(level+1)]}   
              ${isOpen ? styles.submenuVisible : ''} 
          `}>
            {submenuItems}  {/* Memoized submenu items */}
          </ul>
        )}
      </div>
    </li>
  );
});

/**********************************
* MAIN DROPDOWN COMPONENT
**********************************/

/**
* MainDropdown
* Container component that manages the overall menu state and structure.
* Handles responsive behavior and coordinates child DropdownItems.
* 
* @component
* @param {Object} props
* @param {Array} props.items - Array of top-level menu items
*/
const MainDropdown = ({ items = [] }) => {
  /**
   * State & Context
   */
  const { size } = useContext(ScreenSizeContext);  // Viewport size
  const [isOpen, setIsOpen] = useState(false);     // Main menu visibility
  const menuRef = useRef(null);                    // Reference for click-outside detection
  const [activePath, setActivePath] = useState([]); // Mobile accordion state tracking
 
  /**********************************
   * EFFECTS
   **********************************/
  
  /**
   * Initial State Effect
   * Sets menu visibility based on viewport size
   * Desktop: Always open
   * Mobile: Closed by default
   */
  useEffect(() => {
    setIsOpen(size === 'Desktop');
  }, [size]);
 
  /**
   * Navigation Effect
   * Handles menu state during page navigation
   * Desktop: Keeps menu open
   * Mobile: Closes menu
   */
  useEffect(() => {
    const handleNavigation = () => setIsOpen(size !== 'Desktop');
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [size]);
 
  /**
   * Click Outside Effect
   * Mobile only: Closes menu when clicking/touching outside
   * Uses ref to detect clicks outside menu boundary
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (size === 'Mobile' && menuRef.current && !menuRef.current.contains(event.target)) {
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

  /**********************************
    * EVENT HANDLERS
    **********************************/
  
  /**
    * Mobile Menu Toggle Handler
    * Controls main menu visibility and resets accordion state
    * @param {Event} e - Click/touch event
    */
  const handleTouchEnd = useCallback((e) => {
    if (size === 'Mobile') {
      e.preventDefault();
      setIsOpen(!isOpen);
      if (isOpen) {
        setActivePath([]); // Reset accordion state when closing
      }
    }
  }, [size, isOpen]);

  /**
   * Menu Close Handler
   * Special behavior for desktop:
   * - Initially closes menu
   * - Immediately reopens to maintain top-level visibility
   */
  const handleClose = useCallback(() => {
    setIsOpen(size !== 'Desktop');
    {size === 'Desktop' && setTimeout(() => setIsOpen(true), 0)};
  }, [size]);

  /**
   * Accordion Path Handler
   * Manages mobile accordion behavior:
   * - If clicking same path: collapse it (remove last index)
   * - If clicking new path: expand it (set new path)
   * @param {Array} itemPath - Array of indices representing item's position
   */
  const handleMenuToggle = useCallback((itemPath) => {
    if (size === 'Mobile') {
      setActivePath(prevPath => {
        if (JSON.stringify(prevPath) === JSON.stringify(itemPath)) {
          return itemPath.slice(0, -1); // Collapse if same path
        }
        return itemPath; // Expand new path
      });
    }
  }, [size]);

  /**********************************
  * RENDER LOGIC
  **********************************/
 
  return (
    <nav
      ref={menuRef}
      className={`
        mainNav                   {/* Base menu styling */}
        ${size === 'Mobile' ? styles.mainNavMobile : styles.mainNavDesktop}  {/* Responsive styling */}
      `}
    >
      {/**
       * Mobile Menu Button
       * Only renders in mobile viewport
       * Contains Burgershelf component that animates on state change
       */}
      {size === 'Mobile' && (
        <button
          type="button"
          onClick={(e) => handleTouchEnd(e)}
          onTouchEnd={handleTouchEnd}
          aria-expanded={isOpen}    // Accessibility: Indicates menu state
          aria-haspopup="true"      // Accessibility: Indicates popup menu
        >
          <Burgershelf isOpen={isOpen}/>
        </button>
      )}

      {/**
       * Menu Items Container
       * Renders when:
       * - Desktop: Always visible
       * - Mobile: Only when isOpen is true
       */}
      {isOpen && (
        <ul className={`
          menuLevel0               {/* Top level menu container */}
          ${size === 'Mobile' ? styles.menuLevel0Mobile : styles.menuLevel0Desktop}  {/* Responsive styling */}
          ${isOpen ? 'menuVisible' : 'menuHidden'}  {/* Visibility state */}
        `}>
          {/**
           * Menu Items Mapping
           * Maps each top-level item to a DropdownItem component
           * Initializes path tracking for accordion behavior
           */}
          {items.map((item, index) => (
            <DropdownItem
              key={(`${item.title}-${index}`)}
              item={item}
              itemPath={[index]}        // Initialize path tracking
              activePath={activePath}   // Pass current accordion state
              onMenuToggle={handleMenuToggle}
              onClose={handleClose}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}

/**********************************
* MAIN MENU EXPORT
**********************************/

/**
* MainMenu
* Export wrapper that connects menu data to dropdown component
* Includes performance monitoring in development
* 
* @component
* @exports MainMenu
*/
export const MainMenu = () => {
  console.time('MainMenu Render');    // Performance monitoring
  const result = <MainDropdown items={mainMenuData}/>;
  console.timeEnd('MainMenu Render'); // Performance monitoring
  return result;
  };
  
  /**********************************
  * FUTURE CONSIDERATIONS
  **********************************/
  
  /**
  * Potential Enhancements:
  * 1. Add keyboard navigation support
  * 2. Implement focus trapping for accessibility
  * 3. Add animation/transition support
  * 4. Add theme customization
  * 5. Implement dynamic menu data loading
  * 
  * Performance Considerations:
  * 1. Monitor render times in production
  * 2. Consider code splitting for large menu structures
  * 3. Evaluate memoization effectiveness
  * 4. Watch for unnecessary re-renders
  * 
  * Maintenance Notes:
  * 1. CSS classes to be added via className props
  * 2. Styling should be modular and responsive
  * 3. Keep accessibility features when modifying
  * 4. Test both mobile and desktop interactions
  */