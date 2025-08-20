import Cookies from 'js-cookie';

// Cookie configuration constants
export const COOKIE_OPTIONS = {
  expires: 7, // Cookie expires in 7 days
  secure: process.env.NODE_ENV === 'production', // Secure in production
  sameSite: 'strict' // Protect against CSRF attacks
};

// Cookie key constants
export const USER_COOKIE_KEY = 'user_credentials';
export const USER_STATE_COOKIE_KEY = 'user_state';

/**
 * Stores user credentials and state in cookies
 *
 * @param {Object} userData - User data to store
 * @param {string} credentials - Encoded credentials
 */
export const storeUserInCookies = (userData, credentials) => {
  try {
    // Store encoded credentials
    Cookies.set(USER_COOKIE_KEY, credentials, COOKIE_OPTIONS);

    // Store user state (excluding credentials for security)
    const userStateForStorage = {
      id: userData.id,
      emailAddress: userData.emailAddress,
      firstName: userData.firstName,
      lastName: userData.lastName
    };
    Cookies.set(USER_STATE_COOKIE_KEY, JSON.stringify(userStateForStorage), COOKIE_OPTIONS);

    return true;
  } catch (error) {
    console.error('Error storing user in cookies:', error);
    return false;
  }
};

/**
 * Retrieves user credentials from cookies
 *
 * @returns {string|null} Encoded credentials or null if not found
 */
export const getUserCredentialsFromCookies = () => {
  try {
    return Cookies.get(USER_COOKIE_KEY) || null;
  } catch (error) {
    console.error('Error retrieving user credentials from cookies:', error);
    return null;
  }
};

/**
 * Retrieves user state from cookies
 *
 * @returns {Object|null} User state object or null if not found
 */
export const getUserStateFromCookies = () => {
  try {
    const storedState = Cookies.get(USER_STATE_COOKIE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user state from cookies:', error);
    return null;
  }
};

/**
 * Clears all user-related cookies
 */
export const clearUserCookies = () => {
  try {
    Cookies.remove(USER_COOKIE_KEY);
    Cookies.remove(USER_STATE_COOKIE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user cookies:', error);
    return false;
  }
};

/**
 * Checks if user cookies exist and are valid
 *
 * @returns {boolean} True if cookies exist, false otherwise
 */
export const hasValidUserCookies = () => {
  try {
    const credentials = Cookies.get(USER_COOKIE_KEY);
    const userState = Cookies.get(USER_STATE_COOKIE_KEY);
    return !!(credentials && userState);
  } catch (error) {
    console.error('Error checking user cookies:', error);
    return false;
  }
};

/**
 * Gets cookie expiration date
 *
 * @returns {Date} Date when cookies will expire
 */
export const getCookieExpirationDate = () => {
  const now = new Date();
  return new Date(now.getTime() + (COOKIE_OPTIONS.expires * 24 * 60 * 60 * 1000));
};
