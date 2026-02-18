import { createGameProject } from "../createGameProject";
import { projectContent } from "../../utils/contentBuilder";
import { createMediaItem } from "../HeroMedia";

const dreamscapeProject = createGameProject({
  title: "Project Dreamscape",
  urls: {
    game: "https://store.steampowered.com/app/3569570/Project_Dreamscape/",
    transitionalProgram: "https://www.egdcollective.org/transitional-program",
    manhattanDist: "https://chris3606.github.io/GoRogue/articles/grid_components/measuring-distance.html#manhattan-distance",
    timedEventsDiagram: "https://machinations.io/community/daniel.narvaez/81715790f52711efabac028ecffc1261",
  },
  projectArticle: {
    images: {
      cardFg: {
        src: "/../../images/games/Dreamscape/projectArticle/Dreamscape-cardFg.png",
        alt: "An image of the Guide from Project Dreamscape flying on a yellow star board."
      },
      cardBg: {
        src: "/../../images/games/Dreamscape/projectArticle/Dreamscape-cardBg.png",
        alt: "A splash screen of Project Dreamscape featuring the Dreamer leaning on a hammer in the dream forest biome."
      },
      bannerFg: {
        src: "/../../images/games/Dreamscape/projectArticle/Dreamscape-bannerFg.png",
        alt: "An image of the Guide from Project Dreamscape flying on a yellow star board."
      },
      bannerBg: {
        src: "/../../images/games/Dreamscape/projectArticle/Dreamscape-bannerBg.png",
        alt: "A splash screen of Project Dreamscape featuring the Dreamer leaning on a hammer in the dream forest biome."
      }
    },
    tagline: "A dreamer battles their inner demons within a subconscious world."
  },
  projectPage: {
    main: (
      projectContent.titleFrame(
        {
          src: "/../../images/games/Dreamscape/projectPage/ProjectDreamscape-Logo.png",
          alt: "Project Dreamscape logo."
        },
        {
          src: "/../../images/games/Dreamscape/projectPage/Dreamscape-MoneyShot002.gif",
          alt: "A snippet of gameplay from an early version of Project Dreamscape, which depicts the player character using the Charger-type Memory attack, and then performing a launch-to-aerial three-hit combo on an enemy."
        }
      )
    ),
    walkthrough: [
      {
        heading: projectContent.heading2("Project Overview"),
        content: {
          left: [
            projectContent.details([
              { key: "Platforms", value: "Windows, MacOS" },
              { key: "Release Date", value: "May 2025" },
              { key: "Team Size", value: "100+" },
              { key: "Builds", value: ({ urls }) => `[Steam](${urls.game})`}
            ]),
            projectContent.heading3("Summary"),
            projectContent.paragraph(({ urls }) => `A third-person 3D hack-and-slash roguelite game for desktop platforms. My team of 100+ developed *Project Dreamscape* with Unity in 9 months at the [EGD Collective's Game Studio program](${urls.transitionalProgram}). Our design team consisted of 21 people, and we operated with other teams in a AAA environment.`),
            projectContent.heading3("Contributions"),
            projectContent.list({
              type: 'bullet',
              items: [
                "Redesigned 6 core gameplay events by implementing scalable algorithms in Unity to balance the challenge level across each stage of the game.",
                "Modified the quest system by incentivizing players to practice game mechanics, which balanced rewards for the game's economy and improved the onboarding experience.",
                "Designed 19 quest templates using a multi-criteria system to introduce tougher challenges at appropriate stages of gameplay, resulting in the creation of 63 unique quests for players to encounter."
              ]
            })
            // projectContent.paragraph(({ urls }) => `A playable demo will be available at New York State's pavilion during GDC 2025. The game is targeting an April 2025 release on Steam for Windows and MacOS.`)
          ]
        }
      },
      {
        heading: projectContent.heading2("World Events: Balances & Redesigns"),
        content: {
          left: [
            projectContent.paragraph("The game's core structure is divided into rounds. Players must select one of three 'events' presented to them at the beginning of each round. Events set the objectives players must complete to progress to the next round. Failure to complete the objectives results in a Game Over."),
            projectContent.paragraph("There are six possible events that can occur during a playthrough: Survival, Defend, Escort, Outbreak, Wanderlust, and Priorities."),
            projectContent.paragraph(" In the following sections I explain where our team identified balancing opportunities during testing, how I redesigned some events to address these challenges, and the outcomes of each redesign after I implemented it in the Unity project.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "../../images/games/Dreamscape/projectPage/world-event-selection.gif",
                alt: "A gif from Project Dreamscape showing event selection.",
                figId: "1",
                caption: "The game presents three random events at the start of the round, and the player selects one to set the round's objective."
              }
            ])
          ]
        }
      },
      {
        heading: projectContent.heading3("Defend & Escort"),
        content: {
          left: [
            projectContent.paragraph("Both the Defend and Escort events require players to protect a non-playable character (NPC) from enemy attacks. In Defend, players guard a stationary NPC for the duration of the event. In Escort, players must safeguard an NPC to its destination across the map."),
            projectContent.paragraph("Our team identified that both events suffered from overwhelming enemy spawn rates. For each land in the map, one enemy spawned every 3 seconds. This created unfair difficulty spikes and performance issues that worsened as the map expanded with more spawn points."),
            projectContent.paragraph("My teammate suggested a sphere-based approach where enemies would only spawn within a certain radius of players **(Figure 2)**. I identified that required constant position checking, which was computationally expensive, but also that it'd be challenging to implement in multiplayer scenarios."),
            projectContent.paragraph(({urls}) => `I noticed our codebase already stored grid coordinates for each land. I iterated on the radius-based approach by implementing a [Manhattan distance](${urls.manhattanDist}) algorithm that uses our existing grid system to create 'spawn zones', where enemies will appear **(Figure 3)**. For each event, I centered the spawn zone where the NPC is standing.`),
            projectContent.paragraph("The redesign only requires a position check if the event's NPC moves to another land, which creates the same spawn-limiting effect but with improved performance. It also solved any multiplayer challenges and focused the gameplay on protecting the NPC.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/Dreamscape/projectPage/radial-spawn-zone.jpeg",
                alt: "A sketch showing how a radius-based spawn zone would work in a grid-based map, and how it might not work in multiplayer scenarios.",
                figId: "2",
                caption: "The sphere would follow players, and enemies could only spawn within the zone. This would reduce the total spawn count, regardless of the map size."
              },
              {
                src: "/../../images/games/Dreamscape/projectPage/manhattan-spawn-zone.jpeg",
                alt: "A sketch showing how a grid-based spawn zone, using a manhattan distance algorithm, could work in the game regardless of player count.",
                figId: "3",
                caption: "The algorithm creates a diamond-shaped pattern by adding absolute x and y coordinates and establishes a predictable spawning area that we can adjust, regardless of player count or NPCs."
              },
            ])
          ]
        }
      },
      // {
      //   heading: projectContent.subheading("Survival"),
      //   content: {
      //     left: [
      //       projectContent.paragraph("The Survival event challenged players to stay alive for two minutes while enemies spawn everywhere. Playtests proved that the 2-minute duration was excessive for early rounds and felt more like a waiting period. Similar to Defend and Escort, this event suffered from the same enemy spawn rate that overwhelmed players as they expanded the map."),
      //       projectContent.paragraph(({ urls }) => `I increased the spawn intervals but also scaled the number of enemies per spawn based on player count. This would give players time to evaluate and engage with each wave of enemies. I authored a formula that sets a 40-second timer in the first round and increases linearly as players add lands to the map. To validate these changes, I built a [Machinations diagram](${urls.timedEventsDiagram}) that simulated the relationship between player count, land count, and the time limit **(Figure 4, slide 1)**.`),
      //       projectContent.paragraph(({ urls }) => `My teammate's analysis of the diagram showed that, even with increased intervals, my approach would cause the Survival event to spawn 240 enemies at round 20. He proposed we set a fixed number of spawn intervals but revise the formula to scale them directly with the time limit. I revised the Machinations diagram with his feedback and integrated a [Manhattan distance](${urls.manhattanDist}) algorithm to limit enemy spawning further **(Figure 4, slide 2)**.`),
      //       projectContent.paragraph("The combined redesign balanced the time limit and enemy spawn rate across each stage of the game. The data showed that for a solo player, the average enemy spawns per event never exceeded 100 at any point in the game, which was an improvement from the original 240 **(Figure 5)**. Players now experience a difficulty for the Survival event that is relative to their strength and progress.")
      //     ],
      //     flexDir: 'column',
      //     right: [
      //       projectContent.gallery({
      //         figId: "4",
      //         caption: "Slide 1 shows the growth of enemy spawning with a fixed spawn interval. Slide 2 shows how my teammate's solution to use a scaling interval controlled the growth better.",
      //         items: [
      //           createMediaItem({
      //             type: "gif",
      //             url: "/../../images/games/Dreamscape/projectPage/timed-events-test.gif",
      //             alt: "A Machinations diagram showing the relationship between player count, land count, and the time limit during timed world-events in 'Project Dreamscape'. The enemy spawn interval is fixed."
      //           }),
      //           createMediaItem({
      //             type: "gif",
      //             url: "/../../images/games/Dreamscape/projectPage/timed-events-manhattan-search.gif",
      //             alt: "A Machinations diagram showing the relationship between player count, land count, and the time limit during timed world-events in 'Project Dreamscape'. The enemy spawn interval scales with the time limit, and a Manhattan distance algorithm limits the enemy spawn amount."
      //           }),
      //         ]
      //       }),
      //       projectContent.figureSet([
      //         {
      //           src: "/../../images/games/Dreamscape/projectPage/timed-events-execution-chart.jpg",
      //           alt: "A graph showing the average data from 10 simulations in the Machinations Diagram.",
      //           figId: "5",
      //           caption: "The execution chart for timed events shows, from 10 simulations, the average of each of the following values: enemy spawns per event, lands selected using Manhattan distance, and time limits per event."
      //         }
      //       ])
      //     ]
      //   }
      // },
      {
        heading: projectContent.heading3("Outbreak"),
        content: {
          left: [
            projectContent.paragraph("The original Outbreak event, formerly called 'Zones', selected a random 3x3 quadrant of lands to spawn enemies, which the player would defeat to complete the round **(Figure 4)**."),
            projectContent.paragraph(" The first problem I noticed was how this search method becomes less impactful as players expand the map. They could also minimize the search's effectiveness by building non-square layouts, which reduces how many lands would be found."),
            projectContent.paragraph("I designed & implemented a spiral search pattern that starts from an 'epicenter' land and expands outward to affect neighboring lands. The event selects the largest perfect square below the total amount of lands that exist on the map. The pattern continues until it finds the target number of lands and works with any layout the player creates **(Figure 5)**."),
            projectContent.paragraph("The redesign balances the Outbreak event's challenge throughout each stage of the game, and it encourages players to build the map strategically. The spiral search pattern solves the original event's weakness to linear map layouts by accommodating the empty grid spaces between lands."),
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/Dreamscape/projectPage/quadrant-based-selection.jpeg",
                alt: "A sketch showing how the original 'Zones' event searched for lands in a 3x3 quadrant.",
                figId: "4",
                caption: "The original quadrant-based selection randomly chose a group of up to nine lands."
              },
              {
                src: "/../../images/games/Dreamscape/projectPage/zones-search-visualizer.gif",
                alt: "A react component that plays an animation of the spiral search pattern on a randomly generated map.",
                figId: "5",
                caption: "Starting from the epicenter (E), the spiral search pattern expands to find nearby lands (green) until it reaches the target amount."
              }
            ])
          ]
        }
      },
      {
        heading: projectContent.heading3("Wanderlust"),
        content: {
          left: [
            projectContent.paragraph("The initial premise of the Wanderlust event required players to visit each land, as implied by its former name 'Visit All'. In early stages of the game, players could instant-win the round by walking through the corners of adjacent lands since the entire land area counted as a valid visit zone."),
            projectContent.paragraph("I replaced the full land zones with size-adjustable 'visit indicators' that required players to step further toward the central area of each land. Each visit indicator starts large but shrinks as its land's level increases **(Figure 6, slide 1)**. This removed the problem of only needing to take one step inside a land for the event to consider it visited."),
            projectContent.paragraph("Adjusting the criteria for visiting a land exposed another issue: the event became too demanding as the map size and lands' levels increased. I addressed this by redesigning the land selection. Rather than requiring the player to visit every land, the event now requires fewer lands relative to the map size **(Figure 6, slide 2)**."),
            projectContent.paragraph("The event's difficulty scales naturally with the progression of lands' levels, and players must now consider the level distribution as they expand the map. The red visit indicator spheres seen in **Figure 7** show how both of the changes work together.")
          ],
          flexDir: 'column',
          right: [
            projectContent.gallery({
              figId: "6",
              caption: "Slide 1 shows the equation would scale a visit indicator's radius. Slide 2 shows how the growth of required visits would account for map expansion.",
              items: [
                createMediaItem({
                  type: "image",
                  url: "/../../images/games/Dreamscape/projectPage/indicator-radius-scaling.jpeg",
                  alt: "a sketch showing a graph and equations for scaling the radius of a visit indicator inversely as its land's level increases."
                }),
                createMediaItem({
                  type: "image",
                  url: "/../../images/games/Dreamscape/projectPage/visit-indicators-scaling.jpeg",
                  alt: "a sketch showing a graph and equations for scaling the number of visit indicators relative to the number of spawned lands on the map."
                }),
              ]
            }),
            projectContent.figureSet([
              {
                src: "/../../images/games/Dreamscape/projectPage/wanderlust-changes-v2.gif",
                alt: "a snippet of gameplay from an early version of Project Dreamscape, which depicts the Wanderlust world-event generating visit indicators on the map.",
                figId: "7",
                caption: "The Wanderlust event spawns [red] visit indicators for a portion of lands on the map and adjusts each one's radius based on its land's level."
              },
            ])
          ]
        }
      },
      {
        heading: projectContent.heading2("Quest Categories & Criteria System"),
        content: {
          left: [
            projectContent.paragraph("Originally, the game selected three random [side] quests each round. Alongside the round's objective, it was unclear to players what tasks were mandatory vs. optional. This led to information overload, especially for players who were still learning the basics. Players also weren't motivated to practice new techniques because there was no incentive."),
            projectContent.paragraph("I changed the first round to start with no quests so players could focus solely on the round's objective. Quests are gradually introduced in subsequent rounds based on the player's progress. Players would encounter up to three quests per round, each of a distinct category **(Figure 8)**. I designed 19 quest templates across these categories."),
            projectContent.paragraph("Once we generated 63 quests from these templates, I developed a multi-criteria system that sorted quests by category and difficulty. The system checks if each quest is feasible (for example, not asking to use an ability that wasn't unlocked yet) before presenting it to players **(Figure 9)**."),
            projectContent.paragraph("The criteria system improved the onboarding experience by establishing the difference between mandatory and optional tasks through gradual introduction. By categorizing quests, players received challenges appropriate for their current progress.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/Dreamscape/projectPage/criteria-based-quest-selection-v2.jpg",
                alt: "A sketch showing how new quests would subsequently appear after each round in Project Dreamscape.",
                figId: "8",
                caption: "The three quest categories: Skillful teaches the basics, Aspect encourages using gained abilities, and World Event adds a twist to each round's objective."
              },
              {
                src: "/../../images/games/Dreamscape/projectPage/quest-system-progression.png",
                alt: "A 2x2 image grid showing four different states of the objective HUD. First with no quests and only the round objective, second with one skillful quest, third with a skillful and aspect quest, and fourth with 3 quests.",
                figId: "9",
                caption: "In addition to the game checking each quest's individual criteria, players also have to complete a minimum number of rounds to encounter quests in new categories."
              },
            ]),
          ]
        }
      },
    ]
  }
});

export default dreamscapeProject;
