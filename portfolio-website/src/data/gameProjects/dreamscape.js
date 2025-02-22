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
        // src: "/../../images/games/ProjectDreamscape/projectArticle/ProjectDreamscape-",
        // alt: ""
      },
      cardBg: {
        src: "/../../images/games/ProjectDreamscape/projectArticle/ProjectDreamscape-cardBg.png",
        alt: "Early concept art of Project Dreamscape's player character, by Shavon H."
      },
      bannerFg: {
        // src: "/../../images/games/ProjectDreamscape/projectArticle/ProjectDreamscape-",
        // alt: ""
      },
      bannerBg: {
        src: "/../../images/games/ProjectDreamscape/projectArticle/ProjectDreamscape-bannerBg.png",
        alt: "Early concept art of Project Dreamscape's player character, by Shavon H."
      }
    },
    tagline: "A third-person 3D hack-and-slash roguelite launching on Steam April 2025."
  },
  projectPage: {
    main: (
      projectContent.titleFrame(
        {
          src: "/../../images/games/ProjectDreamscape/projectPage/ProjectDreamscape-Logo.png",
          alt: "Project Dreamscape logo."
        },
        {
          src: "/../../images/games/ProjectDreamscape/projectPage/ProjectDreamscape-MoneyShot001.gif",
          alt: "A snippet of gameplay from an early version of Project Dreamscape, which depicts the player character using the Charger-type Memory attack, and then performing a launch-to-aerial three-hit combo on an enemy."
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
              { key: "Team Size", value: "75" },
            ]),
            projectContent.subheading("Summary"),
            projectContent.paragraph(({ urls }) => `*Project Dreamscape* is a third-person 3D hack-and-slash roguelite being developed in Unity by Studio Aspen of the EGD Collective. I lead the balancing division in our 21-person design team.`),
            projectContent.paragraph(({ urls }) => `A playable demo will be available at New York State's pavilion during GDC 2025. The game is targeting an April 2025 release on Steam for Windows and MacOS.`)
          ],
          right: [

          ]
        }
      },

      {
        heading: projectContent.heading("World-Event Redesigns & Balances"),
        content: {
          left: [
            projectContent.subheading("Outbreak"),
            projectContent.paragraph("The original Outbreak world-event, formerly called 'Zones', selected a random 3x3 quadrant of lands to spawn enemies, which the player would defeat to complete the round **(Figure 1)**. The first problem I noticed was how this search method becomes less impactful as players expand the map. They could also minimize the search's effectiveness by building non-square layouts, which reduces how many lands would be found. "),
            projectContent.paragraph("I designed & implemented a spiral search pattern that starts from an 'epicenter' land and expands outward to affect neighboring lands. The world-event selects the largest perfect square below the total amount of lands that exist on the map. The pattern continues until it finds the target number of lands and works with any layout the player creates **(Figure 2)**."),
            projectContent.paragraph("The redesign balances the Outbreak world-event's challenge throughout each stage of the game, and it encourages players to build the map strategically. The spiral search pattern solves the original event's weakness to linear map layouts by accommodating the empty grid spaces between lands."),
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/quadrant-based-selection.jpeg",
                alt: "a sketch showing how the original 'Zones' event searched for lands in a 3x3 quadrant.",
                figId: "1",
                caption: "The original quadrant-based selection randomly chose a group of up to nine lands."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/zones-search-visualizer.gif",
                alt: "a react component that plays an animation of the spiral search pattern on a randomly generated map.",
                figId: "2",
                caption: "Starting from the epicenter (E), the spiral search pattern expands to find nearby lands (green) until it reaches the target amount."
              }
            ])
          ]
        }
      },
    ]
  }
});

export default dreamscapeProject;