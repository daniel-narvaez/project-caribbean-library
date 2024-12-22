import React from "react";
/**********************************
* GAME PROJECT DATA STRUCTURE
**********************************/

/**
* Factory function to create consistent game project items
* Ensures all items follow the same data structure
* 
* @param {Object} params - Project configuration
* @param {string} params.title - Display text for the project
* @param {string} [params.portfolioUrl=''] - URL to the project's portfolio page
* @param {string} [params.gameUrl=''] - URL to the project's game page, where it can be played
* @param {Object} [params.projectArticle] - Configuration object for the project's UI article.
* @returns {Object} complete data of a game project
*/

export const createGameProject = ({
  title,
  portfolioUrl = '/',
  gameUrl = '/',
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
  }
}) => {
  
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
    readMoreBtn: portfolioUrl || '/',
    playBtn: gameUrl || '/'
  };

  return {
  title,
  portfolioUrl,
  gameUrl,
  projectArticle: finalProjectArticle
  };
};

/**********************************
* GAME PROJECTS
**********************************/

export const clockOutProject = createGameProject({
  title: 'Clock Out!!',
  portfolioUrl: '/',
  gameUrl: 'https://daniel-narvaez.itch.io/clock-out',
  projectArticle: {
    images: {
      cardFg: {
        src: '/../../images/games/ClockOut/projectArticle/ClockOut-CardFg.png',
        alt: `An image of JoJo, Clock Out!!'s protagonist, pounding their fist into an open palm.`
      },
      cardBg: {
        src: '/../../images/games/ClockOut/projectArticle/ClockOut-CardBg.png',
        alt: `A splash screen of Clock Out!!, featuring several bosses in the game on top of corporate buildings.`
      },
      bannerFg: {
        src: '/../../images/games/ClockOut/projectArticle/ClockOut-BannerFg.png',
        alt: `An image of JoJo, Clock Out!!'s protagonist, pounding their fist into an open palm.`
      },
      bannerBg: {
        src: '/../../images/games/ClockOut/projectArticle/ClockOut-BannerBg.png',
        alt: `A splash screen of Clock Out!!, featuring several bosses in the game on top of corporate buildings.`
      },
    },
    tagline: 'An unpaid intern decides to fight bosses—literally.',
  }
});

export const chihuahuaChampProject = createGameProject({
  title: 'Chihuahua Champ',
  portfolioUrl: '/',
  gameUrl: 'https://daniel-narvaez.itch.io/chihuahua-champ',
  projectArticle: {
    images: {
      cardFg: {
        src: '/../../images/games/ChihuahuaChamp/projectArticle/ChihuahuaChamp-CardFg.png',
        alt: `An image of the player character in Chihuahua Champ, who is depicted glowing with a yellow aura and has fire in his eyes. In a determined pose, he's crushing a dog treat in his hand.`
      },
      cardBg: {
        src: '/../../images/games/ChihuahuaChamp/projectArticle/ChihuahuaChamp-CardBg.png',
        alt: `An image of Pookie, the player character's girlfriend in Chihuahua Champ, sitting on their couch. She's looking over at the player character with a confused expression.`
      },
      bannerFg: {
        src: '/../../images/games/ChihuahuaChamp/projectArticle/ChihuahuaChamp-BannerFg.png',
        alt: `An image of the player character in Chihuahua Champ, who is depicted glowing with a yellow aura and has fire in his eyes. In a determined pose, he's crushing a dog treat in his hand.`
      },
      bannerBg: {
        src: '/../../images/games/ChihuahuaChamp/projectArticle/ChihuahuaChamp-BannerBg.png',
        alt: `An image of Pookie, the player character's girlfriend in Chihuahua Champ, sitting on their couch. She's looking over at the player character with a confused expression.`
      },
    },
    tagline: 'A tiny-but-mighty chihuahua rises to become a powerlifting top dog.',
  }
});

export const theHexPerplexProject = createGameProject({
  title: 'The Hex Perplex',
  portfolioUrl: '/',
  gameUrl: 'https://daniel-narvaez.itch.io/the-hex-perplex',
  projectArticle: {
    images: {
      cardFg: {
        src: '',
        alt: ' '
      },
      cardBg: {
        src: '/../../images/games/TheHexPerplex/projectArticle/TheHexPerplex-CardBg.png',
        alt: 'An image of the player character in The Hex Perplex looking toward a castle shrouded in purple thunder.'
      },
      bannerFg: {
        src: '',
        alt: ' '
      },
      bannerBg: {
        src: '/../../images/games/TheHexPerplex/projectArticle/TheHexPerplex-BannerBg.png',
        alt: 'An image of the player character in The Hex Perplex looking toward a castle shrouded in purple thunder.'
      },
    },
    tagline: 'A young wizard harnesses magic to solve puzzles & fight golems.',
  }
});

export const projectArticlesData = [clockOutProject.projectArticle, chihuahuaChampProject.projectArticle, theHexPerplexProject.projectArticle];

export const gameProjectsData = [clockOutProject, chihuahuaChampProject, theHexPerplexProject]