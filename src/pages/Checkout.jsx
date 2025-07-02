import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaCreditCard, FaPaypal, FaLock, FaCheck } from 'react-icons/fa'
import { useCart, useRTL } from '../App'

const Checkout = () => {
  const { isArabic } = useRTL()
  const { cartItems } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1: Info, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Info
    address: '',
    city: '',
    district: '',
    postalCode: '',
    deliveryNotes: '',
    
    // Payment Info
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const content = isArabic ? {
    title: 'إتمام الطلب',
    subtitle: 'أكمل طلبك بسهولة وأمان',
    steps: {
      1: 'معلومات الشحن',
      2: 'الدفع',
      3: 'تأكيد الطلب'
    },
    customerInfo: {
      title: 'معلومات العميل',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف'
    },
    deliveryInfo: {
      title: 'معلومات التوصيل',
      address: 'العنوان',
      city: 'المدينة',
      district: 'الحي',
      postalCode: 'الرمز البريدي',
      deliveryNotes: 'ملاحظات التوصيل'
    },
    paymentInfo: {
      title: 'معلومات الدفع',
      paymentMethod: 'طريقة الدفع',
      card: 'بطاقة ائتمان',
      cash: 'الدفع عند الاستلام',
      paypal: 'باي بال',
      cardNumber: 'رقم البطاقة',
      expiryDate: 'تاريخ الانتهاء',
      cvv: 'رمز الأمان',
      cardholderName: 'اسم حامل البطاقة'
    },
    orderSummary: {
      title: 'ملخص الطلب',
      items: 'المنتجات',
      subtotal: 'المجموع الفرعي',
      tax: 'ضريبة القيمة المضافة (15%)',
      delivery: 'رسوم التوصيل',
      total: 'المجموع الكلي'
    },
    buttons: {
      continue: 'متابعة',
      back: 'رجوع',
      placeOrder: 'تأكيد الطلب',
      backToCart: 'العودة للسلة'
    },
    placeholders: {
      firstName: 'أدخل اسمك الأول',
      lastName: 'أدخل اسمك الأخير',
      email: 'أدخل بريدك الإلكتروني',
      phone: 'أدخل رقم هاتفك',
      address: 'أدخل عنوانك الكامل',
      city: 'أدخل المدينة',
      district: 'أدخل الحي',
      postalCode: 'أدخل الرمز البريدي',
      deliveryNotes: 'ملاحظات إضافية للتوصيل',
      cardNumber: '1234 5678 9012 3456',
      expiryDate: 'MM/YY',
      cvv: '123',
      cardholderName: 'اسم حامل البطاقة'
    },
    confirmation: {
      title: 'تم تأكيد طلبك!',
      orderNumber: 'رقم الطلب',
      message: 'شكراً لك! تم استلام طلبك وسيتم التواصل معك قريباً لتأكيد التوصيل.',
      estimatedDelivery: 'وقت التوصيل المتوقع: 30-45 دقيقة',
      trackOrder: 'تتبع الطلب',
      continueShopping: 'متابعة التسوق'
    }
  } : {
    title: 'Checkout',
    subtitle: 'Complete your order safely and easily',
    steps: {
      1: 'Shipping Info',
      2: 'Payment',
      3: 'Order Confirmation'
    },
    customerInfo: {
      title: 'Customer Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number'
    },
    deliveryInfo: {
      title: 'Delivery Information',
      address: 'Address',
      city: 'City',
      district: 'District',
      postalCode: 'Postal Code',
      deliveryNotes: 'Delivery Notes'
    },
    paymentInfo: {
      title: 'Payment Information',
      paymentMethod: 'Payment Method',
      card: 'Credit Card',
      cash: 'Cash on Delivery',
      paypal: 'PayPal',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      cardholderName: 'Cardholder Name'
    },
    orderSummary: {
      title: 'Order Summary',
      items: 'Items',
      subtotal: 'Subtotal',
      tax: 'VAT (15%)',
      delivery: 'Delivery Fee',
      total: 'Total'
    },
    buttons: {
      continue: 'Continue',
      back: 'Back',
      placeOrder: 'Place Order',
      backToCart: 'Back to Cart'
    },
    placeholders: {
      firstName: 'Enter your first name',
      lastName: 'Enter your last name',
      email: 'Enter your email',
      phone: 'Enter your phone number',
      address: 'Enter your full address',
      city: 'Enter city',
      district: 'Enter district',
      postalCode: 'Enter postal code',
      deliveryNotes: 'Additional delivery notes',
      cardNumber: '1234 5678 9012 3456',
      expiryDate: 'MM/YY',
      cvv: '123',
      cardholderName: 'Cardholder name'
    },
    confirmation: {
      title: 'Order Confirmed!',
      orderNumber: 'Order Number',
      message: 'Thank you! Your order has been received and we will contact you shortly to confirm delivery.',
      estimatedDelivery: 'Estimated delivery time: 30-45 minutes',
      trackOrder: 'Track Order',
      continueShopping: 'Continue Shopping'
    }
  }

  // Sample cart items for demo
  const sampleItems = cartItems.length === 0 ? [
    {
      id: 1,
      name: isArabic ? 'كابتشينو' : 'Cappuccino',
      price: 20,
      quantity: 2,
      image: '/images/drink-2.jpg'
    },
    {
      id: 2,
      name: isArabic ? 'تيراميسو' : 'Tiramisu',
      price: 35,
      quantity: 1,
      image: '/images/dessert-1.jpg'
    }
  ] : cartItems

  const subtotal = sampleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.15
  const delivery = subtotal >= 100 ? 0 : 25
  const total = subtotal + tax + delivery

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handlePlaceOrder = () => {
    // Generate random order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Store order details (in real app, send to backend)
    const orderData = {
      orderNumber,
      items: sampleItems,
      customerInfo: formData,
      total: total,
      orderDate: new Date().toISOString()
    }
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData))
    setStep(3)
  }

  if (step === 3) {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}')
    
    return (
      <div className="pt-16 md:pt-20">
        <section className="section-padding">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4 arabic-heading-font">
                {content.confirmation.title}
              </h1>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-lg mb-2 arabic-body">
                  {content.confirmation.orderNumber}: #{lastOrder.orderNumber}
                </p>
                <p className="text-gray-600 arabic-body">
                  {content.confirmation.message}
                </p>
              </div>
              
              <p className="text-primary font-semibold mb-8 arabic-body">
                {content.confirmation.estimatedDelivery}
              </p>
              
              <div className="space-y-4">
                <button className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300">
                  {content.confirmation.trackOrder}
                </button>
                
                <Link
                  to="/menu"
                  className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-center"
                >
                  {content.confirmation.continueShopping}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="bg-gray-50 py-12">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 arabic-heading-font">
              {content.title}
            </h1>
            <p className="text-gray-600 arabic-body">
              {content.subtitle}
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-8 space-x-reverse">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`mx-3 arabic-body ${
                    step >= stepNumber ? 'text-primary' : 'text-gray-600'
                  }`}>
                    {content.steps[stepNumber]}
                  </span>
                  {stepNumber < 2 && (
                    <div className={`w-20 h-1 mx-4 ${
                      step > stepNumber ? 'bg-primary' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="section-padding">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="space-y-8">
                  {/* Customer Information */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6 arabic-heading-font">
                      {content.customerInfo.title}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.customerInfo.firstName}
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.firstName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.customerInfo.lastName}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.lastName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.customerInfo.email}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.customerInfo.phone}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.phone}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6 arabic-heading-font">
                      {content.deliveryInfo.title}
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.deliveryInfo.address}
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.address}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                            {content.deliveryInfo.city}
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.city}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                            {content.deliveryInfo.district}
                          </label>
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.district}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                            {content.deliveryInfo.postalCode}
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.postalCode}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.deliveryInfo.deliveryNotes}
                        </label>
                        <textarea
                          name="deliveryNotes"
                          value={formData.deliveryNotes}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.deliveryNotes}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6 arabic-heading-font">
                    {content.paymentInfo.title}
                  </h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4 arabic-body">
                      {content.paymentInfo.paymentMethod}
                    </label>
                    
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="mr-3 ml-3"
                        />
                        <FaCreditCard className="w-5 h-5 text-gray-600 mr-3 ml-3" />
                        <span className="arabic-body">{content.paymentInfo.card}</span>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="mr-3 ml-3"
                        />
                        <span className="w-5 h-5 mr-3 ml-3 text-gray-600">💵</span>
                        <span className="arabic-body">{content.paymentInfo.cash}</span>
                      </label>
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.paymentInfo.cardNumber}
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.cardNumber}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          dir="ltr"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                            {content.paymentInfo.expiryDate}
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.expiryDate}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            dir="ltr"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                            {content.paymentInfo.cvv}
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.cvv}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 arabic-body">
                          {content.paymentInfo.cardholderName}
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.cardholderName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FaLock className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600 arabic-body">
                        {isArabic ? 'معلوماتك محمية بتشفير SSL آمن' : 'Your information is protected with secure SSL encryption'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <div className="flex space-x-4 space-x-reverse">
                  <Link
                    to="/cart"
                    className="inline-flex items-center text-gray-600 hover:text-primary transition-colors duration-300 arabic-body"
                  >
                    {isArabic ? <FaArrowRight className="ml-2" /> : <FaArrowLeft className="mr-2" />}
                    {content.buttons.backToCart}
                  </Link>
                  
                  {step > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="inline-flex items-center text-gray-600 hover:text-primary transition-colors duration-300 arabic-body"
                    >
                      {isArabic ? <FaArrowRight className="ml-2" /> : <FaArrowLeft className="mr-2" />}
                      {content.buttons.back}
                    </button>
                  )}
                </div>
                
                <div>
                  {step < 2 ? (
                    <button
                      onClick={handleNextStep}
                      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                    >
                      {content.buttons.continue}
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                      {content.buttons.placeOrder}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-6 arabic-heading-font">
                  {content.orderSummary.title}
                </h3>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {sampleItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium arabic-heading-font text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {item.price} {isArabic ? 'ريال' : 'SAR'}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {item.price * item.quantity} {isArabic ? 'ريال' : 'SAR'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="arabic-body">{content.orderSummary.subtotal}</span>
                    <span>{subtotal.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="arabic-body">{content.orderSummary.tax}</span>
                    <span>{tax.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="arabic-body">{content.orderSummary.delivery}</span>
                    <span>
                      {delivery === 0 ? (isArabic ? 'مجاني' : 'Free') : `${delivery} ${isArabic ? 'ريال' : 'SAR'}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                    <span className="arabic-heading-font">{content.orderSummary.total}</span>
                    <span>{total.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout 