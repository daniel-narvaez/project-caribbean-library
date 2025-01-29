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

/**********************************
* GAME PROJECTS
**********************************/

export const clockOutProject = createGameProject({
  title: 'Clock Out!!',
  urls: {
    game: 'https://daniel-narvaez.itch.io/clock-out',
    appStore: 'https://apps.apple.com/us/app/clock-out/id1570676915',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.MassDiGI.Creme',
    kitamuraRule: 'https://shmuplations.com/megaman/',
    machinationsDiagram: 'https://machinations.io/community/narvd997/intern-vs-boss-types-0cc9a10323ed0de43b76485703b936017'
  },
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
  },
  projectPage: {
    main: (
      projectContent.titleFrame(
        { src: '/../../images/games/ClockOut/projectPage/ClockOut-Logo.png', alt: 'Clock Out!! logo.'},
        { src: '/../../images/games/ClockOut/projectPage/ClockOut-MoneyShot.gif', alt: 'A snippet of the Clock Out!! trailer video, where JoJo and Herbert Bamboo are in the elevator together.'}
      )
    ),
    walkthrough: [
      {
        heading: projectContent.heading('Project Overview'),
        content: {
          left: [
            projectContent.details([
              { key: 'Platforms', value: 'iOS, iPadOS, Android' },
              { key: 'Duration', value: '3 months' },
              { key: 'Team Size', value: '7'},
              { key: 'Builds', value: ({ urls }) => `[App Store](${urls.appStore}), [Google Play](${urls.googlePlay})`}
            ]),
            projectContent.subheading('Contributions'),
            projectContent.list({
              type: 'bullet',
              items: [
                'Engineered an asymmetrical progression model to drive increased difficulty through exponential scaling within project scope.',
                'Designed a weighted-random upgrades system that gave 17 characters distinguishable fighting styles despite sharing the same combat actions.',
                'Developed a combat-driven economy to replace automatic stat progression and restore difficulty scaling.',
                'Conceptualized UI layouts to ensure controls, information, and colors communicated to players the functions of each.'
              ]
            })
          ],
          right: [
            projectContent.video({
              src: 'https://player.vimeo.com/video/771629392?h=c1e68303ca&badge=0&autopause=0&player_id=0&app_id=58479',
              title: 'Clock Out!! Trailer',
              width: '100%',
              height: '100%'
            })
          ],
        }
      },
      {
        heading: projectContent.heading('Stat Progression System'),
        content: {
          left: [
            projectContent.paragraph("In a fighting game with only 4 combat actions, we needed a way to create increasingly difficult boss encounters that didn’t depend on complex mechanics."),
            projectContent.paragraph("I designed a stat system with 5 core attributes **[Figure 1]**: health (HP), stamina (SP), power (POW), defense (DEF), and agility (AGI). I also implemented different scaling rates between the player character and bosses. The player (Intern) started with higher base stats but grew linearly, while bosses began weaker but scaled exponentially with each encounter."),
            projectContent.paragraph(({ urls }) => `Taking inspiration from [Akira Kitamura's design rules for Mega Man 1 & 2 (NES)](${urls.kitamuraRule}), I modified the exponential curve so that every 4th boss had fewer stat upgrades than the previous **[Figure 2]**. I designed this pattern to reinforce players' sense of improvement.`),
            projectContent.paragraph("These choices created an environment where players could focus on learning the controls in early fights, but later encounters became more challenging through asymmetrical growth. The shark tooth pattern provided relief for players after overcoming a challenging fight.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ClockOut/projectPage/stat-icons.jpg",
                alt: "An image of the five different stat icons in Clock Out!! accompanied by their abbreviated names.",
                figId: "1",
                caption: "Each stat has an icon and abbreviation."
              }
            ]),
            projectContent.figureSet([
              {  
                src: "/../../images/games/ClockOut/projectPage/hp-vs-encounters.png", 
                alt: "A line graph showing the relationship between the progression of the player's Max Health stat vs the boss's Max Health stat.",
                figId: "2a",
                caption: "The boss's Max HP surpasses the Intern's after 12 encounters."
              },
              {
                src: "/../../images/games/ClockOut/projectPage/pow-vs-encounters.png", 
                alt: "A line graph showing the relationship between the progression of the player's Power stat vs the boss's Power stat.",
                figId: "2b",
                caption: "The boss's POW surpasses the Intern's after 11 encounters."
              },
              {
                src: "/../../images/games/ClockOut/projectPage/agi-vs-encounters.png", 
                alt: "A line graph showing the relationship between the progression of the player's Agility stat vs the boss's Agility stat.",
                figId: "2c",
                caption: "The boss's AGI surpasses the Intern's after 10 encounters."
              }
            ])
          ]
        }
      },
      {
        heading: projectContent.heading('Weighted Stat Upgrades'),
        content: {
          left: [
            projectContent.paragraph("The artists created 17 unique boss characters, and we wanted each one to fight differently. Our original stat system increased enemy power exponentially, but every boss felt the same to fight because they all shared identical stat distributions regardless of which one spawned."),
            projectContent.paragraph(({ urls }) => `I designed four types (agile, burly, strong, and all-around) and gave each one favored stats that were more likely to increase than others. Then I reworked the progression system so bosses only upgraded three random stats between fights instead of all five, with each stat's upgrade probability weighted by their type. I made the [Machinations diagram](${urls.machinationsDiagram}) to simulate these changes.`),
            projectContent.paragraph("This created more diversity in the boss roster. Each body type played differently in combat, even though they all used the same four combat actions. The randomized stat upgrades added variety to repeated playthroughs since the same boss could have different strengths each time the player encountered them.")
          ],
          right: [
            projectContent.gallery(
              {
                figId: "3",
                caption: "Weighted upgrade chances based on boss type",
                items: [
                  createMediaItem({
                    type: "gif",
                    url: "/../../images/games/ClockOut/projectPage/agile-stat-upgrades.gif",
                    alt: "A Machinations diagram showing the stat upgrade probabilities of agile-type bosses in Clock Out!!"
                  }),
                  createMediaItem({
                    type: "gif",
                    url: "/../../images/games/ClockOut/projectPage/burly-stat-upgrades.gif",
                    alt: "A Machinations diagram showing the stat upgrade probabilities of burly-type bosses in Clock Out!!"
                  }),
                  createMediaItem({
                    type: "gif",
                    url: "/../../images/games/ClockOut/projectPage/strong-stat-upgrades.gif",
                    alt: "A Machinations diagram showing the stat upgrade probabilities of strong-type bosses in Clock Out!!"
                  }),
                ]
              }
            )
          ]
        }
      },
      {
        heading: projectContent.heading('Job Experience Economy System'),
        content: {
          left: [
            projectContent.paragraph("After implementing boss types, we discovered another balance issue. The Intern upgraded all five stats after every fight, but bosses only upgraded three. This meant bosses couldn't scale fast enough to create proper challenge, which broke the game’s difficulty curve."),
            projectContent.paragraph("I thought of two solutions, and tested one at a time:"),
            projectContent.list({
              type: 'numbered',
              items: [
                "Lower the Intern's base stats and growth rate",
                "Replace the Intern's automatic stat upgrades with a player-driven system"
              ]
            }),
            projectContent.paragraph("Early playtests showed the first option didn't work because players felt no meaningful progression between the early and late stages of the game. So, I designed an economy system where players earn 'job experience' based on a combat performance report **[Figure 4]**. Players could spend job experience between fights to manually upgrade, i.e. increase, their stats through a résumé interface **[Figure 5]**."),
            projectContent.paragraph("The new economy solved our scaling issues and added two benefits: players earned enough job experience per fight to keep up with boss difficulty, and they gained control over their own challenge level since upgrades became optional.")
          ],
          right: [
            projectContent.figureSet([
              {
                src: "/../../images/games/ClockOut/projectPage/performance-report.gif",
                alt: "a gif featuring the performance report screen at the end of a fight in Clock Out!!",
                figId: "4",
                caption: "The Performance Report. Players earn job experience based on their landed punches and successful blocks.",
              },
              {
                src: "/../../images/games/ClockOut/projectPage/update-resume.gif",
                alt: "a gif featuring the résumé screen in Clock Out!!, where players can spend job experience to upgrade their stats.",
                figId: "5",
                caption: "The Résumé. Players spend their job experience to upgrade, i.e. increase, their stats.",
              }
            ])
          ]
        }
      },
    ]
  }
});

export const chihuahuaChampProject = createGameProject({
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
        heading: projectContent.heading('Project Overview'),
        content: {
          left: [
            projectContent.details([
              { key: 'Platforms', value: 'Web Browser, MacOS, Windows' },
              { key: 'Duration', value: '2 months' },
              { key: 'Team Size', value: '5'},
              { key: 'Builds', value: ({ urls }) => `[Itch](${urls.game})`}
            ]),
            projectContent.subheading('Contributions'),
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
              src:'https://player.vimeo.com/video/1051676680?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
              title: 'Chihuahua Champ Gameplay',
              width: '100%',
              height: '100%'
            })
          ]
        }
      },
      {
        heading: projectContent.heading('System-Driven Player Journey'),
        content: {
          left: [
            projectContent.paragraph(({ urls }) => `The theme of [Gamedev.js Jam 2024](${urls.jamPage}) was 'Power'. We brainstormed how we might make a game about strength training, a repetitive activity by nature, while designing a core loop that made repetition engaging and rewarding.`),
            projectContent.paragraph("I designed the player journey **[Figure 1]** to revolve around increasing strength by creating two complementary game modes. Training mode let players set weights and complete reps at their own pace for experience points, while Competition mode provided structured challenges at preset weights that increased with each victory, rewarding first-time completions with unique prizes."),
            projectContent.paragraph(({ urls }) => `To validate this design, I mapped the core gameplay loop in a [Machinations diagram](${urls.machinationsDiagram}) **[Figure 2]**. The diagram simulates a player in Training mode attempting to lift weight relative to their strength level. Failing a rep ends the exercise and awards experience points based on their performance.`),
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
        heading: projectContent.heading('Perceived Weight Intensity: Simulating Physical Fatigue'),
        content: {
          left: [
            projectContent.paragraph("While the Machinations diagram validated my design with static probabilities, real powerlifting involves progressive fatigue. As a web browser game developed in Unity, we needed to translate diminishing stamina into keyboard-based gameplay that made players feel the increasing intensity."),
            projectContent.paragraph("Players would perform exercises by rapidly inputting keyboard commands. By analyzing average clicking speeds, I determined that 4-6 clicks per rep created a base difficulty that felt challenging but achievable. This informed the Perceived Weight Intensity formula **[Figure 3]**, which scaled difficulty based on exercise duration and relative weight."),
            projectContent.paragraph("The recorded gameplay **[Figure 4]** demonstrates how players must press keys more rapidly over time to outpace the depleting Rep Meter. This mechanic generated both virtual and physical fatigue through its accelerating input demands.")
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
      {
        heading: projectContent.heading('Exhibition (Working Title)'),
        content: {
          left: [
            projectContent.paragraph(({ urls }) => `Our ambitious scope for the 2-week game jam led to *Chihuahua Champ* placing [119th out of 229 entries](${urls.jamResults}). Despite this result, strong team synergy and the game's potential motivated us to continue development for a public exhibition.`),
            projectContent.paragraph("I led our team through a postmortem session to identify successes and opportunities. We prioritized polishing the user interface, menu navigation, and implementing Competition mode, features originally planned for the game jam. Through regular team meetings, I guided development to meet our exhibition timeline."),
            projectContent.paragraph(({ urls }) => `We expanded the game over 2 months and exhibited the updated version at [Playcrafting's](${urls.playcrafting}) NYC Indie Dev Night, which marked its transition from a jam prototype to a finished product.`)
          ],
          right: [

          ]
        }
      },
    ]
  }
});

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

export const projectArticlesData = [clockOutProject.projectArticle, chihuahuaChampProject.projectArticle, theHexPerplexProject.projectArticle];

export const gameProjectsData = {
  clockOut: clockOutProject,
  chihuahuaChamp: chihuahuaChampProject,
  theHexPerplex: theHexPerplexProject
};

export const getGameProjectByPath = function(path) {
  return Object.values(gameProjectsData).find(project => project.path === path);
};