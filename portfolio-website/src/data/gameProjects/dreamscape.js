import { createGameProject } from "../createGameProject";
import { projectContent } from "../../utils/contentBuilder";
import { createMediaItem } from "../HeroMedia";

const dreamscapeProject = createGameProject({
  title: "Project Dreamscape",
  urls: {
    game: "",
    manhattanDist: "https://chris3606.github.io/GoRogue/articles/grid_components/measuring-distance.html#manhattan-distance",
    timedEventsDiagram: "https://machinations.io/community/daniel.narvaez/81715790f52711efabac028ecffc1261",

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
    tagline: "A third-person 3D hack-and-slash roguelite launching April 2025."
  },
  projectPage: {
    main: (
      projectContent.titleFrame(
        {
          src: "/../../images/games/ProjectDreamscape/projectPage/ProjectDreamscape-Logo.png",
          alt: "Project Dreamscape logo."
        },
        {
          src: "/../../images/games/ProjectDreamscape/projectPage/ProjectDreamscape-MoneyShot002.gif",
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
              { key: "Duration", value: "Ongoing" },
              { key: "Team Size", value: "75" },
            ]),
            projectContent.subheading("Summary"),
            projectContent.paragraph(({ urls }) => `*Project Dreamscape* is a third-person 3D hack-and-slash roguelite being developed in Unity by Studio Aspen of the EGD Collective. I lead the balancing division in our 21-person design team.`),
            projectContent.subheading("Contributions"),
            projectContent.list({
              type: 'bullet',
              items: [
                "Redesigned 6 core gameplay events by implementing scalable algorithms in Unity to balance the challenge level across each stage of the game."
              ]
            })
            // projectContent.paragraph(({ urls }) => `A playable demo will be available at New York State's pavilion during GDC 2025. The game is targeting an April 2025 release on Steam for Windows and MacOS.`)
          ]
        }
      },
      {
        heading: projectContent.heading("World Events: Balancing & Redesigns"),
        content: {
          left: [
            projectContent.paragraph("The game's core structure is divided into rounds. Players must select one of three 'events' presented to them at the beginning of each round. Events set the objectives players must complete to progress to the next round. Failure to complete the objectives results in a Game Over."),
            projectContent.paragraph("There are six possible events that can occur during a playthrough: Survival, Priorities, Defend, Escort, Outbreak, and Wanderlust. In the following sections I explain where our team identified balancing opportunities during testing, how I redesigned each event to address these challenges, and the outcomes of each redesign after I implemented it in the Unity project.")
          ]
        }
      },
      {
        heading: projectContent.subheading("Defend & Escort"),
        content: {
          left: [
            projectContent.paragraph("Both the Defend and Escort events require players to protect a non-playable character (NPC) from enemy attacks. In Defend, players guard a stationary NPC for the duration of the event. In Escort, players must safeguard an NPC to its destination across the map."),
            projectContent.paragraph("Our team identified that both events suffered from overwhelming enemy spawn rates. For each land in the map, one enemy spawned every 3 seconds. With just a few lands, this already created unfair difficulty spikes and performance issues. The problem only worsened when the map expanded, because each new land added another enemy spawn point and increased the total spawn rate."),
            projectContent.paragraph("My teammate suggested a sphere-based approach where enemies would only spawn within a certain radius of players **(Figure 1)**. I identified two limitations with translating this design into code:"),
            projectContent.list({
              type: "numbered",
              items: [
                "A sphere-based approach required constantly rechecking positions, which would be computationally expensive in the long-term.",
                "Determining which player's position to use as the center of the sphere in multiplayer scenarios created implementation challenges."
              ]
            }),
            projectContent.paragraph(({urls}) => `I noticed our codebase already stored grid coordinates for each land. I iterated on the radius-based approach by implementing a [Manhattan distance](${urls.manhattanDist}) algorithm that uses our existing grid system to create 'spawn zones', where enemies will appear **(Figure 2)**. For each event, I centered the spawn zone where the NPC is standing.`),
            projectContent.paragraph("The redesign only requires a position check if the event's NPC moves to another land, which creates the same spawn-limiting effect but with improved performance. It also solved any multiplayer challenges and focused the gameplay on protecting the NPC.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/radial-spawn-zone.jpeg",
                alt: "A sketch showing how a radius-based spawn zone would work in a grid-based map, and how it might not work in multiplayer scenarios.",
                figId: "1",
                caption: "The sphere would follow players, and enemies could only spawn within the zone. This would reduce the total spawn count, regardless of the map size."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/manhattan-spawn-zone.jpeg",
                alt: "A sketch showing how a grid-based spawn zone, using a manhattan distance algorithm, could work in the game regardless of player count.",
                figId: "2",
                caption: "The algorithm creates a diamond-shaped pattern by adding absolute x and y coordinates and establishes a predictable spawning area that we can adjust, regardless of player count or NPCs."
              },
            ])
          ]
        }
      },
      {
        heading: projectContent.subheading("Survival"),
        content: {
          left: [
            projectContent.paragraph("The Survival event challenged players to stay alive for two minutes while enemies spawn everywhere. Playtests proved that the 2-minute duration was excessive for early rounds and felt more like a waiting period. Similar to Defend and Escort, this event suffered from the same enemy spawn rate that overwhelmed players as they expanded the map."),
            projectContent.paragraph(({ urls }) => `I increased the spawn intervals but also scaled the number of enemies per spawn based on player count. This would give players time to evaluate and engage with each wave of enemies. I authored a formula that sets a 40-second timer in the first round and increases linearly as players add lands to the map. To validate these changes, I built a [Machinations diagram](${urls.timedEventsDiagram}) that simulated the relationship between player count, land count, and the time limit **(Figure 3, slide 1)**.`),
            projectContent.paragraph(({ urls }) => `My teammate's analysis of the diagram showed that, even with increased intervals, my approach would cause the Survival event to spawn 240 enemies at round 20. He proposed we set a fixed number of spawn intervals but revise the formula to scale them directly with the time limit. I revised the Machinations diagram with his feedback and integrated a [Manhattan distance](${urls.manhattanDist}) algorithm to limit enemy spawning further **(Figure 3, slide 2)**.`),
            projectContent.paragraph("The combined redesign balanced the time limit and enemy spawn rate across each stage of the game. The data showed that for a solo player, the average enemy spawns per event never exceeded 100 at any point in the game, which was an improvement from the original 240 **(Figure 4)**. Players now experience a difficulty for the Survival event that is relative to their strength and progress.")
          ],
          flexDir: 'column',
          right: [
            projectContent.gallery({
              figId: "3",
              caption: "Slide 1 shows the growth of enemy spawning with a fixed spawn interval. Slide 2 shows how my teammate's solution to use a scaling interval controlled the growth better.",
              items: [
                createMediaItem({
                  type: "gif",
                  url: "/../../images/games/ProjectDreamscape/projectPage/timed-events-test.gif",
                  alt: "A Machinations diagram showing the relationship between player count, land count, and the time limit during timed world-events in 'Project Dreamscape'. The enemy spawn interval is fixed."
                }),
                createMediaItem({
                  type: "gif",
                  url: "/../../images/games/ProjectDreamscape/projectPage/timed-events-manhattan-search.gif",
                  alt: "A Machinations diagram showing the relationship between player count, land count, and the time limit during timed world-events in 'Project Dreamscape'. The enemy spawn interval scales with the time limit, and a Manhattan distance algorithm limits the enemy spawn amount."
                }),
              ]
            }),
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/timed-events-execution-chart.jpg",
                alt: "A graph showing the average data from 10 simulations in the Machinations Diagram.",
                figId: "4",
                caption: "The execution chart for timed events shows, from 10 simulations, the average of each of the following values: enemy spawns per event, lands selected using Manhattan distance, and time limits per event."
              }
            ])
          ]
        }
      },
      {
        heading: projectContent.subheading("Outbreak"),
        content: {
          left: [
            projectContent.paragraph("The original Outbreak event, formerly called 'Zones', selected a random 3x3 quadrant of lands to spawn enemies, which the player would defeat to complete the round **(Figure 3)**. The first problem I noticed was how this search method becomes less impactful as players expand the map. They could also minimize the search's effectiveness by building non-square layouts, which reduces how many lands would be found."),
            projectContent.paragraph("I designed & implemented a spiral search pattern that starts from an 'epicenter' land and expands outward to affect neighboring lands. The event selects the largest perfect square below the total amount of lands that exist on the map. The pattern continues until it finds the target number of lands and works with any layout the player creates **(Figure 4)**."),
            projectContent.paragraph("The redesign balances the Outbreak event's challenge throughout each stage of the game, and it encourages players to build the map strategically. The spiral search pattern solves the original event's weakness to linear map layouts by accommodating the empty grid spaces between lands."),
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/quadrant-based-selection.jpeg",
                alt: "A sketch showing how the original 'Zones' event searched for lands in a 3x3 quadrant.",
                figId: "3",
                caption: "The original quadrant-based selection randomly chose a group of up to nine lands."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/zones-search-visualizer.gif",
                alt: "A react component that plays an animation of the spiral search pattern on a randomly generated map.",
                figId: "4",
                caption: "Starting from the epicenter (E), the spiral search pattern expands to find nearby lands (green) until it reaches the target amount."
              }
            ])
          ]
        }
      },
      {
        heading: projectContent.subheading("Wanderlust"),
        content: {
          left: [
            projectContent.paragraph("The initial premise of the Wanderlust event required players to visit each land, as implied by its former name 'Visit All'. In early stages of the game, players could instant-win the round by walking through the corners of adjacent lands since the entire land area counted as a valid visit zone."),
            projectContent.paragraph("I replaced the full land zones with size-adjustable 'visit indicators' that required players to step further toward the central area of each land. Each visit indicator starts large but shrinks as its land's level increases **(Figure 5)**. This removed the problem of only needing to take one step inside a land for the event to consider it visited."),
            projectContent.paragraph("Adjusting the criteria for visiting a land exposed another issue: the event became too demanding as the map size and lands' levels increased."),
            projectContent.paragraph("I addressed this by redesigning the land selection. Rather than requiring the player to visit every land, the event now requires fewer lands relative to the map size **(Figure 6)**."),
            projectContent.paragraph("The event's difficulty scales naturally with the progression of lands' levels, and players must now consider the level distribution as they expand the map. The red visit indicator spheres seen in **Figure 7** show how both of the changes work together.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/indicator-radius-scaling.jpeg",
                alt: "a sketch showing a graph and equations for scaling the radius of a visit indicator inversely as its land's level increases.",
                figId: "5",
                caption: "I drew a graph showing how I wanted a visit indicator's radius to scale, and then I iterated the equation that would make this behavior happen."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/visit-indicators-scaling.jpeg",
                alt: "a sketch showing a graph and equations for scaling the number of visit indicators relative to the number of spawned lands on the map.",
                figId: "6",
                caption: "While the total land count increases linearly, the number of required visits grows slower, preventing late-game scenarios where players would need to visit an overwhelming amount of lands."
              },
              {
                src: "/../../images/games/ProjectDreamscape/projectPage/wanderlust-changes.gif",
                alt: "a snippet of gameplay from an early version of Project Dreamscape, which depicts the Wanderlust world-event generating visit indicators on the map.",
                figId: "7",
                caption: "The world-event spawns visit indicators for 7 out of 9 lands on the map and adjusts each one's radius based on its land's level."
              },
            ])
          ]
        }
      },
    ]
  }
});

export default dreamscapeProject;