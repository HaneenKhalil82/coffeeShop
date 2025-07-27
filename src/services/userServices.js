import api from './api.js';
import config from '../config/api.config.js';

// =================== 📍 ADDRESS SERVICES ===================

export const addressService = {
  // Get all user addresses
  getUserAddresses: async () => {
    try {
      const response = await api.get(config.ENDPOINTS.ADDRESSES.GET_USER_ADDRESSES);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch addresses' };
    }
  },

  // Add new address
  addAddress: async (addressData) => {
    try {
      const response = await api.post(config.ENDPOINTS.ADDRESSES.ADD_ADDRESS, addressData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add address' };
    }
  },

  // Update existing address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`${config.ENDPOINTS.ADDRESSES.UPDATE_ADDRESS}/${addressId}`, addressData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update address' };
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`${config.ENDPOINTS.ADDRESSES.DELETE_ADDRESS}/${addressId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete address' };
    }
  }
};

// =================== ❤️ FAVORITES SERVICES ===================

export const favoritesService = {
  // Get user favorites
  getFavorites: async () => {
    try {
      const response = await api.get(config.ENDPOINTS.FAVORITES.GET_FAVORITES);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch favorites' };
    }
  },

  // Add product to favorites
  addToFavorites: async (productId) => {
    try {
      const response = await api.post(config.ENDPOINTS.FAVORITES.ADD_FAVORITE, { product_id: productId });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add to favorites' };
    }
  },

  // Remove product from favorites
  removeFromFavorites: async (favoriteId) => {
    try {
      const response = await api.delete(`${config.ENDPOINTS.FAVORITES.REMOVE_FAVORITE}/${favoriteId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to remove from favorites' };
    }
  },

  // Toggle favorite status
  toggleFavorite: async (productId, favoriteId = null) => {
    if (favoriteId) {
      return await favoritesService.removeFromFavorites(favoriteId);
    } else {
      return await favoritesService.addToFavorites(productId);
    }
  }
};

// =================== 🛒 ORDER SERVICES ===================

export const orderService = {
  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await api.get(config.ENDPOINTS.ORDERS.GET_USER_ORDERS);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch orders' };
    }
  },

  // Get specific order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`${config.ENDPOINTS.ORDERS.GET_ORDER_DETAILS}/${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch order details' };
    }
  },

  // Place new order
  placeOrder: async (orderData) => {
      console.log("📦 Sending Order Data:", orderData); // ✅ هنا بنطبع البيانات قبل الإرسال

    try {
      const response = await api.post(config.ENDPOINTS.DELIVERY.PLACE_ORDER, orderData);
      console.log("✅ Order response:", response.data); // ✅ وهنا بنطبع الرد من السيرفر
      return { success: true, data: response.data };
    } catch (error) {
       console.error("❌ Error placing order:", error.response?.data || error.message); // 🛑 لو فيه خطأ
      return { success: false, error: error.response?.data?.message || 'Failed to place order' };
    }
  },

  // Get delivery locations
  getDeliveryLocations: async () => {
    try {
      const response = await api.get(config.ENDPOINTS.DELIVERY.GET_DELIVERY_LOCATIONS);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch delivery locations' };
    }
  },

  // Calculate delivery fee
  getDeliveryFee: async (userAddressId) => {
    try {
      const response = await api.post(config.ENDPOINTS.DELIVERY.GET_DELIVERY_FEE, {
        user_address_id: userAddressId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to calculate delivery fee' };
    }
  },

  // Validate promo code
  validatePromoCode: async (code, orderAmount) => {
    try {
      const response = await api.post(config.ENDPOINTS.DELIVERY.VALIDATE_PROMO_CODE, {
        code,
        order_amount: orderAmount
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Invalid promo code' };
    }
  }
};

// =================== 🛍️ CART SERVICES (Local Storage Based) ===================

export const cartService = {
  // Get cart items from localStorage
  getCartItems: () => {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  // Add item to cart
  addToCart: (product, quantity = 1, notes = '') => {
    try {
      const cart = cartService.getCartItems();
      const existingItemIndex = cart.findIndex(item => item.product_id === product.id);

      if (existingItemIndex > -1) {
        // Update existing item
        cart[existingItemIndex].quantity += quantity;
        if (notes) cart[existingItemIndex].notes = notes;
      } else {
        // Add new item
        cart.push({
          product_id: product.id,
          product,
          quantity,
          notes,
          addedAt: new Date().toISOString()
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      return { success: true, cart };
    } catch (error) {
      return { success: false, error: 'Failed to add item to cart' };
    }
  },

  // Update cart item quantity
  updateCartItem: (productId, quantity, notes = '') => {
    try {
      const cart = cartService.getCartItems();
      const itemIndex = cart.findIndex(item => item.product_id === productId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = quantity;
          if (notes !== undefined) cart[itemIndex].notes = notes;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        return { success: true, cart };
      }
      return { success: false, error: 'Item not found in cart' };
    } catch (error) {
      return { success: false, error: 'Failed to update cart item' };
    }
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    try {
      const cart = cartService.getCartItems();
      const filteredCart = cart.filter(item => item.product_id !== productId);
      localStorage.setItem('cart', JSON.stringify(filteredCart));
      return { success: true, cart: filteredCart };
    } catch (error) {
      return { success: false, error: 'Failed to remove item from cart' };
    }
  },

  // Clear entire cart
  clearCart: () => {
    try {
      localStorage.removeItem('cart');
      return { success: true, cart: [] };
    } catch (error) {
      return { success: false, error: 'Failed to clear cart' };
    }
  },

  // Get cart total
  getCartTotal: () => {
    const cart = cartService.getCartItems();
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  },

  // Get cart item count
  getCartItemCount: () => {
    const cart = cartService.getCartItems();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Format cart for API order placement
  formatCartForOrder: () => {
    const cart = cartService.getCartItems();
    return cart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      notes: item.notes || ''
    }));
  }
};

// =================== 📊 EXAMPLE USAGE FUNCTIONS ===================

// Example: Complete order flow
export const completeOrderFlow = async (orderData) => {
   console.log("🚀 Running completeOrderFlow with:", orderData); // 👈 ضيفي دي
  try {
    // 1. Validate promo code if provided
    if (orderData.promo_code) {
      const promoResult = await orderService.validatePromoCode(
        orderData.promo_code, 
        cartService.getCartTotal()
      );
      if (!promoResult.success) {
        return { success: false, error: 'Invalid promo code' };
      }
    }

    // 2. Calculate delivery fee if delivery order
    if (orderData.order_type === 'delivery' && orderData.user_address_id) {
      const feeResult = await orderService.getDeliveryFee(orderData.user_address_id);
      if (!feeResult.success) {
        return { success: false, error: 'Could not calculate delivery fee' };
      }
      orderData.delivery_fee = feeResult.data.delivery_fee;
    }

    // 3. Format cart items for order
    orderData.items = cartService.formatCartForOrder();

    // 4. Place the order
    const orderResult = await orderService.placeOrder(orderData);
    
    // 5. Clear cart if order successful
    if (orderResult.success) {
      cartService.clearCart();
    }

    return orderResult;
  } catch (error) {
    return { success: false, error: 'Failed to complete order' };
  }
};

export default {
  addressService,
  favoritesService,
  orderService,
  cartService,
  completeOrderFlow
}; 