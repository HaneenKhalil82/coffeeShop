import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRTL, useCart } from '../App'
import { useMenuData } from '../hooks/useMenuData'
import { FaTimes, FaPlus, FaMinus, FaShoppingCart, FaStar } from 'react-icons/fa'

const ProductsSection = () => {
  const { isArabic } = useRTL()
  const { addToCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalQuantity, setModalQuantity] = useState(1)
  
  // Fetch products from API
  const { 
    products: apiProducts, 
    loading: apiLoading,
    error: apiError
  } = useMenuData()

  // Get random products for home page display
  const randomProducts = useMemo(() => {
    if (!apiProducts || apiProducts.length === 0) return []
    
    // Shuffle products and take first 4
    const shuffled = [...apiProducts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  }, [apiProducts])

  const content = isArabic ? {
    title: 'منتجاتنا المميزة',
    subtitle: 'اكتشفوا تشكيلتنا',
    viewAll: 'عرض جميع المنتجات',
    addToCart: 'أضف للسلة',
    loading: 'جاري التحميل...',
    error: 'خطأ في تحميل المنتجات',
    currency: 'EGP',
    quantity: 'الكمية',
    close: 'إغلاق',
    ingredients: 'المكونات',
    calories: 'سعرات حرارية',
    popular: 'شائع'
  } : {
    title: 'Featured Products',
    subtitle: 'Discover Our Selection',
    viewAll: 'View All Products',
    addToCart: 'Add to Cart',
    loading: 'Loading...',
    error: 'Error loading products',
    currency: 'EGP',
    quantity: 'Quantity',
    close: 'Close',
    ingredients: 'Ingredients',
    calories: 'Calories',
    popular: 'Popular'
  }

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
    setModalQuantity(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setModalQuantity(1)
  }

  const handleModalAddToCart = (product, quantity = 1) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    
    // Show success message
    const message = isArabic ? `تم إضافة ${product.name} إلى السلة!` : `${product.name} added to cart!`
    
    // Create a temporary toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
    toast.textContent = message
    toast.style.direction = isArabic ? 'rtl' : 'ltr'
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 3000)
    
    closeModal()
  }

  const handleAddToCart = (item) => {
    addToCart(item)
    // Show success message
    const message = isArabic ? `تم إضافة ${item.name} إلى السلة!` : `${item.name} added to cart!`
    
    // Create a temporary toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
    toast.textContent = message
    toast.style.direction = isArabic ? 'rtl' : 'ltr'
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 3000)
  }

  return (
    <section className="section-padding bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
      <div className="absolute inset-0"></div>
      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-4xl arabic-heading-font">
            {content.title}
          </span>
          <h2 className="text-3xl font-bold text-white mt-2 arabic-heading-font">
            {content.subtitle}
          </h2>
        </div>

        {/* Loading State */}
        {apiLoading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white text-xl">{content.loading}</p>
          </div>
        )}

        {/* Error State */}
        {apiError && !apiLoading && (
          <div className="text-center py-16">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-300 mb-4">{content.error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {isArabic ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!apiLoading && !apiError && randomProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {randomProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="text-center group cursor-pointer"
                  onClick={() => handleCardClick(product)}
                >
                  {/* Product Image */}
                  <div className="relative mb-12 overflow-hidden rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/menu-1.jpg'
                      }}
                    />
                    {product.popular && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {isArabic ? '⭐ شائع' : '⭐ Popular'}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-10 pb-6">
                    {/* Product Name */}
                    <h3 className="text-white text-3xl font-semibold uppercase tracking-wide arabic-heading-font hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-xl leading-relaxed arabic-body px-8">
                      {product.description || (isArabic ? 'منتج مميز من تشكيلتنا الفاخرة' : 'Premium product from our exclusive collection')}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <span className="text-white text-4xl font-bold">
                        {product.price} {content.currency}
                      </span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className="border-2 border-primary text-primary px-12 py-5 text-lg font-medium uppercase tracking-wide hover:bg-primary hover:text-white transition-all duration-300 rounded-sm backdrop-blur-sm"
                  >
                    {content.addToCart}
                  </button>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link 
                to="/menu" 
                className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded transition-all duration-300 arabic-body text-lg font-medium uppercase tracking-wide backdrop-blur-sm"
              >
                {content.viewAll}
              </Link>
            </div>
          </>
        )}

        {/* No Products State */}
        {!apiLoading && !apiError && randomProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-300 mb-4">{isArabic ? 'لا توجد منتجات متاحة حالياً' : 'No products available at the moment'}</p>
              <Link
                to="/menu"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isArabic ? 'تصفح القائمة' : 'Browse Menu'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <FaTimes className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = '/images/menu-1.jpg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-t-2xl"></div>
              {selectedProduct.popular && (
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
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 font-medium text-sm">5.0</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    {selectedProduct.price} {content.currency}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedProduct.description || (isArabic ? 'منتج مميز من تشكيلتنا الفاخرة مصنوع بأجود المكونات' : 'Premium product from our exclusive collection made with the finest ingredients')}
                </p>
              </div>
              
              {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {content.ingredients}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((ingredient, index) => (
                      <span key={index} className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6 p-3 bg-amber-50 rounded-xl">
                <span className="font-bold text-gray-800">{content.quantity}:</span>
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                  >
                    <FaMinus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 font-bold bg-gray-50">{modalQuantity}</span>
                  <button
                    onClick={() => setModalQuantity(modalQuantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                  >
                    <FaPlus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <span className="text-lg font-black bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                  {(selectedProduct.price * modalQuantity).toFixed(2)} {content.currency}
                </span>
              </div>
              
              <button
                onClick={() => handleModalAddToCart(selectedProduct, modalQuantity)}
                className="w-full bg-gradient-to-r from-primary to-amber-600 text-white py-3 rounded-xl text-lg font-bold hover:from-amber-600 hover:to-primary transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
              >
                <FaShoppingCart className="w-4 h-4 mr-2" />
                {content.addToCart} - {(selectedProduct.price * modalQuantity).toFixed(2)} {content.currency}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsSection 