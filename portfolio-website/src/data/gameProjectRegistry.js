import clockOutProject from "./gameProjects/clockOut";
import chihuahuaChampProject from "./gameProjects/chihuahuaChamp";
import theHexPerplexProject from "./gameProjects/theHexPerplex";
import dreamscapeProject from "./gameProjects/dreamscape";

// Initialize registry with error handling
const initializeRegistry = () => {
  try {
    return {
      clockOut: clockOutProject,
      chihuahuaChamp: chihuahuaChampProject,
      theHexPerplex: theHexPerplexProject,
      dreamscape: dreamscapeProject,
    };
  } catch (error) {
    console.error('Failed to initialize game projects registry:', error);
    return {};
  }
};

export const gameProjectsData = initializeRegistry();

export const featuredProjectsData = [
  gameProjectsData.dreamscape,
  gameProjectsData.chihuahuaChamp,
  gameProjectsData.clockOut,
]

export const getGameProjectByPath = (path) => {
  return Object.values(gameProjectsData).find(project => project.path === path);
};