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
    console.log("📦 Sending Order Data:", orderData);

    try {
      const response = await api.post(config.ENDPOINTS.DELIVERY.PLACE_ORDER, orderData);
      console.log("✅ Order response:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error.message);
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
      console.log('🎫 Validating promo code:', code, 'with amount:', orderAmount);

      if (!orderAmount || orderAmount <= 0) {
        throw new Error('Order amount must be greater than 0');
      }

      const response = await api.post(config.ENDPOINTS.DELIVERY.VALIDATE_PROMO_CODE, {
        code,
        order_amount: orderAmount
      });

      console.log('✅ Promo validation response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Promo validation error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || 'Invalid promo code' };
    }
  }
};

// =================== 🛍️ CART SERVICES (Local Storage Based) ===================

export const cartService = {
  // Get cart items from localStorage with user-specific key
  getCartItems: (userId = null) => {
    try {
      // Use user-specific cart key if available
      const cartKey = userId ? `coffee-cart-${userId}` : 'coffee-cart';
      const cart = localStorage.getItem(cartKey);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  // Add item to cart with user-specific storage
  addToCart: (product, quantity = 1, notes = '', userId = null) => {
    try {
      const cart = cartService.getCartItems(userId);
      const existingItemIndex = cart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Update existing item
        cart[existingItemIndex].quantity += quantity;
        if (notes) cart[existingItemIndex].notes = notes;
      } else {
        // Add new item
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          notes,
          addedAt: new Date().toISOString()
        });
      }

      const cartKey = userId ? `coffee-cart-${userId}` : 'coffee-cart';
      localStorage.setItem(cartKey, JSON.stringify(cart));
      return { success: true, cart };
    } catch (error) {
      return { success: false, error: 'Failed to add item to cart' };
    }
  },

  // Update cart item quantity with user-specific storage
  updateCartItem: (productId, quantity, notes = '', userId = null) => {
    try {
      const cart = cartService.getCartItems(userId);
      const itemIndex = cart.findIndex(item => item.id === productId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = quantity;
          if (notes !== undefined) cart[itemIndex].notes = notes;
        }
        const cartKey = userId ? `coffee-cart-${userId}` : 'coffee-cart';
        localStorage.setItem(cartKey, JSON.stringify(cart));
        return { success: true, cart };
      }
      return { success: false, error: 'Item not found in cart' };
    } catch (error) {
      return { success: false, error: 'Failed to update cart item' };
    }
  },

  // Remove item from cart with user-specific storage
  removeFromCart: (productId, userId = null) => {
    try {
      const cart = cartService.getCartItems(userId);
      const filteredCart = cart.filter(item => item.id !== productId);
      const cartKey = userId ? `coffee-cart-${userId}` : 'coffee-cart';
      localStorage.setItem(cartKey, JSON.stringify(filteredCart));
      return { success: true, cart: filteredCart };
    } catch (error) {
      return { success: false, error: 'Failed to remove item from cart' };
    }
  },

  // Clear entire cart with user-specific storage
  clearCart: (userId = null) => {
    try {
      const cartKey = userId ? `coffee-cart-${userId}` : 'coffee-cart';
      localStorage.removeItem(cartKey);
      return { success: true, cart: [] };
    } catch (error) {
      return { success: false, error: 'Failed to clear cart' };
    }
  },

  // Get cart total with user-specific storage
  getCartTotal: (userId = null) => {
    const cart = cartService.getCartItems(userId);
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  // Get cart item count with user-specific storage
  getCartItemCount: (userId = null) => {
    const cart = cartService.getCartItems(userId);
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Format cart for API order placement according to your JSON structure
  formatCartForOrder: (userId = null) => {
    const cart = cartService.getCartItems(userId);
    console.log('🛒 Raw cart items:', cart);

    const formattedItems = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      notes: item.notes || ''
    }));

    console.log('📦 Formatted items for API:', formattedItems);
    return cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      notes: item.notes || ''
    }));
  }
};

// =================== 📊 EXAMPLE USAGE FUNCTIONS ===================

// Example: Complete order flow
export const completeOrderFlow = async (orderData, userId = null) => {
  console.log("🚀 Running completeOrderFlow with:", orderData);

  try {
    // 1. Get cart items and calculate total FIRST
    const cartItems = cartService.getCartItems(userId);
    const cartTotal = cartService.getCartTotal(userId);

    console.log('🛒 Cart items for order:', cartItems);
    console.log('💰 Cart total:', cartTotal);

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Cart is empty. Please add items before placing order.' };
    }

    // 2. Validate promo code if provided (with correct cart total)
    if (orderData.promo_code) {
      console.log('🎫 Validating promo code with amount:', cartTotal);
      const promoResult = await orderService.validatePromoCode(
        orderData.promo_code,
        cartTotal
      );
      if (!promoResult.success) {
        console.log('❌ Promo validation failed:', promoResult.error);
        return { success: false, error: promoResult.error || 'Invalid promo code' };
      }
      console.log('✅ Promo code validated successfully');
    }

    // 3. Calculate delivery fee if delivery order
    if (orderData.order_type === 'delivery' && orderData.user_address_id) {
      const feeResult = await orderService.getDeliveryFee(orderData.user_address_id);
      if (!feeResult.success) {
        console.log('⚠️ Could not calculate delivery fee, using default');
        orderData.delivery_fee = 10; // Default delivery fee
      } else {
        orderData.delivery_fee = feeResult.data.delivery_fee;
      }
    }

    // 4. Format cart items for order (CRITICAL: This must not be empty)
    const formattedItems = cartService.formatCartForOrder(userId);

    if (!formattedItems || formattedItems.length === 0) {
      return { success: false, error: 'No items to order. Please add items to cart first.' };
    }

    // Add items to order data
    orderData.items = formattedItems;

    // Add order amount for promo validation
    orderData.order_amount = cartTotal;

    console.log('📦 Final order data being sent:', {
      ...orderData,
      itemsCount: orderData.items.length,
      totalAmount: cartTotal
    });

    // 5. Place the order
    const orderResult = await orderService.placeOrder(orderData);

    if (!orderResult.success) {
      console.error('❌ Order placement failed:', orderResult.error);
      return orderResult;
    }

    console.log('✅ Order placed successfully:', orderResult.data);

    // 6. Clear cart if order successful
    if (orderResult.success) {
      cartService.clearCart(userId);
      console.log('🗑️ Cart cleared after successful order');
    }

    return orderResult;
  } catch (error) {
    console.error('❌ Complete order flow error:', error);
    return { success: false, error: error.message || 'Failed to complete order' };
  }
};

export default {
  addressService,
  favoritesService,
  orderService,
  cartService,
  completeOrderFlow
};