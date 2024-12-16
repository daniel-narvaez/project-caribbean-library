/**
 * heroMedia.js
 * ===========
 * 
 * Overview:
 * Manages media assets for the hero section slideshow.
 * Provides structured data for different media types (images, GIFs, videos)
 * with consistent metadata and organization.
 * 
 * Data Structures:
 * MediaItem {
 *   type: 'image' | 'gif' | 'video'  - Type of media asset
 *   url: string                       - Resource URL
 *   alt: string                       - Descriptive alt text
 * }
 */

/**
 * Base paths for different media types
 */
const PATHS = {
  HERO_GIFS: '../../../images/hero',
  HERO_VIDEOS: 'https://tq0koclkz81vf3zv.public.blob.vercel-storage.com'
};

/**
 * Creates a media item with consistent structure
 * @param {Object} params - Media parameters
 * @param {('image'|'gif'|'video')} params.type - Media type
 * @param {string} params.url - Media URL
 * @param {string} params.alt - Descriptive alt text
 * @returns {MediaItem} Formatted media item
 */
const createMediaItem = ({ type, url, alt }) => ({
  type,
  url,
  alt
});

/**
 * Collection of game projects and their details
 */
const PROJECTS = {
  ALMA: {
    name: 'Alma & the Cave of Breaths',
    filename: 'Alma_HeroSlide'
  },
  HEX_PERPLEX: {
    name: 'The Hex Perplex',
    filename: 'TheHexPerplex_HeroSlide'
  },
  CLOCK_OUT: {
    name: 'Clock Out!!',
    filename: 'ClockOut_HeroSlide'
  },
  PROJECT_BORICUAS: {
    name: 'Project Boricuas',
    filename: 'ProjectBoricuas_HeroSlide'
  },
  CHIHUAHUA_CHAMP: {
    name: 'Chihuahua Champ',
    filename: 'ChihuahuaChamp_HeroSlide'
  }
};

/**
 * Test slides using placeholder images
 * Useful for development and testing
 */
export const testSlides = [
  createMediaItem({
    type: 'image',
    url: 'https://picsum.photos/960/720',
    alt: 'Placeholder 1'
  }),
  createMediaItem({
    type: 'image',
    url: 'https://picsum.photos/960/720?random=2',
    alt: 'Placeholder 2'
  }),
  createMediaItem({
    type: 'image',
    url: 'https://picsum.photos/960/720?random=3',
    alt: 'Placeholder 3'
  })
];

/**
 * Creates hero section slides using GIFs
 * Optimized for smaller file sizes while maintaining quality
 */
export const heroGifSlides = Object.values(PROJECTS).map(project => 
  createMediaItem({
    type: 'gif',
    url: `${PATHS.HERO_GIFS}/${project.filename}.gif`,
    alt: `${project.name} slideshow footage`
  })
);

/**
 * Creates hero section slides using videos
 * Higher quality option with better performance for modern browsers
 */
export const heroVideoSlides = Object.values(PROJECTS).map(project => 
  createMediaItem({
    type: 'video',
    url: `${PATHS.HERO_VIDEOS}/${project.filename}-${generateRandomString()}.mp4`,
    alt: `${project.name} slideshow footage`
  })
);

/**
 * Helper function to simulate the random strings in video URLs
 * Note: In production, these should be actual unique identifiers
 * @returns {string} Random string for URL
 */
function generateRandomString() {
  // This is just a placeholder - in your actual code, 
  // these should be the real unique identifiers from your video URLs
  return 'uniqueIdentifier';
}