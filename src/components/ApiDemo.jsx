import React, { useState } from 'react';
import { getProducts, getCategories, searchProducts } from '../services/api';
import { useMenuData } from '../hooks/useMenuData';

const ApiDemo = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Using the custom hook
  const { 
    products, 
    categories, 
    loading: hookLoading, 
    error: hookError 
  } = useMenuData();

  const testApiCall = async (endpoint) => {
    setLoading(true);
    setError(null);
    setApiData(null);

    try {
      let response;
      switch (endpoint) {
        case 'products':
          response = await getProducts();
          break;
        case 'categories':
          response = await getCategories();
          break;
        case 'search':
          response = await searchProducts({ q: 'coffee', category_id: 1 });
          break;
        default:
          throw new Error('Unknown endpoint');
      }
      setApiData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Coffee API Integration Demo</h2>
      
      {/* API Configuration */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current API Configuration:</h3>
        <p className="text-sm">
          <strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://api-coffee.m-zedan.com/api'}
        </p>
        <p className="text-sm text-blue-600 mt-2">
          💡 To change the API domain, update VITE_API_BASE_URL in your .env file or modify src/config/api.config.js
        </p>
      </div>

      {/* Test Buttons */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Test API Endpoints:</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => testApiCall('products')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Get Products
          </button>
          <button
            onClick={() => testApiCall('categories')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Get Categories
          </button>
          <button
            onClick={() => testApiCall('search')}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Search Coffee
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700">Loading API data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-sm text-red-600 mt-2">
            This is expected if the API server is not running. The app will fall back to static data.
          </p>
        </div>
      )}

      {/* API Response */}
      {apiData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">API Response:</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto max-h-64 text-sm">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}

      {/* Hook Demo */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">useMenuData Hook Demo:</h3>
        
        {hookLoading && <p className="text-blue-600">Hook is loading data...</p>}
        {hookError && <p className="text-red-600">Hook error: {hookError}</p>}
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Products ({products.length}):</h4>
            <div className="bg-gray-50 p-3 rounded max-h-32 overflow-auto">
              {products.length > 0 ? (
                products.slice(0, 3).map(product => (
                  <div key={product.id} className="text-sm mb-1">
                    {product.name} - ${product.price}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No products loaded (using fallback data)</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Categories ({categories.length}):</h4>
            <div className="bg-gray-50 p-3 rounded max-h-32 overflow-auto">
              {categories.length > 0 ? (
                categories.map(category => (
                  <div key={category.id} className="text-sm mb-1">
                    {category.name}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No categories loaded (using fallback data)</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Next Steps:</h3>
        <ul className="text-sm space-y-1">
          <li>• Set up your Coffee API server at the configured URL</li>
          <li>• Test the endpoints using the buttons above</li>
          <li>• The Menu page will automatically use API data when available</li>
          <li>• Check the console for detailed error logs</li>
          <li>• Review the suggested additional endpoints in SUGGESTED-API-ENDPOINTS.md</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDemo; 