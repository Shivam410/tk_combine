/**
 * Application Configuration
 * Centralized configuration for the frontend application
 */

export const config = {
  // API Base URL from environment variables
  baseUrl: import.meta.env.VITE_BASE_URL,
  
  // API Endpoints
  api: {
    visitors: '/visitors/increment',
  },
  
  // Application Info
  app: {
    name: 'TK Production Film',
    tagline: 'Best Photography & Cinematography Services',
  },
  
  // SEO Defaults
  seo: {
    defaultTitle: 'TK Production Film | Best Photography & Cinematography Services',
    defaultDescription: 'Capture your special moments with TK Production Film – expert wedding, pre-wedding, engagement, and event photography. Book your service today!',
    defaultKeywords: 'photography, cinematography, wedding photography, pre-wedding film, baby shower photography, birthday photography, civil marriage photos, engagement portraits, TK Production Film',
  },
};

// Re-export for convenience
export const baseUrl = config.baseUrl;

export default config;
