// API Configuration
// You can change the base URL here or use environment variables

const config = {
  // Production API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://api-coffee.m-zedan.com/api',
  
  // Alternative environments (uncomment as needed)
  // API_BASE_URL: 'http://localhost:8000/api',  // Local development
  // API_BASE_URL: 'https://staging-api.coffee.test/api',  // Staging
  
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 10000,
  
  // API Endpoints
  ENDPOINTS: {
    // Public endpoints
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    BRANCHES: '/branches',
    PRODUCT_SEARCH: '/products/search',
    PRODUCT_DETAILS: '/products',
    CATEGORY_PRODUCTS: '/categories',
    BRANCH_PRODUCTS: '/branches',
    
    // Auth endpoints (for future use)
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    PROFILE: '/admin/auth/profile',
    REFRESH: '/admin/auth/refresh',
  }
};

export default config; 