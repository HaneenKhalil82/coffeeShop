import { useState, useEffect } from 'react';
import { getProducts, getCategories, searchProducts, getCategoryProducts } from '../services/api';

export const useMenuData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products and categories in parallel
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError(err.message || 'Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchMenuItems = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await searchProducts(searchParams);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  // Get products by category
  const getProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (categoryId === 'all') {
        const response = await getProducts();
        setProducts(response.data || []);
      } else {
        const response = await getCategoryProducts(categoryId);
        setProducts(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError(err.message || 'Failed to fetch category products');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products locally
  const filterAndSortProducts = (products, filters) => {
    let filteredProducts = [...products];

    // Filter by search term
    if (filters.searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    // Sort products
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name?.localeCompare(b.name) || 0;
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'popular':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }

    return filteredProducts;
  };

  // Transform API data to match component structure
  const transformProductData = (apiProduct) => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      price: apiProduct.price,
      category: apiProduct.category?.name || 'other',
      description: apiProduct.description,
      image: apiProduct.image || '/images/menu-1.jpg', // fallback image
      popular: apiProduct.is_popular || false,
      rating: apiProduct.rating || 4.0,
      ingredients: apiProduct.ingredients || [],
      calories: apiProduct.calories || 0,
      stock: apiProduct.stock || 0
    };
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return {
    products: products.map(transformProductData),
    categories,
    loading,
    error,
    searchMenuItems,
    getProductsByCategory,
    filterAndSortProducts,
    refreshData: fetchInitialData
  };
}; 