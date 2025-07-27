// API Configuration
// You can change the base URL here or use environment variables

const config = {
  // Production API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Alternative environments (uncomment as needed)
  // API_BASE_URL: 'http://api-coffee.m-zedan.com/api',  // Production
  // API_BASE_URL: 'https://staging-api.coffee.test/api',  // Staging
  
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 10000,
  
  // API Endpoints from Postman Collection
  ENDPOINTS: {
    // 🔐 Public User Authentication
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      UPDATE_PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password',
      REFRESH_TOKEN: '/auth/refresh',
    },

    // 📍 Address Management
    ADDRESSES: {
      GET_USER_ADDRESSES: '/user/addresses',
      ADD_ADDRESS: '/user/addresses',
      UPDATE_ADDRESS: '/user/addresses', // + /{id}
      DELETE_ADDRESS: '/user/addresses', // + /{id}
    },

    // ❤️ Favorites Management
    FAVORITES: {
      GET_FAVORITES: '/user/favorites',
      ADD_FAVORITE: '/user/favorites',
      REMOVE_FAVORITE: '/user/favorites', // + /{id}
    },

    // 🛒 Order Management
    ORDERS: {
      GET_USER_ORDERS: '/user/orders',
      GET_ORDER_DETAILS: '/user/orders', // + /{id}
    },

    // 🚚 Order Placement & Delivery
    DELIVERY: {
      GET_DELIVERY_LOCATIONS: '/delivery-locations',
      GET_DELIVERY_FEE: '/get-delivery-fee',
      VALIDATE_PROMO_CODE: '/validate-promo-code',
      PLACE_ORDER: '/delivery-locations',
    },

    // 🛍️ Public Products
    PRODUCTS: {
      GET_PRODUCTS: '/products',
      GET_CATEGORIES: '/categories',
      GET_BRANCHES: '/branches',
      SEARCH_PRODUCTS: '/products/search',
      GET_PRODUCT_DETAILS: '/products', // + /{id}
      GET_CATEGORY_PRODUCTS: '/categories', // + /{id}/products
      GET_BRANCH_PRODUCTS: '/branches', // + /{id}/products
    },

    // 👨‍💼 Admin Authentication (if needed)
    ADMIN: {
      LOGIN: '/admin/auth/login',
      LOGOUT: '/admin/auth/logout',
      PROFILE: '/admin/auth/profile',
      PROMO_CODES: '/admin/promo-codes',
      DELIVERY_LOCATIONS: '/admin/delivery-locations',
      ORDERS: '/admin/orders',
      ONLINE_ORDERS: '/admin/orders/online',
    },

    // Additional suggested endpoints (not in Postman collection but commonly needed)
    ADDITIONAL: {
      // User Management
      CART: '/user/cart',
      WISHLIST: '/user/wishlist',
      ORDER_HISTORY: '/user/order-history',
      LOYALTY_POINTS: '/user/loyalty',
      NOTIFICATIONS: '/user/notifications',
      
      // Authentication Extended
      PASSWORD_RESET: '/auth/password-reset',
      EMAIL_VERIFICATION: '/auth/verify-email',
      SOCIAL_LOGIN: '/auth/social',
      
      // Product Extended
      REVIEWS: '/products/reviews',
      RATING: '/products/rating',
      INVENTORY_CHECK: '/products/inventory',
      NUTRITIONAL_INFO: '/products/nutrition',
      ALLERGEN_INFO: '/products/allergens',
      CUSTOMIZATIONS: '/products/customizations',
      RECOMMENDATIONS: '/menu/recommendations',
      
      // Store Information
      STORE_LOCATOR: '/stores/locations',
      STORE_HOURS: '/stores/hours',
      
      // Payment & Checkout
      PAYMENT_METHODS: '/payment-methods',
      GUEST_CHECKOUT: '/guest/checkout',
      
      // Support & Communication
      CONTACT: '/contact',
      SUPPORT_TICKETS: '/support/tickets',
      
      // Tracking & Analytics
      DELIVERY_TRACKING: '/orders/tracking',
      USER_ANALYTICS: '/user/analytics',
    }
  }
};

export default config; 