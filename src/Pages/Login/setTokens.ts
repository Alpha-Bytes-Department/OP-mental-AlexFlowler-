// Utility functions for token management with both localStorage and cookies

export const setTokens = (accessToken:string, refreshToken:string) => {
  // Store in localStorage for client-side access
  if (typeof window !== 'undefined') {
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
    
    // Store token timestamp for expiration checking
    const now = new Date().getTime();
    localStorage.setItem('tokenTimestamp', now.toString());
  }
  
  // Store in cookies for server-side middleware access
  // Access token: 1 hour (3600 seconds)
  // Refresh token: 7 days (7 * 24 * 60 * 60 = 604800 seconds)
  document.cookie = `access=${accessToken}; path=/; max-age=${60 * 60}; samesite=strict`;
  document.cookie = `refresh=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
};

export const getTokens = () => {
  if (typeof window === 'undefined') return { access: null, refresh: null };
  
  return {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh')
  };
};

export const removeTokens = () => {
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('tokenTimestamp');
  }
  
  // Remove from cookies
  document.cookie = 'access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const isAuthenticated = () => {
  const tokens = getTokens();
  return !!(tokens.access || tokens.refresh);
};

// Check if access token is expired (assuming 1 hour expiration)
export const isAccessTokenExpired = () => {
  if (typeof window === 'undefined') return true;
  
  const timestamp = localStorage.getItem('tokenTimestamp');
  if (!timestamp) return true;
  
  const tokenTime = parseInt(timestamp);
  const now = new Date().getTime();
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  
  return (now - tokenTime) > oneHour;
};

// Check if we should refresh the token (refresh 5 minutes before expiration)
export const shouldRefreshToken = () => {
  if (typeof window === 'undefined') return false;
  
  const timestamp = localStorage.getItem('tokenTimestamp');
  if (!timestamp) return false;
  
  const tokenTime = parseInt(timestamp);
  const now = new Date().getTime();
  const fiftyFiveMinutes = 55 * 60 * 1000; // 55 minutes in milliseconds
  
  return (now - tokenTime) > fiftyFiveMinutes;
};
