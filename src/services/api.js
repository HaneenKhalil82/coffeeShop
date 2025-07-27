
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
    console.error('Error getting user addresses:', error);
    throw error;
  }
};

export const addUserAddress = async (addressData) => {
  try {
    const response = await api.post(config.ENDPOINTS.ADDRESSES.ADD_ADDRESS, addressData);
    return response;
  } catch (error) {
    console.error('Error adding user address:', error);
    throw error;
  }
};

export const updateUserAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`${config.ENDPOINTS.ADDRESSES.UPDATE_ADDRESS}/${addressId}`, addressData);
    return response;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};

export const deleteUserAddress = async (addressId) => {
  try {
    const response = await api.delete(`${config.ENDPOINTS.ADDRESSES.DELETE_ADDRESS}/${addressId}`);
    return response;
  } catch (error) {
    console.error('Error deleting user address:', error);
    throw error;
  }
};

// =================== 🚚 ORDER PLACEMENT & DELIVERY ===================

// API Health Check
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    console.error('API Health Check failed:', error);
    throw error;
  }
};

export const getDeliveryLocations = async () => {
  try {
    console.log('📍 API: Getting delivery locations');
    
    const response = await api.get(config.ENDPOINTS.DELIVERY.GET_DELIVERY_LOCATIONS);
    
    console.log('✅ API: Delivery locations response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error getting delivery locations:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    
    // Enhanced error handling
    if (error.response?.status >= 500) {
      throw new Error('Server error fetching delivery locations');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch delivery locations');
    }
  }
};

export const getDeliveryFee = async (userAddressId) => {
  try {
    console.log('🚚 API: Getting delivery fee for address:', userAddressId);
    
    const response = await api.post(config.ENDPOINTS.DELIVERY.GET_DELIVERY_FEE, {
      user_address_id: userAddressId
    });
    
    console.log('✅ API: Delivery fee response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error getting delivery fee:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    
    // Enhanced error handling
    if (error.response?.status === 422) {
      throw new Error('Invalid address ID provided');
    } else if (error.response?.status === 404) {
      throw new Error('Address not found or delivery not available to this location');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error calculating delivery fee');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to calculate delivery fee');
    }
  }
};

export const validatePromoCode = async (code, orderAmount) => {
  try {
    console.log('🎫 API: Validating promo code:', code, 'for amount:', orderAmount);
    
    const response = await api.post(config.ENDPOINTS.DELIVERY.VALIDATE_PROMO_CODE, {
      code: code,
      order_amount: orderAmount
    });
    
    console.log('✅ API: Promo code validation response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error validating promo code:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    
    // Enhanced error handling
    if (error.response?.status === 422) {
      throw new Error('Invalid promo code format');
    } else if (error.response?.status === 404) {
      throw new Error('Promo code not found');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Promo code cannot be applied');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error validating promo code');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to validate promo code');
    }
  }
};

export const placeOrder = async (orderData) => {
  try {
    console.log('🚚 API: Sending order to endpoint:', config.ENDPOINTS.DELIVERY.PLACE_ORDER);
    console.log('📦 API: Order data structure:', {
      branch_id: orderData.branch_id,
      order_type: orderData.order_type,
      payment_method: orderData.payment_method,
      user_address_id: orderData.user_address_id,
      promo_code: orderData.promo_code,
      scheduled_delivery_time: orderData.scheduled_delivery_time,
      delivery_notes: orderData.delivery_notes,
      customer_notes: orderData.customer_notes,
      loyalty_points_used: orderData.loyalty_points_used,
      items_count: orderData.items?.length || 0
    });
    
    // Validate required fields according to Postman collection
    if (!orderData.branch_id) {
      throw new Error('Branch ID is required');
    }
    if (!orderData.order_type || !['delivery', 'takeaway'].includes(orderData.order_type)) {
      throw new Error('Valid order type (delivery or takeaway) is required');
    }
    if (!orderData.payment_method) {
      throw new Error('Payment method is required');
    }
    if (orderData.order_type === 'delivery' && !orderData.user_address_id) {
      throw new Error('User address ID is required for delivery orders');
    }
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order items are required');
    }
    
    const response = await api.post(config.ENDPOINTS.DELIVERY.PLACE_ORDER, orderData);
    
    console.log('✅ API: Order placed successfully');
    console.log('📋 API: Order response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error placing order:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    console.error('📊 API: Error status:', error.response?.status);
    
    // Enhanced error handling for different scenarios
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors || {};
      const errorMessages = Object.values(validationErrors).flat();
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid order data');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to place orders.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
    }
  }
};

// =================== 🛒 ORDER MANAGEMENT ===================

export const getUserOrders = async () => {
  try {
    console.log('🛒 API: Getting user orders');
    
    const response = await api.get(config.ENDPOINTS.ORDERS.GET_USER_ORDERS);
    
    console.log('✅ API: User orders response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error getting user orders:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    
    // Enhanced error handling
    if (error.response?.status === 401) {
      throw new Error('Authentication required to view orders');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error fetching orders');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    console.log('📋 API: Getting order details for ID:', orderId);
    
    const response = await api.get(`${config.ENDPOINTS.ORDERS.GET_ORDER_DETAILS}/${orderId}`);
    
    console.log('✅ API: Order details response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error getting order details:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    
    // Enhanced error handling
    if (error.response?.status === 404) {
      throw new Error('Order not found');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication required to view order details');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error fetching order details');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
};

// Cancel order function (if API supports it)
export const cancelOrder = async (orderId, reason = '') => {
  try {
    console.log('❌ API: Cancelling order ID:', orderId);
    
    const response = await api.post(`${config.ENDPOINTS.ORDERS.GET_ORDER_DETAILS}/${orderId}/cancel`, {
      reason: reason
    });
    
    console.log('✅ API: Order cancellation response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ API: Error cancelling order:', error);
    console.error('🔍 API: Error response:', error.response?.data);
    
    // Enhanced error handling
    if (error.response?.status === 404) {
      throw new Error('Order not found');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Order cannot be cancelled');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication required to cancel order');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error cancelling order');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  }
};

// =================== ❤️ FAVORITES MANAGEMENT ===================

export const getUserFavorites = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.FAVORITES.GET_FAVORITES);
    return response;
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};

export const addToFavorites = async (productId) => {
  try {
    const response = await api.post(config.ENDPOINTS.FAVORITES.ADD_FAVORITE, {
      product_id: productId
    });
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

// =================== LOCAL ORDER STORAGE ===================

// Get user-specific order storage key
const getOrderStorageKey = (userId) => `coffee-orders-${userId}`;

// Save order to local storage
export const saveOrderLocally = (orderData, userId) => {
  try {
    const storageKey = getOrderStorageKey(userId);
    const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Add timestamp and user info to order
    const orderWithMetadata = {
      ...orderData,
      id: orderData.orderNumber || Date.now().toString(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: orderData.status || 'pending_confirmation'
    };
    
    // Add to beginning of array (newest first)
    existingOrders.unshift(orderWithMetadata);
    
    // Keep only last 50 orders to prevent storage bloat
    const trimmedOrders = existingOrders.slice(0, 50);
    
    localStorage.setItem(storageKey, JSON.stringify(trimmedOrders));
    
    console.log('Order saved locally:', orderWithMetadata);
    return orderWithMetadata;
  } catch (error) {
    console.error('Error saving order locally:', error);
    throw error;
  }
};

// Get user's local orders
export const getLocalOrders = (userId) => {
  try {
    const storageKey = getOrderStorageKey(userId);
    const orders = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return orders;
  } catch (error) {
    console.error('Error getting local orders:', error);
    return [];
  }
};

// Get specific local order by ID
export const getLocalOrderById = (orderId, userId) => {
  try {
    const orders = getLocalOrders(userId);
    return orders.find(order => order.id === orderId || order.orderNumber === orderId);
  } catch (error) {
    console.error('Error getting local order by ID:', error);
    return null;
  }
};

// Update local order status
export const updateLocalOrderStatus = (orderId, status, userId) => {
  try {
    const storageKey = getOrderStorageKey(userId);
    const orders = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const updatedOrders = orders.map(order => {
      if (order.id === orderId || order.orderNumber === orderId) {
        return {
          ...order,
          status,
          updated_at: new Date().toISOString()
        };
      }
      return order;
    });
    
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
    return true;
  } catch (error) {
    console.error('Error updating local order status:', error);
    return false;
  }
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
