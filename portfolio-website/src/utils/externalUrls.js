/**
 * Determines if a URL is external to the current website
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is external, false otherwise
 */
export const isExternalUrl = (url) => {
  // Handle empty or invalid URLs
  if (!url || typeof url !== 'string') return false;

  // Handle relative URLs
  if (url.startsWith('/') || url.startsWith('#')) return false;

  try {
    // Create URL objects for comparison
    const currentLocation = new URL(window.location.href);
    const urlToCheck = new URL(url, window.location.href);

    // Compare hostnames to determine if external
    return currentLocation.hostname !== urlToCheck.hostname;
  } catch (e) {
    // If URL parsing fails, consider it internal for safety
    console.warn(`Error parsing URL: ${url}`, e);
    return false;
  }
};

/**
 * Gets appropriate link attributes for a URL
 * @param {string} url - The URL to generate attributes for
 * @returns {Object} - Object containing appropriate link attributes
 */
export const getLinkAttributes = (url) => {
  const isExternal = isExternalUrl(url);
  
  return {
    target: isExternal ? '_blank' : undefined,
    rel: isExternal ? 'noopener noreferrer' : undefined
  };
};