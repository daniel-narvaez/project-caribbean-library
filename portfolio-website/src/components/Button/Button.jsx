// Buttons.js
import { memo } from 'react';
import styles from './Button.module.css';
import typographies from '../../typography.module.css';
import colors from '../../color.module.css';
import { useActionButtonLogic, useLinkButtonLogic } from './ButtonLogic';
import { getLinkAttributes } from '../../utils/externalUrls';

/**
 * Base Button Component
 * Provides shared styling and structure for both ActionButton and LinkButton
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes to apply
 * @param {'solid' | 'island'} props.style - Button style variant
 * @param {string} props.size - Size variant from ButtonLogic
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.title - Button text content
 */
const ButtonBase = memo(({ className, style = 'solid', disabled, title }) => {
  const buttonClassName = `${className} ${styles.button} ${styles[style]}`;
  
  return (
    <span className={`${buttonClassName}`} aria-disabled={disabled}>
      {title}
    </span>
  );
});

/**
 * Action Button Component
 * Handles click interactions and button behavior
 * 
 * @example
 * // Basic usage
 * <ActionButton title="Click Me" onCustomClick={() => {}} />
 * 
 * // With custom styling
 * <ActionButton 
 *   title="Custom Button" 
 *   onCustomClick={handleClick}
 *   style="island"
 *   className="my-custom-class"
 * />
 * 
 * Props:
 * @param {Object} props
 * @param {string} props.title - Button text content
 * @param {'solid' | 'island'} props.style - Visual style variant
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onCustomClick - Click handler (required)
 * 
 * Notes:
 * - Button is disabled when onCustomClick is undefined
 * - Automatically applies action-specific styling
 */
export const ActionButton = memo(({
  title = 'Button',
  style = 'solid',
  className = '',
  onCustomClick
}) => {
  const { isDisabled } = useActionButtonLogic(onCustomClick);

  return (
    <button
      type="button"
      className='action'
      onClick={onCustomClick}
      disabled={isDisabled}
    >
      <ButtonBase 
        className={`${typographies.ui3} ${className}`}
        style={style}
        disabled={isDisabled}
        title={title}
      />
    </button>
  );
});

/**
 * Link Button Component
 * Handles URL navigation and link behavior
 * 
 * @example
 * // Internal link
 * <LinkButton title="Go to Home" url="/" />
 * 
 * // External link (automatically opens in new tab)
 * <LinkButton title="Visit Site" url="https://example.com" />
 * 
 * Props:
 * @param {Object} props
 * @param {string} props.title - Button text content
 * @param {string} props.url - Destination URL (required)
 * @param {'solid' | 'island'} props.style - Visual style variant
 * @param {string} props.className - Additional CSS classes
 * 
 * Notes:
 * - Automatically handles external links in new tabs
 * - Disabled when url is ' ' or '/'
 * - Maintains accessibility with proper ARIA attributes
 */
export const LinkButton = memo(({
  title = 'Button',
  url = '/',
  style = 'solid',
  className = ''
}) => {
  const { isDisabled, finalUrl, handleClick } = useLinkButtonLogic(url);

  return (
    <a
      href={isDisabled ? "#" : finalUrl}
      onClick={handleClick}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      className={styles.linkButton}
      {...getLinkAttributes(finalUrl)}
    >
      <ButtonBase 
        className={`${typographies.ui3} ${className}`}
        style={style}
        disabled={isDisabled}
        title={title}
      />
    </a>
  );
});

export const PrimaryButton = memo(({
  title = 'Button',
  url = '/',
}) => {
  const { isDisabled, finalUrl, handleClick } = useLinkButtonLogic(url);

  return (
    <a
      href={isDisabled ? "#" : finalUrl}
      onClick={handleClick}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      className={`${colors.uiBg1} ${styles.button}`}
      {...getLinkAttributes(finalUrl)}
    >
      <span className={`${typographies.ui3} ${colors.uiNav1}`} aria-disabled={isDisabled}>
        {title}
      </span>
    </a>
  )
});

/**
 * Pre-styled Button Variants
 * Convenience components with predetermined styles
 * 
 * Action Button Variants:
 * - SolidActionButton: Default solid style for actions
 * - IslandActionButton: Island style for secondary actions
 * 
 * Link Button Variants:
 * - SolidLinkButton: Default solid style for links
 * - IslandLinkButton: Island style for secondary links
 * 
 * Usage remains the same as base components, style prop is pre-set
 */
export const SolidActionButton = (props) => <ActionButton {...props} style="solid" />;
export const IslandActionButton = (props) => <ActionButton {...props} style="island" />;
export const SolidLinkButton = (props) => <LinkButton {...props} style="solid" />;
export const IslandLinkButton = (props) => <LinkButton {...props} style="island" />;