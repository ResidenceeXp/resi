/**
 * Theme utilities for Resi
 * Provides functions to determine the appropriate logo and styling based on the theme
 */

/**
 * Determines if the current theme is dark based on the background color
 * @param {string} backgroundColor - The CSS background color value
 * @returns {boolean} True if the theme is dark, false if light
 */
export const isDarkTheme = (backgroundColor) => {
  // For this app, dark theme is indicated by black or very dark backgrounds
  const darkIndicators = ['#000000', '#000', 'black', '#1a1a1a'];
  return darkIndicators.some(indicator =>
    backgroundColor?.toLowerCase?.() === indicator.toLowerCase()
  );
};

/**
 * Returns the appropriate logo filename based on the theme
 * @param {string} backgroundColor - The CSS background color value
 * @returns {string} The path to the appropriate logo file
 */
export const getLogoForTheme = (backgroundColor) => {
  // If dark background, use white/transparent logo
  // If light background, use original dark logo
  return isDarkTheme(backgroundColor) ? '/resi-logo-white.png' : '/resi-logo.png';
};

/**
 * Returns the appropriate logo filename based on container background
 * Useful for components that know their container's background color
 * @param {boolean} isDark - Whether the theme is dark
 * @returns {string} The path to the appropriate logo file
 */
export const getLogoBooleanTheme = (isDark) => {
  return isDark ? '/resi-logo-white.png' : '/resi-logo.png';
};
