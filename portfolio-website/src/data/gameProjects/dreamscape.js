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
        // src: "",
        // alt: ""
      },
      cardBg: {
        // src: "",
        // alt: ""
      },
      bannerFg: {
        // src: "",
        // alt: ""
      },
      bannerBg: {
        // src: "",
        // alt: ""
      }
    },
    tagline: "A third-person 3D hack-and-slash roguelite launching on Steam April 2025."
  },
  projectPage: {
    main: (
      projectContent.titleFrame(
        {
          src: "",
          alt: ""
        },
        {
          src: "",
          alt: ""
        }
      )
    ),
    walkthrough: [
      {
        heading: projectContent.heading("Project Overview"),
        content: {
          left: [
            projectContent.details([
              { key: "Platforms", value: "TBD" },
              { key: "Duration", value: "ongoing" },
              { key: "Team Size", value: "90" },
            ]),
            projectContent.subheading("Summary"),
            projectContent.paragraph(({ urls }) => `*Project Dreamscape* is a third-person 3D hack-and-slash roguelite being developed in Unity by Studio Aspen of the EGD Collective. I lead the balancing division in our 21-person design team.`),
            projectContent.paragraph(({ urls }) => `A playable demo will be available at New York State's pavilion during GDC 2025. The game is targeting an April 2025 release on Steam for Windows and MacOS.`)
          ],
          right: [

          ]
        }
      }
    ]
  }
});

export default dreamscapeProject;