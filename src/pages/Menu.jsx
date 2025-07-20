import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaFilter, FaSort, FaStar, FaPlus, FaMinus, FaTimes, FaShoppingCart } from 'react-icons/fa'
import { useRTL, useCart } from '../App'
import HeroSection from './../components/HeroSection'
import { useMenuData } from '../hooks/useMenuData'

const Menu = () => {
  const { isArabic } = useRTL()
  const { addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [loading, setLoading] = useState(false) // For cart operations
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Use the custom hook for API data
  const { 
    products: apiProducts, 
    categories: apiCategories, 
    loading: apiLoading,
    error: apiError,
    filterAndSortProducts
  } = useMenuData()

  // Create dynamic categories from API data
  const getDynamicCategories = () => {
    const defaultCategories = isArabic ? [
      { id: 'all', label: 'الكل' },
      { id: 'coffee', label: 'القهوة' },
      { id: 'drinks', label: 'المشروبات' },
      { id: 'desserts', label: 'الحلويات' },
      { id: 'breakfast', label: 'الإفطار' }
    ] : [
      { id: 'all', label: 'All' },
      { id: 'coffee', label: 'Coffee' },
      { id: 'drinks', label: 'Drinks' },
      { id: 'desserts', label: 'Desserts' },
      { id: 'breakfast', label: 'Breakfast' }
    ]

    if (apiCategories.length > 0) {
      console.log('API Categories:', apiCategories);
      const apiCategoriesFormatted = apiCategories.map(cat => ({
        id: cat.id?.toString() || cat.name?.toLowerCase(),
        label: isArabic ? (cat.name_ar || cat.name) : cat.name
      }))
      console.log('Formatted Categories:', apiCategoriesFormatted);
      return [{ id: 'all', label: isArabic ? 'الكل' : 'All' }, ...apiCategoriesFormatted]
    }
    
    return defaultCategories
  }

  const content = isArabic ? {
    title: 'قائمة الطعام',
    search: 'البحث في القائمة...',
    sortBy: 'ترتيب حسب',
    priceRange: 'نطاق السعر',
    categories: getDynamicCategories(),
    sortOptions: [
      { value: 'name', label: 'ترتيب حسب :الاسم' },
      { value: 'price-low', label: 'السعر: من الأقل إلى الأعلى' },
      { value: 'price-high', label: 'السعر: من الأعلى إلى الأقل' },
      { value: 'popular', label: 'الأكثر شعبية' }
    ],
    addToCart: 'أضف إلى السلة',
    quantity: 'الكمية',
    ingredients: 'المكونات',
    calories: 'سعرات حرارية',
    rating: 'التقييم',
    popular: 'شائع',
    noItems: 'لا توجد عناصر',
    noItemsMessage: 'لم يتم العثور على عناصر. تحقق من الاتصال بالإنترنت أو حاول مرة أخرى.',
    loading: 'جاري التحميل...',
    error: 'خطأ في تحميل البيانات',
    retry: 'إعادة المحاولة',
    closeModal: 'إغلاق',
    filterBy: 'تصفية حسب',
    clearFilters: 'مسح المرشحات',
    contactUs: 'اتصل بنا',
    helpText: 'لا تجد ما تبحث عنه؟ اتصل بنا وسنساعدك!',
    addedToCart: 'تم إضافته إلى السلة'
  } : {
    title: 'Our Menu',
    search: 'Search menu...',
    sortBy: 'Sort by',
    priceRange: 'Price Range',
    categories: getDynamicCategories(),
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'popular', label: 'Most Popular' }
    ],
    addToCart: 'Add to Cart',
    quantity: 'Quantity',
    ingredients: 'Ingredients',
    calories: 'Calories',
    rating: 'Rating',
    popular: 'Popular',
    noItems: 'No Items',
    noItemsMessage: 'No items found. Please check your internet connection or try again.',
    loading: 'Loading...',
    error: 'Error loading data',
    retry: 'Retry',
    closeModal: 'Close',
    filterBy: 'Filter by',
    clearFilters: 'Clear Filters',
    contactUs: 'Contact Us',
    helpText: 'Can\'t find what you\'re looking for? Contact us and we\'ll help you!',
    addedToCart: 'Added to Cart'
  }

  // Use only API data - no static fallback
  const menuItems = apiProducts || []
  console.log('Menu Items from API:', menuItems);
  
  // Filter and sort menu items using API data only
  const filteredItems = filterAndSortProducts(menuItems, {
    searchTerm,
    priceRange,
    sortBy
  }).filter(item => {
    console.log('Filtering item:', item, 'Active category:', activeCategory);
    const matchesCategory = activeCategory === 'all' || 
                           item.category?.toString() === activeCategory?.toString() ||
                           item.categoryName?.toLowerCase().includes(activeCategory?.toLowerCase())
    console.log('Category match result:', matchesCategory);
    return matchesCategory
  })

  console.log('Filtered Items:', filteredItems);

  const sortedItems = filteredItems

  const handleAddToCart = (item, quantity = 1) => {
    setLoading(true)
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addToCart(item)
      }
      setToastMessage(isArabic ? `تم إضافة ${item.name} إلى السلة` : `${item.name} added to cart`)
      setShowToast(true)
      setLoading(false)
      setShowItemModal(false)
      setItemQuantity(1)
    }, 500)
  }

  const openItemModal = (item) => {
    setSelectedItem(item)
    setShowItemModal(true)
    setItemQuantity(1)
  }

  const closeItemModal = () => {
    setShowItemModal(false)
    setSelectedItem(null)
    setItemQuantity(1)
  }

  const clearFilters = () => {
    setActiveCategory('all')
    setSearchTerm('')
    setSortBy('name')
    setPriceRange([0, 100])
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <div className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <HeroSection 
        title={content.title}
        backgroundImage="/images/bg13.jpeg"
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={content.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none appearance-none"
              >
                {content.sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{content.priceRange}:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm">${priceRange[1]}</span>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {content.clearFilters}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {content.categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 border-2 border-primary hover:bg-primary hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {apiLoading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">{content.loading}</p>
          </div>
        )}

        {/* Error State with Fallback Notice */}
        {apiError && !apiLoading && sortedItems.length > 0 && (
          <div className="mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      {isArabic 
                        ? 'يتم عرض بيانات تجريبية بسبب عدم توفر الخادم. ستظهر البيانات الحقيقية عند تشغيل الخادم.' 
                        : 'Showing sample data while API server is unavailable. Real data will appear when server is online.'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  {content.retry}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error State (when no fallback data) */}
        {apiError && !apiLoading && sortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{content.error}</p>
              <p className="text-red-500 text-sm mb-4">{apiError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {content.retry}
              </button>
            </div>
          </div>
        )}

        {/* No Items State */}
        {!apiLoading && !apiError && sortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{content.noItems}</h3>
              <p className="text-gray-600 mb-6">{content.noItemsMessage}</p>
              <div className="space-y-4">
                <button
                  onClick={clearFilters}
                  className="block w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {content.clearFilters}
                </button>
                <p className="text-sm text-gray-500">{content.helpText}</p>
                <Link
                  to="/contact"
                  className="inline-block px-6 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  {content.contactUs}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        {!apiLoading && !apiError && sortedItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/menu-1.jpg'
                    }}
                  />
                  {item.popular && (
                    <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {content.popular}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center">
                      <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{item.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">${item.price}</span>
                    <span className="text-sm text-gray-500">
                      {item.calories} {content.calories}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={loading}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                    >
                      <FaShoppingCart className="w-4 h-4 mr-2" />
                      {content.addToCart}
                    </button>
                    <button
                      onClick={() => openItemModal(item)}
                      className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Item Details Modal */}
        {showItemModal && selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeItemModal}></div>
            <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeItemModal}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
              
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedItem.name}</h2>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        <FaStar className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="font-semibold">{selectedItem.rating}</span>
                      </div>
                      {selectedItem.popular && (
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {content.popular}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-primary">${selectedItem.price}</span>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{selectedItem.description}</p>
                
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{content.ingredients}:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ingredient, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500">
                    {selectedItem.calories} {content.calories}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-semibold text-gray-800">{content.quantity}:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <FaMinus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{itemQuantity}</span>
                    <button
                      onClick={() => setItemQuantity(itemQuantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    ${(selectedItem.price * itemQuantity).toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(selectedItem, itemQuantity)}
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? content.loading : `${content.addToCart} - $${(selectedItem.price * itemQuantity).toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="flex items-center">
              <FaShoppingCart className="w-5 h-5 mr-2" />
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu 