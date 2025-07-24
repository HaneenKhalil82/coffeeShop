import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaFilter, FaSort, FaPlus, FaMinus, FaTimes, FaShoppingCart, FaStar } from 'react-icons/fa'
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
    addedToCart: 'تم إضافته إلى السلة',
    currency: 'EGP'
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
    addedToCart: 'Added to Cart',
    currency: 'EGP'
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
      let allSuccess = true
      for (let i = 0; i < quantity; i++) {
        const result = addToCart(item)
        if (!result.success) {
          allSuccess = false
          break
        }
      }
      
      if (allSuccess) {
        setToastMessage(isArabic ? `تم إضافة ${item.name} إلى السلة` : `${item.name} added to cart`)
        setShowToast(true)
        setShowItemModal(false)
        setItemQuantity(1)
      }
      
      setLoading(false)
    }, 500)
  }

  // Handle card click to show modal instead of navigation
  const handleCardClick = (item) => {
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
    setPriceRange([0, 2000])
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
    <div 
      className="min-h-screen" 
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{
        backgroundImage: 'url(/images/bg_4.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better content readability */}
      <div className="min-h-screen">
        <HeroSection 
          title={content.title}
          backgroundImage="/images/bg13.jpeg"
        />
        
        <div className="container mx-auto px-4 py-16">
        {/* Search and Filter Section */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative group">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder={content.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-white shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Sort */}
              <div className="relative group">
                <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-8 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none appearance-none bg-white shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 cursor-pointer"
                >
                  {content.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Price Range */}
              <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-gray-200">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{content.priceRange}:</span>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-bold text-primary whitespace-nowrap">{priceRange[1]}</span>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {content.clearFilters}
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              {content.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-8 py-4 rounded-full font-bold transition-all duration-500 transform hover:scale-110 shadow-lg ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-amber-600 text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary hover:shadow-xl'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedItems.map(item => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-primary cursor-pointer"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/images/menu-1.jpg'
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {item.popular && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          ⭐ {content.popular}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 leading-tight">{item.name}</h3>
                      <div className="ml-2">
                        <span className="text-2xl font-black bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                          {item.price} {content.currency}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-primary to-amber-600 text-white py-3 rounded-xl hover:from-amber-600 hover:to-primary transition-all duration-300 flex items-center justify-center disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FaShoppingCart className="w-4 h-4 mr-2" />
                        {content.addToCart}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(item);
                        }}
                        className="px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className="h-1 bg-gradient-to-r from-primary via-amber-500 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item Details Modal */}
        {showItemModal && selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeItemModal}></div>
            <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
              <button
                onClick={closeItemModal}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <FaTimes className="w-4 h-4 text-gray-600" />
              </button>
              
              <div className="relative">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  onError={(e) => {
                    e.target.src = '/images/menu-1.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-t-2xl"></div>
                {selectedItem.popular && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ⭐ {content.popular}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{selectedItem.name}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                      {selectedItem.price} {content.currency}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {selectedItem.description || (isArabic ? 'منتج مميز من تشكيلتنا الفاخرة مصنوع بأجود المكونات' : 'Premium product from our exclusive collection made with the finest ingredients')}
                  </p>
                </div>
                

                
                <div className="flex items-center gap-4 mb-6 p-3 bg-amber-50 rounded-xl">
                  <span className="font-bold text-gray-800">{content.quantity}:</span>
                  <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <button
                      onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                    >
                      <FaMinus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="px-4 py-2 font-bold bg-gray-50">{itemQuantity}</span>
                    <button
                      onClick={() => setItemQuantity(itemQuantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                    >
                      <FaPlus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-lg font-black bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    {(selectedItem.price * itemQuantity).toFixed(2)} {content.currency}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(selectedItem, itemQuantity)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-amber-600 text-white py-3 rounded-xl text-lg font-bold hover:from-amber-600 hover:to-primary transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
                >
                  <FaShoppingCart className="w-4 h-4 mr-2" />
                  {loading ? content.loading : `${content.addToCart} - ${(selectedItem.price * itemQuantity).toFixed(2)} ${content.currency}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-bounce transform transition-all duration-500 border border-green-400">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-3">
                <FaShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-lg">{toastMessage}</p>
                <p className="text-green-100 text-sm">Successfully added to cart!</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Menu 