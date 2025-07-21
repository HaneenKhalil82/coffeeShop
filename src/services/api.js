
import axios from "axios";
import config from "../config/api.config.js";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =================== 🔐 PUBLIC USER AUTHENTICATION ===================

export const registerUser = async (userData) => {
  try {
    const { name, email, mobile, password, password_confirmation } = userData;
    const response = await api.post(config.ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      mobile: mobile || userData.phone, // Support both mobile and phone field names
      password,
      password_confirmation: password_confirmation || password
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post(config.ENDPOINTS.AUTH.LOGIN, { email, password });
    if (response.data.access_token || response.data.token) {
      const token = response.data.access_token || response.data.token;
      localStorage.setItem('auth_token', token);
    }
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post(config.ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.AUTH.PROFILE);
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put(config.ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.post(config.ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return response;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post(config.ENDPOINTS.AUTH.REFRESH_TOKEN);
    if (response.data.access_token || response.data.token) {
      const token = response.data.access_token || response.data.token;
      localStorage.setItem('auth_token', token);
    }
    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// =================== 📍 ADDRESS MANAGEMENT ===================

export const getUserAddresses = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.ADDRESSES.GET_USER_ADDRESSES);
    return response;
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

export const addAddress = async (addressData) => {
  try {
    const response = await api.post(config.ENDPOINTS.ADDRESSES.ADD_ADDRESS, addressData);
    return response;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`${config.ENDPOINTS.ADDRESSES.UPDATE_ADDRESS}/${addressId}`, addressData);
    return response;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`${config.ENDPOINTS.ADDRESSES.DELETE_ADDRESS}/${addressId}`);
    return response;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// =================== ❤️ FAVORITES MANAGEMENT ===================

export const getUserFavorites = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.FAVORITES.GET_FAVORITES);
    return response;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
};

export const addToFavorites = async (productId) => {
  try {
    const response = await api.post(config.ENDPOINTS.FAVORITES.ADD_FAVORITE, { product_id: productId });
    return response;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (favoriteId) => {
  try {
    const response = await api.delete(`${config.ENDPOINTS.FAVORITES.REMOVE_FAVORITE}/${favoriteId}`);
    return response;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// =================== 🛒 ORDER MANAGEMENT ===================

export const getUserOrders = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.ORDERS.GET_USER_ORDERS);
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.ORDERS.GET_ORDER_DETAILS}/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// =================== 🚚 ORDER PLACEMENT & DELIVERY ===================

export const getDeliveryLocations = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.DELIVERY.GET_DELIVERY_LOCATIONS);
    return response;
  } catch (error) {
    console.error('Error fetching delivery locations:', error);
    throw error;
  }
};

export const getDeliveryFee = async (userAddressId) => {
  try {
    const response = await api.post(config.ENDPOINTS.DELIVERY.GET_DELIVERY_FEE, {
      user_address_id: userAddressId
    });
    return response;
  } catch (error) {
    console.error('Error fetching delivery fee:', error);
    throw error;
  }
};

export const validatePromoCode = async (code, orderAmount) => {
  try {
    const response = await api.post(config.ENDPOINTS.DELIVERY.VALIDATE_PROMO_CODE, {
      code,
      order_amount: orderAmount
    });
    return response;
  } catch (error) {
    console.error('Error validating promo code:', error);
    throw error;
  }
};

export const placeOrder = async (orderData) => {
  try {
    const response = await api.post(config.ENDPOINTS.DELIVERY.PLACE_ORDER, orderData);
    return response;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// =================== 🛍️ PUBLIC PRODUCTS ===================

export const getProducts = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.PRODUCTS.GET_PRODUCTS);
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.PRODUCTS.GET_PRODUCT_DETAILS}/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const searchProducts = async (searchParams = {}) => {
  try {
    const { q, category_id, branch_id, min_price, max_price } = searchParams;
    const params = new URLSearchParams();
    
    if (q) params.append('q', q);
    if (category_id) params.append('category_id', category_id);
    if (branch_id) params.append('branch_id', branch_id);
    if (min_price) params.append('min_price', min_price);
    if (max_price) params.append('max_price', max_price);
    
    const response = await api.get(`${config.ENDPOINTS.PRODUCTS.SEARCH_PRODUCTS}?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.PRODUCTS.GET_CATEGORIES);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryProducts = async (categoryId) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.PRODUCTS.GET_CATEGORY_PRODUCTS}/${categoryId}/products`);
    return response;
  } catch (error) {
    console.error('Error fetching category products:', error);
    throw error;
  }
};

export const getBranches = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.PRODUCTS.GET_BRANCHES);
    return response;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const getBranchProducts = async (branchId) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.PRODUCTS.GET_BRANCH_PRODUCTS}/${branchId}/products`);
    return response;
  } catch (error) {
    console.error('Error fetching branch products:', error);
    throw error;
  }
};

// =================== 👨‍💼 ADMIN ENDPOINTS (if needed) ===================

export const adminLogin = async (email, password) => {
  try {
    const response = await api.post(config.ENDPOINTS.ADMIN.LOGIN, { email, password });
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Error admin login:', error);
    throw error;
  }
};

// =================== UTILITY FUNCTIONS ===================

// Function to handle image URLs (in case API returns relative paths)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${config.API_BASE_URL.replace('/api', '')}${imagePath}`;
};

// Function to format price (utility)
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

// Function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1
    };
  }
};

export default api;
