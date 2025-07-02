import React from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useCart, useRTL } from '../App'

const Cart = () => {
  const { isArabic } = useRTL()
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart()

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
      total: 'المجموع',
      actions: 'الإجراءات'
    },
    summary: {
      title: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      tax: 'ضريبة القيمة المضافة (15%)',
      shipping: 'التوصيل',
      total: 'المجموع الكلي',
      shippingNote: 'مجاني للطلبات فوق 100 ريال'
    },
    buttons: {
      continueShopping: 'متابعة التسوق',
      clearCart: 'إفراغ السلة',
      checkout: 'إتمام الطلب',
      remove: 'حذف',
      update: 'تحديث'
    },
    messages: {
      itemRemoved: 'تم حذف المنتج من السلة',
      quantityUpdated: 'تم تحديث الكمية'
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
      total: 'Total',
      actions: 'Actions'
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'VAT (15%)',
      shipping: 'Shipping',
      total: 'Total',
      shippingNote: 'Free shipping on orders over 100 SAR'
    },
    buttons: {
      continueShopping: 'Continue Shopping',
      clearCart: 'Clear Cart',
      checkout: 'Checkout',
      remove: 'Remove',
      update: 'Update'
    },
    messages: {
      itemRemoved: 'Item removed from cart',
      quantityUpdated: 'Quantity updated'
    }
  }

  // Sample cart items if cart is empty (for demonstration)
  const sampleItems = cartItems.length === 0 ? [
    {
      id: 1,
      name: isArabic ? 'كابتشينو' : 'Cappuccino',
      price: 20,
      quantity: 2,
      image: '/images/drink-2.jpg',
      description: isArabic ? 'إسبريسو مع حليب مبخر ورغوة كثيفة' : 'Espresso with steamed milk and thick foam'
    },
    {
      id: 2,
      name: isArabic ? 'تيراميسو' : 'Tiramisu',
      price: 35,
      quantity: 1,
      image: '/images/dessert-1.jpg',
      description: isArabic ? 'حلوى إيطالية كلاسيكية بطعم القهوة' : 'Classic Italian dessert with coffee flavor'
    }
  ] : cartItems

  const subtotal = sampleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.15
  const shipping = subtotal >= 100 ? 0 : 25
  const finalTotal = subtotal + tax + shipping

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateCartItemQuantity(itemId, newQuantity)
    }
  }

  const clearAllItems = () => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من إفراغ السلة؟' : 'Are you sure you want to clear the cart?')) {
      sampleItems.forEach(item => removeFromCart(item.id))
    }
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 arabic-heading-font">
              {content.title}
            </h1>
            <p className="text-gray-600 arabic-body">
              {content.subtitle}
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary transition-colors arabic-body">
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary arabic-body">{content.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="section-padding">
        <div className="container-custom">
          {sampleItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <FaShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 arabic-heading-font">
                {content.empty.title}
              </h2>
              <p className="text-gray-600 mb-8 arabic-body">
                {content.empty.message}
              </p>
              <Link
                to="/menu"
                className="bg-primary text-white px-8 py-3 rounded hover:bg-primary/90 transition-colors duration-300"
              >
                {content.empty.button}
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Cart Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold arabic-heading-font">
                        {sampleItems.length} {isArabic ? 'منتج في السلة' : 'items in cart'}
                      </h2>
                      <button
                        onClick={clearAllItems}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 arabic-body"
                      >
                        {content.buttons.clearCart}
                      </button>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="divide-y divide-gray-200">
                    {sampleItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold mb-1 arabic-heading-font">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 arabic-body">
                              {item.description}
                            </p>
                            <p className="text-primary font-semibold">
                              {item.price} {isArabic ? 'ريال' : 'SAR'}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-center min-w-[80px]">
                            <p className="font-semibold">
                              {item.price * item.quantity} {isArabic ? 'ريال' : 'SAR'}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-300 p-2"
                            title={content.buttons.remove}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-6">
                  <Link
                    to="/menu"
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300 arabic-body"
                  >
                    {isArabic ? <FaArrowRight className="ml-2" /> : <FaArrowLeft className="mr-2" />}
                    {content.buttons.continueShopping}
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-semibold mb-6 arabic-heading-font">
                    {content.summary.title}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="arabic-body">{content.summary.subtotal}</span>
                      <span className="font-semibold">
                        {subtotal.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="arabic-body">{content.summary.tax}</span>
                      <span className="font-semibold">
                        {tax.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="arabic-body">{content.summary.shipping}</span>
                        {shipping === 0 && (
                          <div className="text-xs text-green-600 arabic-body">
                            {isArabic ? 'مجاني!' : 'Free!'}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold">
                        {shipping === 0 ? (isArabic ? 'مجاني' : 'Free') : `${shipping} ${isArabic ? 'ريال' : 'SAR'}`}
                      </span>
                    </div>

                    {subtotal < 100 && (
                      <div className="text-xs text-gray-500 arabic-body">
                        {content.summary.shippingNote}
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="arabic-heading-font">{content.summary.total}</span>
                        <span>
                          {finalTotal.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300 block text-center font-medium"
                  >
                    {content.buttons.checkout}
                  </Link>

                  {/* Security Notice */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-600 arabic-body">
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

      {/* Recommended Products */}
      {sampleItems.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12 arabic-heading-font">
              {isArabic ? 'منتجات قد تعجبك' : 'You Might Also Like'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: isArabic ? 'لاتيه' : 'Latte',
                  price: 22,
                  image: '/images/drink-3.jpg'
                },
                {
                  name: isArabic ? 'براونيز' : 'Brownies',
                  price: 28,
                  image: '/images/dessert-3.jpg'
                },
                {
                  name: isArabic ? 'قهوة عربية' : 'Arabic Coffee',
                  price: 18,
                  image: '/images/drink-4.jpg'
                }
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 arabic-heading-font">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">
                        {product.price} {isArabic ? 'ريال' : 'SAR'}
                      </span>
                      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors duration-300 text-sm">
                        {isArabic ? 'أضف' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Cart 