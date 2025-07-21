import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getProducts, 
  getCategories, 
  getBranches,
  getDeliveryLocations,
  validatePromoCode 
} from '../services/api';
import { 
  addressService, 
  favoritesService, 
  orderService, 
  cartService,
  completeOrderFlow 
} from '../services/userServices';

const ApiDemo = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Demo functions for different API endpoints
  const demoFunctions = {
    // Public API calls
    products: async () => {
      const response = await getProducts();
      return response.data;
    },
    
    categories: async () => {
      const response = await getCategories();
      return response.data;
    },
    
    branches: async () => {
      const response = await getBranches();
      return response.data;
    },
    
    deliveryLocations: async () => {
      const response = await getDeliveryLocations();
      return response.data;
    },

    // User-specific API calls (require authentication)
    addresses: async () => {
      if (!isAuthenticated) throw new Error('Please login first');
      const result = await addressService.getUserAddresses();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },

    favorites: async () => {
      if (!isAuthenticated) throw new Error('Please login first');
      const result = await favoritesService.getFavorites();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },

    orders: async () => {
      if (!isAuthenticated) throw new Error('Please login first');
      const result = await orderService.getUserOrders();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },

    // Cart demo (local storage)
    cart: async () => {
      const cartItems = cartService.getCartItems();
      const total = cartService.getCartTotal();
      const itemCount = cartService.getCartItemCount();
      
      return {
        items: cartItems,
        total: total,
        itemCount: itemCount,
        summary: `Cart has ${itemCount} items worth $${total.toFixed(2)}`
      };
    },

    // Promo code demo
    promoCode: async () => {
      const result = await validatePromoCode('WELCOME10', 50.00);
      return result;
    }
  };

  const handleApiCall = async (apiFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await demoFunctions[apiFunction]();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Demo: Add item to cart
  const addToCartDemo = () => {
    const demoProduct = {
      id: 1,
      name: 'Espresso',
      price: 4.99,
      image: '/images/menu1.jpg'
    };
    
    const result = cartService.addToCart(demoProduct, 1, 'Extra hot');
    setData({ 
      message: 'Item added to cart!', 
      cart: result.cart 
    });
  };

  // Demo: Place order
  const placeOrderDemo = async () => {
    if (!isAuthenticated) {
      setError('Please login first to place an order');
      return;
    }

    try {
      setLoading(true);
      
      // Add demo item to cart first
      const demoProduct = { id: 1, name: 'Espresso', price: 4.99 };
      cartService.addToCart(demoProduct, 2);

      const orderData = {
        branch_id: 1,
        order_type: 'takeaway', // or 'delivery'
        payment_method: 'cash_on_delivery',
        customer_notes: 'Demo order from API testing',
        loyalty_points_used: 0
      };

      const result = await completeOrderFlow(orderData);
      
      if (result.success) {
        setData({ message: 'Order placed successfully!', order: result.data });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Coffee Shop API Demo
      </h2>
      
      {/* User Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Authentication Status:</h3>
        {isAuthenticated ? (
          <p className="text-green-600">✓ Logged in as: {user?.name || user?.email}</p>
        ) : (
          <p className="text-red-600">✗ Not logged in (some features require authentication)</p>
        )}
      </div>

      {/* API Endpoint Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(demoFunctions).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg capitalize ${
                activeTab === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>

        {/* API Call Button */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleApiCall(activeTab)}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : `Fetch ${activeTab}`}
          </button>

          {/* Special demo buttons */}
          <button
            onClick={addToCartDemo}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Add Demo Item to Cart
          </button>

          <button
            onClick={placeOrderDemo}
            disabled={loading || !isAuthenticated}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            Place Demo Order
          </button>
        </div>
      </div>

      {/* Results Display */}
      <div className="border rounded-lg p-4 min-h-[200px]">
        <h3 className="font-semibold mb-3">API Response:</h3>
        
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {data && !loading && !error && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        {!data && !loading && !error && (
          <p className="text-gray-500 italic">
            Click a button above to test the API endpoints...
          </p>
        )}
      </div>

      {/* API Endpoints Documentation */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-3">Available API Endpoints:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800">Public Endpoints:</h4>
            <ul className="list-disc list-inside text-blue-700">
              <li>GET /api/products</li>
              <li>GET /api/categories</li>
              <li>GET /api/branches</li>
              <li>GET /api/delivery-locations</li>
              <li>POST /api/validate-promo-code</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800">Authenticated Endpoints:</h4>
            <ul className="list-disc list-inside text-blue-700">
              <li>GET /api/user/addresses</li>
              <li>GET /api/user/favorites</li>
              <li>GET /api/user/orders</li>
              <li>POST /api/orders</li>
              <li>POST /api/auth/profile</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-3">Usage Examples:</h3>
        <div className="text-sm space-y-2">
          <div>
            <strong>Add to Cart:</strong> 
            <code className="bg-gray-200 px-2 py-1 rounded ml-2">
              cartService.addToCart(product, quantity, notes)
            </code>
          </div>
          <div>
            <strong>Add to Favorites:</strong> 
            <code className="bg-gray-200 px-2 py-1 rounded ml-2">
              favoritesService.addToFavorites(productId)
            </code>
          </div>
          <div>
            <strong>Place Order:</strong> 
            <code className="bg-gray-200 px-2 py-1 rounded ml-2">
              completeOrderFlow(orderData)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDemo; 