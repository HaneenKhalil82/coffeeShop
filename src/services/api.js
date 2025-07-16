
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
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// =================== PUBLIC ENDPOINTS ===================

// Products APIs
export const getProducts = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.PRODUCTS);
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.PRODUCT_DETAILS}/${id}`);
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
    
    const response = await api.get(`${config.ENDPOINTS.PRODUCT_SEARCH}?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Categories APIs
export const getCategories = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.CATEGORIES);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryProducts = async (categoryId) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.CATEGORY_PRODUCTS}/${categoryId}/products`);
    return response;
  } catch (error) {
    console.error('Error fetching category products:', error);
    throw error;
  }
};

// Branches APIs
export const getBranches = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.BRANCHES);
    return response;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const getBranchProducts = async (branchId) => {
  try {
    const response = await api.get(`${config.ENDPOINTS.BRANCH_PRODUCTS}/${branchId}/products`);
    return response;
  } catch (error) {
    console.error('Error fetching branch products:', error);
    throw error;
  }
};

// =================== AUTH ENDPOINTS ===================

export const loginUser = async (email, password) => {
  try {
    const response = await api.post(config.ENDPOINTS.LOGIN, { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post(config.ENDPOINTS.LOGOUT);
    localStorage.removeItem('auth_token');
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    localStorage.removeItem('auth_token'); // Remove token anyway
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.PROFILE);
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post(config.ENDPOINTS.REFRESH);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Register function (if needed for customer registration)
export const registerUser = async (userData) => {
  try {
    // Note: This endpoint is not in the Postman collection
    // You might need to add it to the API or handle registration differently
    const response = await api.post('/register', userData);
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
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

export default api;
