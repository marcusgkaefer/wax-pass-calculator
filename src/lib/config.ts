// Environment configuration
export const config = {
  // Determine if we should use mock data
  useMockData: !import.meta.env.VITE_ZENOTI_API_KEY || import.meta.env.VITE_USE_MOCK_DATA === 'true',
  
  // Environment variables are required for API access
  // Make sure to create a .env file based on .env.example
  zenoti: {
    apiKey: (() => {
      const apiKey = import.meta.env.VITE_ZENOTI_API_KEY;
      // Don't throw error if we're using mock data
      if (!apiKey && !import.meta.env.VITE_USE_MOCK_DATA) {
        console.warn(
          'VITE_ZENOTI_API_KEY is not set. Using mock data instead. ' +
          'To use real API, please create a .env file and add your API key.'
        );
      }
      return apiKey || '';
    })(),
    baseUrl: import.meta.env.VITE_ZENOTI_API_BASE_URL || 'https://api.zenoti.com/v1',
  },
  // Cache configuration
  cache: {
    centersKey: 'zenoti_centers_cache',
    servicesKey: 'zenoti_services_cache',
    expirationTime: 1000 * 60 * 60, // 1 hour in milliseconds
  }
} as const;

// Type for configuration
export type Config = typeof config; 