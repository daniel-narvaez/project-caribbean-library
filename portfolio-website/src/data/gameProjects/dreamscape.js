import { createGameProject } from "../createGameProject";
import { projectContent } from "../../utils/contentBuilder";
import { createMediaItem } from "../HeroMedia";

const dreamscapeProject = createGameProject({
  title: "Project Dreamscape",
  urls: {
    game: "",
  },
  projectArticle: {
    images: {
      cardFg: {
        src: "",
        alt: ""
      },
      cardBg: {
        src: "",
        alt: ""
      },
      bannerFg: {
        src: "",
        alt: ""
      },
      bannerBg: {
        src: "",
        alt: ""
      }
    },
    tagline: ""
  },
  projectPage: {
    main: "",
    walkthrough: []
  }
});

export default dreamscapeProject;