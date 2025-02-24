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
        src: "/../../images/games/ProjectDreamscape/projectArticle/ProjectDreamscape-cardBg.png",
        alt: "Early concept art of Project Dreamscape's player character, by Shavon H."
      },
      bannerFg: {
        src: "",
        alt: ""
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
            projectContent.subheading("Wanderlust"),
            projectContent.paragraph("The initial premise of the Wanderlust required players to visit each land whenever they chose this world-event, as implied by its former name 'Visit All'. In early stages of the game, players could instant-clear the round by walking through the corners of adjacent lands since the entire land area counted as a valid visit zone."),
            projectContent.paragraph("I replaced the full land zones with size-adjustable 'visit indicators' that required players to step further toward the central area of each land. Each visit indicator starts large but shrinks as its land's level increases **(Figure 1)**. This removed the problem of only needing to take one step inside a land for the world-event to consider it visited."),
            projectContent.paragraph("Adjusting the criteria for visiting a land exposed another issue: the world-event became too demanding as the map size and lands' levels increased."),
            projectContent.paragraph("I addressed this by redesigning the land selection. Rather than requiring the player to visit every land, the world-event now requires fewer lands relative to the map size **(Figure 2)**."),
            projectContent.paragraph("The world-event’s difficulty scales naturally with the progression of lands’ levels, and players must now consider the level distribution as they expand the map. The red visit indicator spheres seen in **Figure 3** show how both of the changes work together.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/indicator-radius-scaling.jpeg",
                alt: "a sketch showing a graph and equations for scaling the radius of a visit indicator inversely as its land's level increases.",
                figId: "1",
                caption: "I drew a graph showing how I wanted a visit indicator's radius to scale, and then I iterated the equation that would make this behavior happen."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/visit-indicators-scaling.jpeg",
                alt: "a sketch showing a graph and equations for scaling the number of visit indicators relative to the number of spawned lands on the map.",
                figId: "2",
                caption: "While the total land count increases linearly, the number of required visits grows slower, preventing late-game scenarios where players would need to visit an overwhelming amount of lands."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/wanderlust-changes.gif",
                alt: "a snippet of gameplay from an early version of Project Dreamscape, which depicts the Wanderlust world-event generating visit indicators on the map.",
                figId: "3",
                caption: "The world-event spawns visit indicators for 7 out of 9 lands on the map and adjusts each one's radius based on its land's level."
              },
            ])
          ]
        }
      },

      {
        heading: projectContent.heading(""),
        content: {
          left: [
            projectContent.subheading("Outbreak"),
            projectContent.paragraph("The original Outbreak world-event, formerly called 'Zones', selected a random 3x3 quadrant of lands to spawn enemies, which the player would defeat to complete the round **(Figure 4)**. The first problem I noticed was how this search method becomes less impactful as players expand the map. They could also minimize the search's effectiveness by building non-square layouts, which reduces how many lands would be found. "),
            projectContent.paragraph("I designed & implemented a spiral search pattern that starts from an 'epicenter' land and expands outward to affect neighboring lands. The world-event selects the largest perfect square below the total amount of lands that exist on the map. The pattern continues until it finds the target number of lands and works with any layout the player creates **(Figure 5)**."),
            projectContent.paragraph("The redesign balances the Outbreak world-event's challenge throughout each stage of the game, and it encourages players to build the map strategically. The spiral search pattern solves the original event's weakness to linear map layouts by accommodating the empty grid spaces between lands."),
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/quadrant-based-selection.jpeg",
                alt: "a sketch showing how the original 'Zones' event searched for lands in a 3x3 quadrant.",
                figId: "4",
                caption: "The original quadrant-based selection randomly chose a group of up to nine lands."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/zones-search-visualizer.gif",
                alt: "a react component that plays an animation of the spiral search pattern on a randomly generated map.",
                figId: "5",
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