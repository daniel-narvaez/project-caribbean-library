/**
 * aboutMedia.js
 * ============
 * 
 * Overview:
 * Manages image resources and metadata for the About section.
 * Provides a factory function for creating image items and utilities
 * for retrieving them.
 * 
 * Data Structure:
 * AboutItem {
 *   id: string     - Unique identifier for the image
 *   src: string    - Image source path
 *   alt: string    - Descriptive alt text for accessibility
 * }
 */

/**
 * Base path for about section images
 * Centralizes path management for easier updates
 */
const ABOUT_IMAGES_PATH = '/../../images/about';

/**
 * Creates a new about section image item with consistent structure
 * @param {Object} params - Image parameters
 * @param {string} [params.id='default'] - Unique identifier
 * @param {string} params.src - Image source path
 * @param {string} params.alt - Image alt text
 * @returns {AboutItem} Formatted image item
 */
export const createAboutItem = ({
  id = 'default',
  src,
  alt
}) => ({
  id,
  src,
  alt
});

/**
 * Collection of about section images with metadata
 */
export const aboutMedia = [
  createAboutItem({
    id: 'default',
    src: `${ABOUT_IMAGES_PATH}/currently-polaroid.jpg`,
    alt: "A portrait image of me smiling in a black polo shirt. Behind me is a wall of grass."
  }),
  
  createAboutItem({
    id: 'graduated',
    src: `${ABOUT_IMAGES_PATH}/graduated-polaroid.jpg`,
    alt: "A portrait image of me smiling in my college graduation gown. I'm wearing a stole that reads 'Parsons School of Design' on one end, and bears The New School logo on the other end."
  }),
  
  createAboutItem({
    id: 'participate',
    src: `${ABOUT_IMAGES_PATH}/exhibiting-polaroid.jpg`,
    alt: "An image of me leaning against my exhibition of one of my games at an event. I'm wearing a shirt that reads 'Bad Bunny' and am wearing a medallion with the Puerto Rican flag."
  })
];

/**
 * Named exports for individual media items
 * Enables direct imports of specific images when needed
 */
export const [defaultImage, graduatedImage, exhibitingImage] = aboutMedia;

/**
 * Retrieves an about section image by its ID
 * @param {string} [id='default'] - ID of the image to retrieve
 * @returns {AboutItem|null} Matching image item or null if not found
 */
export const getAboutItem = (id = 'default') => 
  aboutMedia.find(mediaItem => mediaItem.id === id) ?? null;