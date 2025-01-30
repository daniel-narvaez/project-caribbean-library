import { projectContent } from "../utils/contentBuilder";
import { createMediaItem } from "./HeroMedia";

/**********************************
 * GAME PROJECT DATA STRUCTURE
 **********************************/

/**
 * Factory function to create consistent game project items
 * Ensures all items follow the same data structure
 *
 * @param {Object} params - Project configuration
 * @param {string} params.title - Display text for the project
 * @param {Object} [params.urls] - URLs related to the project
 * @param {Object} [params.projectArticle] - Configuration for the project's UI article
 * @param {Object} [params.projectArticle.images] - Project image assets
 * @param {string} [params.projectArticle.heading] - Project heading text, defaults to title or 'Untitled Project'
 * @param {string} [params.projectArticle.tagline] - Short description of the project
 * @param {string} [params.projectArticle.readMoreBtn] - Text for the read more button
 * @param {string} [params.projectArticle.playBtn] - Text for the play button
 * @param {Object} [params.projectPage] - Configuration for the project's detailed page
 * @param {string} [params.projectPage.main] - Main content for the project page
 * @param {Array} [params.projectPage.walkthrough] - Array of walkthrough content
 * @returns {Object} Complete project data structure with all configured properties
 */

export const createGameProject = ({
  title,
  urls = {
    game: '/',
    portfolio: '',
  },
  projectArticle = {
    images: {
      cardFg: {
        src: '',
        alt: `An image of the project's card foreground.`
      },
      cardBg: {
        src: '',
        alt: `An image of the project's card background.`
      },
      bannerFg: {
        src: '',
        alt: `An image of the project's banner foreground.`
      },
      bannerBg: {
        src: '',
        alt: `An image of the project's banner background.`
      }
    },
    heading: title || 'Untitled Project', 
    tagline: `A short tagline about the project.`,
    readMoreBtn: '',
    playBtn: ''
  },
  projectPage = {
    main: '',
    walkthrough: []
  }
}) => {

  // Create URL-friendly path from title:
  // 1. Convert to lowercase
  // 2. Replace any non-alphanumeric characters with hyphens
  // 3. Remove any duplicate hyphens
  // 4. Remove leading/trailing hyphens
  const path = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

    const finalUrls = {
      ...urls,
      portfolio: `/game-projects/${path}`
    };
  
  const finalProjectArticle = {
    ...projectArticle,
    images: {
      ...projectArticle.images,
      cardFg: {
        ...projectArticle.images.cardFg,
        alt: projectArticle.images.cardFg.alt || `An image of ${title}'s card foreground.`
      },
      cardBg: {
        ...projectArticle.images.cardBg,
        alt: projectArticle.images.cardBg.alt || `An image of ${title}'s card background.`
      },
      bannerFg: {
        ...projectArticle.images.bannerFg,
        alt: projectArticle.images.bannerFg.alt || `An image of ${title}'s banner foreground.`
      },
      bannerBg: {
        ...projectArticle.images.bannerBg,
        alt: projectArticle.images.bannerBg.alt || `An image of ${title}'s banner background.`
      }
    },
    heading: projectArticle.heading || title || 'Untitled Project',
    tagline:  projectArticle.tagline || `A short tagline about ${title}.`,
    readMoreBtn: finalUrls.portfolio || '/',
    playBtn: finalUrls.game || '/'
  };

  return {
  title,
  path,
  urls: finalUrls,
  projectArticle: finalProjectArticle,
  projectPage,
  };
};