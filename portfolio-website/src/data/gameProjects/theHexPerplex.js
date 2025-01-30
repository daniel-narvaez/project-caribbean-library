import { createGameProject } from "../createGameProject";
import { projectContent } from "../../utils/contentBuilder";
import { createMediaItem } from "../HeroMedia";

export const theHexPerplexProject = createGameProject({
  title: 'The Hex Perplex',
  urls: {
    game: 'https://daniel-narvaez.itch.io/the-hex-perplex'
  },
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

export default theHexPerplexProject;