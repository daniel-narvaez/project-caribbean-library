import { createGameProject } from "../createGameProject";
import { projectContent } from "../../utils/contentBuilder";
import { createMediaItem } from "../HeroMedia";

const chihuahuaChampProject = createGameProject({
  title: 'Chihuahua Champ',
  urls: {
    game: 'https://daniel-narvaez.itch.io/chihuahua-champ',
    jamPage: 'https://itch.io/jam/gamedevjs-2024',
    machinationsDiagram: 'https://machinations.io/community/narvd997/powerlifting-system-0a0cb761c498c3352e810878bc3e46632',
    jamResults: 'https://itch.io/jam/gamedevjs-2024/rate/2626657',
    playcrafting: 'https://playcrafting.com/',
  },
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
  },
  projectPage: {
    main: (
      projectContent.titleFrame(
        { src: '/../../images/games/ChihuahuaChamp/projectPage/ChihuahuaChamp-Logo.png', alt: 'Clock Out!! logo.'},
        { src: '/../../images/games/ChihuahuaChamp/projectPage/ChihuahuaChamp-MoneyShot.gif', alt: 'The Opening Sequence of Chihuahua Champ, showing the player character and Pookie on the couch watching TV.'}
      )    
    ),
    walkthrough: [
      {
        heading: projectContent.heading2('Project Overview'),
        content: {
          left: [
            projectContent.details([
              { key: 'Platforms', value: 'Web Browser, MacOS, Windows' },
              { key: 'Duration', value: '2 months' },
              { key: 'Team Size', value: '5'},
              { key: 'Builds', value: ({ urls }) => `[Itch](${urls.game})`}
            ]),
            projectContent.heading3('Contributions'),
            projectContent.list({
              type: 'bullet',
              items: [
                "Designed and implemented a progression system that guided the player journey through interconnected training and competition game modes.",
                "Implemented a stamina mechanic in Unity that increased gameplay challenge over time and created natural progression gates as players built their strength.",
                "Led development from game jam prototype to finished product by coordinating team meetings and managing the project schedule throughout a 2-month timeline.",
              ]
            })
          ],
          right: [
            projectContent.video({
              src:'https://player.vimeo.com/video/1062995124?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
              title: 'Chihuahua Champ Gameplay',
              width: '100%',
              height: '100%'
            })
          ]
        }
      },
      {
        heading: projectContent.heading2('System-Driven Player Journey'),
        content: {
          left: [
            projectContent.paragraph(({ urls }) => `The theme of [Gamedev.js Jam 2024](${urls.jamPage}) was 'Power'. We brainstormed how we might make a game about strength training, a repetitive activity by nature, while designing a core loop that made repetition engaging and rewarding.`),
            projectContent.paragraph("I designed the player journey to revolve around increasing strength by creating two complementary game modes **(Figure 1)**. Training mode let players set weights and complete reps at their own pace for experience points, while Competition mode provided structured challenges at preset weights that increased with each victory, rewarding first-time completions with unique prizes."),
            projectContent.paragraph(({ urls }) => `To validate this design, I mapped the core gameplay loop in a [Machinations diagram](${urls.machinationsDiagram}) **(Figure 2)**. The diagram simulates a player in Training mode attempting to lift weight relative to their strength level. Failing a rep ends the exercise and awards experience points based on their performance.`),
            projectContent.paragraph("This design translated repetitive exercise mechanics into a gameplay experience with meaningful choices and quantifiable goals. The system also simulated real strength training, where athletes alternate between constant practice and competitive challenges.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ChihuahuaChamp/projectPage/player-journey-v2.png",
                alt: "A flowchart showing the player journey of Chihuahua Champ between the training and competition game modes.",
                figId: "1",
                caption: "Players grow their character's strength levels in training mode, and they'd enter competitions to win prizes.",
              },
              {
                src: "/../../images/games/ChihuahuaChamp/projectPage/powerlifting-system.gif",
                alt: "A Machinations Diagram modeling the exercise loop of Chihuahua Champ.",
                figId: "2",
                caption: "The player sets a weight relative to their strength level and is more likely to complete exercises the lighter they set.",
              },
            ])
          ]
        }
      },
      {
        heading: projectContent.heading2('Perceived Weight Intensity: Simulating Physical Fatigue'),
        content: {
          left: [
            projectContent.paragraph("While the Machinations diagram validated my design with static probabilities, real powerlifting involves progressive fatigue. As a web browser game developed in Unity, we needed to translate diminishing stamina into keyboard-based gameplay that made players feel the increasing intensity."),
            projectContent.paragraph("Players would perform exercises by rapidly inputting keyboard commands. By analyzing average clicking speeds, I determined that 4-6 clicks per rep created a base difficulty that felt challenging but achievable. This informed the Perceived Weight Intensity formula, which scaled difficulty based on exercise duration and relative weight **(Figure 3)**."),
            projectContent.paragraph("The recorded gameplay demonstrates how players must press keys more rapidly over time to outpace the depleting Rep Meter **(Figure 4)**. This mechanic generated both virtual and physical fatigue through its accelerating input demands.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ChihuahuaChamp/projectPage/perceived-weight-intensity.png",
                alt: "The formula for calculating perceived weight intensity used in Chihuahua Champ: P(w,L,Δt) = 0.003(w/L)Δt + 0.01",
                figId: "3",
                caption: "Formula for calculating perceived weight intensity based on current weight (w), strength level (L), and time interval (Δt).",
              },
              {
                src: "/../../images/games/ChihuahuaChamp/projectPage/pwi-demo.gif",
                alt: "A gif of me pressing my keyboard in order to complete reps in Chihuahua Champ.",
                figId: "4",
                caption: "The Rep Meter fills with each key press but depletes faster over time, requiring more rapid inputs."
              }
            ])
          ]
        }
      },
      // {
      //   heading: projectContent.heading('Project Leadership'),
      //   content: {
      //     left: [
      //       projectContent.paragraph(({ urls }) => `Our ambitious scope for the 2-week game jam led to *Chihuahua Champ* placing [119th out of 229 entries](${urls.jamResults}). Despite this result, strong team synergy and the game's potential motivated us to continue development for a public exhibition.`),
      //       projectContent.paragraph("I led our team through a postmortem session that identified our key priorities moving forward. These included polishing the user interface, adding unused assets, and implementing the intended Competition mode. Through team meetings, I guided development to meet our exhibition timeline."),
      //       projectContent.paragraph(({ urls }) => `Development lasted a total of 2 months. The updated version we showed at [Playcrafting's](${urls.playcrafting}) NYC Indie Dev Night excited attendees enough to continue playing after the exhibition. This reception validated the game's transition from a jam prototype to a finished product.`)
      //     ],
      //     right: [
      //       projectContent.figureSet([
      //         {
      //           src: "/../../images/games/ChihuahuaChamp/projectPage/indie-dev-night.jpg",
      //           alt: "a picture of our booth for playing Chihuahua Champ at NYC Indie Dev Night.",
      //           figId: "5",
      //           caption: "We exhibited Chihuahua Champ at NYC Indie Dev Night using a Mac Mini and Logitech G peripherals."
      //         },
      //       ]),
      //       projectContent.figureSet([
      //         {
      //           src: "/../../images/games/ChihuahuaChamp/projectPage/promo-poster.jpg",
      //           alt: "a promotional poster featuring the player character and Pitt from Chihuahua Champ.",
      //           figId: "6",
      //           caption: "A promotional poster our artist prepared for the exhibition."
      //         },
      //       ]),
      //     ]
      //   }
      // },
    ]
  }
});

export default chihuahuaChampProject;