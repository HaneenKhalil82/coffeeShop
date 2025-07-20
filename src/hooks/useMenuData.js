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

      console.log('Products API Response:', productsResponse);
      console.log('Categories API Response:', categoriesResponse);

      // Handle the API response structure properly
      const productsData = productsResponse.data?.data || productsResponse.data || [];
      const categoriesData = categoriesResponse.data?.data || categoriesResponse.data || [];

      console.log('Extracted products data:', productsData);
      console.log('Extracted categories data:', categoriesData);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError(err.message || 'Failed to fetch menu data');
      
      // Use fallback data when API is unavailable
      console.log('Using fallback coffee data while API is unavailable...');
      setProducts(getFallbackProducts());
      setCategories(getFallbackCategories());
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
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message || 'Failed to search products');
      // Use fallback data for search when API fails
      setProducts(getFallbackProducts());
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
        setProducts(Array.isArray(response.data) ? response.data : []);
      } else {
        const response = await getCategoryProducts(categoryId);
        setProducts(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError(err.message || 'Failed to fetch category products');
      // Use fallback data for categories when API fails
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products locally
  const filterAndSortProducts = (products, filters) => {
    if (!Array.isArray(products)) {
      return [];
    }
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
    if (!apiProduct) {
      return null;
    }
    
    console.log('Transforming product:', apiProduct);
    
    // Handle image URL properly
    const getImageUrl = (product) => {
      if (product.image) {
        // If image URL starts with http/https, use it as is
        if (product.image.startsWith('http')) {
          return product.image;
        }
        // If it's a relative path, assume it's from the API domain
        return `http://api-coffee.m-zedan.com${product.image}`;
      }
      
      // Fallback images based on category or random
      const fallbackImages = [
        '/images/menu-1.jpg',
        '/images/menu-2.jpg', 
        '/images/menu-3.jpg',
        '/images/menu1.jpg',
        '/images/menu2.jpg',
        '/images/menu3.jpg',
        '/images/arabic coffee.jpg',
        '/images/vanilla.webp'
      ];
      
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    };
    
    return {
      id: apiProduct.id || Math.random(),
      name: apiProduct.name || 'Unknown Product',
      price: parseFloat(apiProduct.price) || 0,
      category: apiProduct.category_id || 'other', // Use category_id for filtering
      categoryName: apiProduct.category?.name || 'Other', // Keep category name for display
      description: apiProduct.description || `Delicious ${apiProduct.name || 'item'} made with the finest ingredients.`,
      image: getImageUrl(apiProduct),
      popular: apiProduct.is_popular || Math.random() > 0.7, // Random popular if not specified
      rating: apiProduct.rating || (4.0 + Math.random() * 1), // Random rating between 4-5
      ingredients: Array.isArray(apiProduct.ingredients) ? apiProduct.ingredients : ['Premium ingredients'],
      calories: apiProduct.calories || Math.floor(Math.random() * 200) + 50, // Random calories if not provided
      stock: parseFloat(apiProduct.stock) || 0,
      barcode: apiProduct.barcode || '',
      acceptFloat: apiProduct.accept_float || false,
      type: apiProduct.type || 'unit'
    };
  };

  // Fallback data when API is unavailable
  const getFallbackProducts = () => [
    {
      id: 1,
      name: 'Espresso Classic',
      price: 18,
      category: { name: 'coffee' },
      description: 'Rich and bold espresso with a perfect golden crema layer',
      image: '/images/menu-1.jpg',
      is_popular: true,
      rating: 4.8,
      ingredients: ['Espresso beans', 'Water'],
      calories: 5,
      stock: 50
    },
    {
      id: 2,
      name: 'Cappuccino Supreme',
      price: 25,
      category: { name: 'coffee' },
      description: 'Creamy cappuccino with steamed milk and thick foam',
      image: '/images/menu-2.jpg',
      is_popular: true,
      rating: 4.9,
      ingredients: ['Espresso', 'Steamed milk', 'Milk foam'],
      calories: 120,
      stock: 45
    },
    {
      id: 3,
      name: 'Latte Deluxe',
      price: 28,
      category: { name: 'coffee' },
      description: 'Smooth latte with perfectly steamed milk',
      image: '/images/menu-3.jpg',
      is_popular: false,
      rating: 4.7,
      ingredients: ['Espresso', 'Steamed milk'],
      calories: 140,
      stock: 40
    },
    {
      id: 4,
      name: 'Arabic Coffee',
      price: 22,
      category: { name: 'coffee' },
      description: 'Traditional Arabic coffee with cardamom and spices',
      image: '/images/arabic coffee.jpg',
      is_popular: true,
      rating: 4.6,
      ingredients: ['Arabic beans', 'Cardamom', 'Saffron'],
      calories: 10,
      stock: 35
    },
    {
      id: 5,
      name: 'Cold Brew',
      price: 20,
      category: { name: 'drinks' },
      description: 'Refreshing cold brew concentrate served over ice',
      image: '/images/menu5.jpg',
      is_popular: true,
      rating: 4.5,
      ingredients: ['Cold brew concentrate', 'Ice'],
      calories: 8,
      stock: 30
    },
    {
      id: 6,
      name: 'Mocha Special',
      price: 32,
      category: { name: 'desserts' },
      description: 'Decadent mocha with chocolate and whipped cream',
      image: '/images/menu6.jpg',
      is_popular: false,
      rating: 4.8,
      ingredients: ['Espresso', 'Chocolate', 'Whipped cream'],
      calories: 280,
      stock: 25
    },
    {
      id: 7,
      name: 'Turkish Coffee',
      price: 24,
      category: { name: 'coffee' },
      description: 'Traditional Turkish coffee with cardamom',
      image: '/images/italian.webp',
      is_popular: false,
      rating: 4.4,
      ingredients: ['Turkish coffee beans', 'Cardamom'],
      calories: 15,
      stock: 20
    },
    {
      id: 8,
      name: 'Vanilla Latte',
      price: 30,
      category: { name: 'drinks' },
      description: 'Creamy vanilla-flavored latte',
      image: '/images/vanilla.webp',
      is_popular: true,
      rating: 4.7,
      ingredients: ['Espresso', 'Vanilla syrup', 'Steamed milk'],
      calories: 160,
      stock: 38
    },
    {
      id: 9,
      name: 'Breakfast Blend',
      price: 26,
      category: { name: 'breakfast' },
      description: 'Perfect morning coffee blend',
      image: '/images/menu1.jpg',
      is_popular: false,
      rating: 4.3,
      ingredients: ['Breakfast blend beans', 'Water'],
      calories: 6,
      stock: 42
    },
    {
      id: 10,
      name: 'Iced Americano',
      price: 19,
      category: { name: 'drinks' },
      description: 'Bold americano served over ice',
      image: '/images/menu2.jpg',
      is_popular: true,
      rating: 4.4,
      ingredients: ['Espresso', 'Cold water', 'Ice'],
      calories: 10,
      stock: 33
    }
  ];

  const getFallbackCategories = () => [
    { id: 1, name: 'coffee', name_ar: 'قهوة' },
    { id: 2, name: 'drinks', name_ar: 'مشروبات' },
    { id: 3, name: 'desserts', name_ar: 'حلويات' },
    { id: 4, name: 'breakfast', name_ar: 'إفطار' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  return {
    products: Array.isArray(products) ? products.map(transformProductData).filter(Boolean) : [],
    categories: Array.isArray(categories) ? categories : [],
    loading,
    error,
    searchMenuItems,
    getProductsByCategory,
    filterAndSortProducts,
    refreshData: fetchInitialData
  };
}; 