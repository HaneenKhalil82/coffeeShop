import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowLeft, FaArrowRight, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { useCart, useRTL } from '../App'

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  const icon = type === 'success' ? <FaCheck /> : type === 'error' ? <FaExclamationTriangle /> : null

  return (
    <div className={`fixed top-20 sm:top-24 right-4 sm:right-6 left-4 sm:left-auto ${bgColor} text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 sm:space-x-3 animate-pulse`}>
      {icon}
      <span className="text-sm sm:text-base">{message}</span>
      <button onClick={onClose} className="ml-2">
        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  )
}

const Cart = () => {
  const { isArabic } = useRTL()
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, cartItemsCount } = useCart()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [isClearing, setIsClearing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false)

  // Initialize quantities from cart items
  useEffect(() => {
    const initialQuantities = {}
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.quantity
    })
    setQuantities(initialQuantities)
  }, [cartItems])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('coffee-cart', JSON.stringify(cartItems))
    } else {
      localStorage.removeItem('coffee-cart')
    }
  }, [cartItems])

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  const content = isArabic ? {
    title: 'سلة المشتريات',
    subtitle: 'راجع طلباتك',
    empty: {
      title: 'السلة فارغة',
      message: 'لم تضف أي منتجات إلى السلة بعد',
      button: 'تصفح المنتجات'
    },
    table: {
      product: 'المنتج',
      price: 'السعر',
      quantity: 'الكمية',
      total: 'المجموع'
    },
    summary: {
      title: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      tax: 'ضريبة القيمة المضافة (15%)',
      shipping: 'التوصيل',
      total: 'المجموع الكلي',
      delivery: 'التوصيل',
      discount: 'الخصم'
    },
    buttons: {
      continueShopping: 'متابعة التسوق',
      clearCart: 'إفراغ السلة',
      checkout: 'إتمام الطلب',
      remove: 'حذف',
      update: 'تحديث',
      proceedToCheckout: 'متابعة الدفع',
      updateQuantity: 'تحديث الكمية'
    },
    messages: {
      itemRemoved: 'تم حذف المنتج من السلة',
      quantityUpdated: 'تم تحديث الكمية',
      cartCleared: 'تم إفراغ السلة',
      invalidQuantity: 'الكمية غير صالحة',
      confirmClear: 'هل أنت متأكد من إفراغ السلة؟',
      confirmRemove: 'هل تريد حذف هذا المنتج؟',
      maxQuantity: 'الحد الأقصى للكمية هو 99',
      minQuantity: 'الحد الأدنى للكمية هو 1'
    }
  } : {
    title: 'Shopping Cart',
    subtitle: 'Review Your Order',
    empty: {
      title: 'Your Cart is Empty',
      message: 'You haven\'t added any products to your cart yet',
      button: 'Browse Products'
    },
    table: {
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total'
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'VAT (15%)',
      shipping: 'Shipping',
      total: 'Total',
      delivery: 'Delivery',
      discount: 'Discount'
    },
    buttons: {
      continueShopping: 'Continue Shopping',
      clearCart: 'Clear Cart',
      checkout: 'Checkout',
      remove: 'Remove',
      update: 'Update',
      proceedToCheckout: 'Proceed to Checkout',
      updateQuantity: 'Update Quantity'
    },
    messages: {
      itemRemoved: 'Item removed from cart',
      quantityUpdated: 'Quantity updated',
      cartCleared: 'Cart cleared successfully',
      invalidQuantity: 'Invalid quantity',
      confirmClear: 'Are you sure you want to clear the cart?',
      confirmRemove: 'Do you want to remove this item?',
      maxQuantity: 'Maximum quantity is 99',
      minQuantity: 'Minimum quantity is 1'
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRate = 0.15
  const tax = subtotal * taxRate
  const deliveryFee = subtotal >= 100 ? 0 : 10
  const discount = subtotal >= 50 ? 5 : 0
  const finalTotal = subtotal + tax + deliveryFee - discount

  const handleQuantityChange = async (itemId, newQuantity, showNotification = true) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }

    if (newQuantity > 99) {
      showToast(content.messages.maxQuantity, 'error')
      return
    }

    setLoading(true)
    try {
      updateCartItemQuantity(itemId, newQuantity)
      setQuantities(prev => ({ ...prev, [itemId]: newQuantity }))
      
      if (showNotification) {
        showToast(content.messages.quantityUpdated, 'success')
      }
    } catch {
      showToast(content.messages.invalidQuantity, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityInputChange = (itemId, value) => {
    const quantity = parseInt(value) || 1
    setQuantities(prev => ({ ...prev, [itemId]: quantity }))
  }

  const handleQuantityInputBlur = (itemId) => {
    const quantity = quantities[itemId] || 1
    const validQuantity = Math.max(1, Math.min(99, quantity))
    handleQuantityChange(itemId, validQuantity, false)
  }

  const handleRemoveItem = (itemId) => {
    const item = cartItems.find(item => item.id === itemId)
    setItemToRemove(item)
    setShowRemoveConfirm(true)
  }

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return
    
    setShowRemoveConfirm(false)
    setLoading(true)
    try {
      removeFromCart(itemToRemove.id)
      showToast(content.messages.itemRemoved, 'success')
      
      // Remove from local quantities state
      setQuantities(prev => {
        const newQuantities = { ...prev }
        delete newQuantities[itemToRemove.id]
        return newQuantities
      })
    } catch {
      showToast('Error removing item', 'error')
    } finally {
      setLoading(false)
      setItemToRemove(null)
    }
  }

  const cancelRemoveItem = () => {
    setShowRemoveConfirm(false)
    setItemToRemove(null)
  }

  const handleClearCart = () => {
    setShowClearConfirm(true)
  }

  const confirmClearCart = async () => {
    setShowClearConfirm(false)
    setIsClearing(true)
    try {
      clearCart()
      setQuantities({})
      showToast(content.messages.cartCleared, 'success')
    } catch {
      showToast('Error clearing cart', 'error')
    } finally {
      setIsClearing(false)
    }
  }

  const cancelClearCart = () => {
    setShowClearConfirm(false)
  }

  const handleContinueShopping = () => {
    navigate('/menu')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowEmptyCartModal(true)
      return
    }
    navigate('/checkout')
  }

  const closeEmptyCartModal = () => {
    setShowEmptyCartModal(false)
  }

  return (
    <div className="pt-16 md:pt-20 relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/hhh.jpg)' }}>
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform animate-pulse">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 arabic-heading-font">
                {isArabic ? 'تأكيد إفراغ السلة' : 'Confirm Clear Cart'}
              </h3>
              
              <p className="text-gray-600 mb-6 arabic-body">
                {content.messages.confirmClear}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={cancelClearCart}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 arabic-body"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={confirmClearCart}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 arabic-body"
                >
                  {isArabic ? 'إفراغ السلة' : 'Clear Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Item Confirmation Modal */}
      {showRemoveConfirm && itemToRemove && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform animate-pulse">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 arabic-heading-font">
                {isArabic ? 'تأكيد حذف المنتج' : 'Confirm Remove Item'}
              </h3>
              
              <p className="text-gray-600 mb-2 arabic-body">
                {content.messages.confirmRemove}
              </p>
              
              <div className="flex items-center justify-center mb-6 p-3 bg-gray-50 rounded-lg">
                <img
                  src={itemToRemove.image}
                  alt={itemToRemove.name}
                  className="w-12 h-12 object-cover rounded-lg mr-3"
                  onError={(e) => {
                    e.target.src = '/images/menu1.jpg'
                  }}
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 arabic-heading-font">
                    {itemToRemove.name}
                  </p>
                  <p className="text-sm text-gray-600 arabic-body">
                    ${itemToRemove.price}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={cancelRemoveItem}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 arabic-body"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={confirmRemoveItem}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 arabic-body"
                >
                  {isArabic ? 'حذف' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty Cart Modal */}
      {showEmptyCartModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform animate-pulse">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingBag className="w-8 h-8 text-orange-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 arabic-heading-font">
                {isArabic ? 'السلة فارغة' : 'Cart is Empty'}
              </h3>
              
              <p className="text-gray-600 mb-6 arabic-body">
                {isArabic 
                  ? 'لا يمكنك إتمام الطلب بسلة فارغة. يرجى إضافة المنتجات أولاً.'
                  : 'You cannot checkout with an empty cart. Please add some products first.'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={closeEmptyCartModal}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 arabic-body"
                >
                  {isArabic ? 'موافق' : 'OK'}
                </button>
                <button
                  onClick={() => {
                    closeEmptyCartModal()
                    handleContinueShopping()
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300 arabic-body"
                >
                  {isArabic ? 'تصفح المنتجات' : 'Browse Products'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || isClearing) && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center mx-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-700 text-sm sm:text-base">{isClearing ? 'Clearing cart...' : 'Updating...'}</p>
          </div>
        </div>
      )}

      {/* Cart Content */}
      <section className="section-padding relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 space-x-reverse text-sm sm:text-lg">
              <Link to="/" className="text-white hover:text-primary transition-colors arabic-body">
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-primary arabic-body">{content.title}</span>
            </div>
          </nav>

          {/* Cart Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 arabic-heading-font text-white">
              {content.title}
            </h1>
            <p className="text-gray-300 arabic-body text-sm sm:text-base">
              {cartItemsCount} {isArabic ? 'منتج في السلة' : 'items in your cart'}
            </p>
          </div>
          
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-12 sm:py-16">
              <FaShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 arabic-heading-font text-white">
                {content.empty.title}
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 arabic-body text-base sm:text-lg px-4">
                {content.empty.message}
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-primary/90 transition-colors duration-300 font-semibold text-sm sm:text-base"
              >
                {content.empty.button}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {/* Cart Table */}
              <div className="xl:col-span-3">
                <div className="backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
                  {/* Clear Cart Button */}
                  <div className="bg-black/40 px-4 md:px-8 lg:px-14 py-3 md:py-4 flex justify-between items-center border-2 border-primary/30">
                    <span className="text-white font-semibold text-sm md:text-base">
                      {cartItemsCount} {isArabic ? 'منتج' : 'items'}
                    </span>
                    <button
                      onClick={handleClearCart}
                      disabled={isClearing}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300 arabic-body disabled:opacity-50 text-sm md:text-base"
                    >
                      {content.buttons.clearCart}
                    </button>
                  </div>

                  {/* Desktop Table Header - Hidden on mobile */}
                  <div className="hidden md:block bg-primary px-4 md:px-8 lg:px-14 py-4 md:py-6 lg:py-8">
                    <div className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-6 items-center text-white font-bold text-base md:text-lg lg:text-xl uppercase tracking-wider">
                      <div className="col-span-6 arabic-body">{content.table.product}</div>
                      <div className="col-span-2 text-center arabic-body">{content.table.price}</div>
                      <div className="col-span-2 text-center arabic-body">{content.table.quantity}</div>
                      <div className="col-span-2 text-center arabic-body">{content.table.total}</div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="divide-y divide-gray-600">
                    {cartItems.map((item) => (
                      <div key={item.id} className="px-4 md:px-8 lg:px-14 py-6 md:py-10 lg:py-14 relative group border-2 border-primary/30">
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-3 sm:top-5 lg:top-7 right-3 sm:right-5 lg:right-7 text-gray-400 hover:text-red-500 transition-colors duration-300 opacity-0 group-hover:opacity-100 z-10"
                          title={content.buttons.remove}
                          disabled={loading}
                        >
                          <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </button>

                        {/* Mobile Layout */}
                        <div className="md:hidden">
                          <div className="flex gap-8 mb-4 pr-8">
                            <div className="flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg shadow-lg"
                                onError={(e) => {
                                  e.target.src = '/images/menu1.jpg'
                                }}
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-white font-bold mb-1 arabic-heading-font text-lg">
                                {item.name}
                              </h3>
                              <p className="text-gray-300 text-sm arabic-body leading-relaxed mb-2">
                                {item.description || (isArabic ? 'منتج عالي الجودة' : 'High quality product')}
                              </p>
                              {item.category && (
                                <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-white font-bold text-base">
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                            </div>
                            
                            <div className="flex items-center space-x-2 space-x-reverse bg-white/10 rounded-lg p-1">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
                                disabled={loading || item.quantity <= 1}
                              >
                                <FaMinus className="w-3 h-3 text-white" />
                              </button>
                              <input
                                type="number"
                                value={quantities[item.id] || item.quantity}
                                onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                                onBlur={() => handleQuantityInputBlur(item.id)}
                                className="w-10 text-center bg-transparent text-white font-bold text-sm border-none outline-none"
                                min="1"
                                max="99"
                                disabled={loading}
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
                                disabled={loading || item.quantity >= 99}
                              >
                                <FaPlus className="w-3 h-3 text-white" />
                              </button>
                            </div>
                            
                            <div className="text-white font-bold text-base">
                              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:grid grid-cols-12 gap-3 md:gap-4 lg:gap-6 items-center">
                          {/* Product Info */}
                          <div className="col-span-6 flex items-center gap-8 md:gap-12 lg:gap-16">
                            <div className="flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-cover rounded-xl shadow-lg"
                                onError={(e) => {
                                  e.target.src = '/images/menu1.jpg'
                                }}
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-white font-bold mb-2 arabic-heading-font text-lg md:text-xl lg:text-2xl">
                                {item.name}
                              </h3>
                              <p className="text-gray-300 text-sm md:text-base lg:text-lg arabic-body leading-relaxed">
                                {item.description || (isArabic ? 'منتج عالي الجودة' : 'High quality product')}
                              </p>
                              {item.category && (
                                <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-center">
                            <span className="text-white font-bold text-base md:text-lg lg:text-xl">
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                            </span>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse bg-white/10 rounded-xl p-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
                                disabled={loading || item.quantity <= 1}
                              >
                                <FaMinus className="w-3 h-3 md:w-4 md:h-4 text-white" />
                              </button>
                              <input
                                type="number"
                                value={quantities[item.id] || item.quantity}
                                onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                                onBlur={() => handleQuantityInputBlur(item.id)}
                                className="w-12 md:w-14 lg:w-16 text-center bg-transparent text-white font-bold text-sm md:text-base lg:text-lg border-none outline-none"
                                min="1"
                                max="99"
                                disabled={loading}
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
                                disabled={loading || item.quantity >= 99}
                              >
                                <FaPlus className="w-3 h-3 md:w-4 md:h-4 text-white" />
                              </button>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="col-span-2 text-center">
                            <span className="text-white font-bold text-base md:text-lg lg:text-xl">
                              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <div className="bg-black/40 px-4 md:px-8 lg:px-14 py-3 md:py-4 border-2 border-primary/30">
                    <button
                      onClick={handleContinueShopping}
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300 arabic-body text-sm md:text-base lg:text-lg"
                    >
                      {isArabic ? <FaArrowRight className="ml-2" /> : <FaArrowLeft className="mr-2" />}
                      {content.buttons.continueShopping}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Totals */}
              <div className="xl:col-span-1">
                <div className="backdrop-blur-sm rounded-xl p-6 md:p-8 lg:p-10 sticky top-24 shadow-2xl border-2 border-primary/30">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 md:mb-8 lg:mb-10 arabic-heading-font text-white uppercase tracking-wider">
                    CART TOTALS
                  </h3>

                  <div className="space-y-4 md:space-y-5 lg:space-y-7 mb-6 md:mb-8 lg:mb-10">
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="arabic-body text-sm md:text-base lg:text-lg">{content.summary.subtotal}</span>
                      <span className="font-bold text-white text-sm md:text-base lg:text-lg">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="arabic-body text-sm md:text-base lg:text-lg">
                        {content.summary.tax}
                      </span>
                      <span className="font-bold text-white text-sm md:text-base lg:text-lg">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-300">
                      <div>
                        <span className="arabic-body text-sm md:text-base lg:text-lg">{content.summary.delivery}</span>
                        {deliveryFee === 0 && (
                          <div className="text-xs text-green-400 arabic-body">
                            {isArabic ? 'مجاني!' : 'Free!'}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-white text-sm md:text-base lg:text-lg">
                        {deliveryFee === 0 ? (isArabic ? 'مجاني' : 'Free') : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-gray-300">
                        <span className="arabic-body text-sm md:text-base lg:text-lg">{content.summary.discount}</span>
                        <span className="font-bold text-green-400 text-sm md:text-base lg:text-lg">
                          -${discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-600 pt-4 md:pt-5 lg:pt-7">
                      <div className="flex justify-between items-center text-base md:text-lg lg:text-xl font-bold">
                        <span className="arabic-heading-font text-white">TOTAL</span>
                        <span className="text-white">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Savings Info */}
                    {subtotal < 100 && (
                      <div className="text-xs md:text-sm text-gray-400 arabic-body text-center">
                       
                      </div>
                    )}
                  </div>

                  {/* Proceed to Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-primary text-white py-3 md:py-4 lg:py-5 px-6 md:px-8 lg:px-10 rounded-xl hover:bg-primary/90 transition-all duration-300 font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {content.buttons.proceedToCheckout}
                  </button>

                  {/* Security Notice */}
                  <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-xs" />
                      </div>
                      <span className="text-xs md:text-sm text-green-400 arabic-body">
                        {isArabic ? 'دفع آمن ومضمون' : 'Secure & Safe Payment'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Cart