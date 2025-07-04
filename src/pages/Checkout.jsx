import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaCreditCard, FaPaypal, FaLock, FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import { useCart, useRTL } from '../App'
import HeroSection from './../components/HeroSection'

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
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

const Checkout = () => {
  const { isArabic } = useRTL()
  const { cartItems, clearCart } = useCart()

  const [step, setStep] = useState(1) // 1: Info, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phoneCountry: 'saudi', // 'saudi' or 'egypt'
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

  // Note: Cart empty check is handled in the render logic below

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

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
      phoneCountry: 'الدولة',
      phone: 'رقم الهاتف'
    },
    phoneCountries: {
      saudi: 'المملكة العربية السعودية (+966)',
      egypt: 'مصر (+20)'
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
      discount: 'الخصم',
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
      phoneSaudi: '5X XXX XXXX',
      phoneEgypt: '1X XXXX XXXX',
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
    },
    orderConfirmModal: {
      title: 'تأكيد الطلب',
      message: 'هل أنت متأكد من أنك تريد تأكيد طلبك؟',
      orderTotal: 'إجمالي الطلب',
      confirmButton: 'نعم، أكد الطلب',
      cancelButton: 'إلغاء'
    },
    successModal: {
      title: 'تم تأكيد طلبك بنجاح! 🎉',
      orderNumber: 'رقم الطلب',
      message: 'شكراً لك! تم استلام طلبك وسيتم التواصل معك قريباً لتأكيد التوصيل.',
      estimatedDelivery: 'وقت التوصيل المتوقع: 30-45 دقيقة',
      continueShoppingButton: 'متابعة التسوق',
      closeButton: 'إغلاق'
    },
    validation: {
      required: 'هذا الحقل مطلوب',
      emailInvalid: 'بريد إلكتروني غير صالح',
      phoneInvalidSaudi: 'رقم هاتف سعودي غير صالح - يجب أن يبدأ بـ 5 ويتكون من 9 أرقام',
      phoneInvalidEgypt: 'رقم هاتف مصري غير صالح - يجب أن يبدأ بـ 1 ويتكون من 10 أرقام',
      cardInvalid: 'رقم بطاقة غير صالح',
      expiryInvalid: 'تاريخ انتهاء غير صالح',
      cvvInvalid: 'رمز أمان غير صالح'
    },
    messages: {
      orderSuccess: 'تم تأكيد طلبك بنجاح!',
      orderError: 'حدث خطأ في معالجة طلبك',
      processingOrder: 'جاري معالجة طلبك...',
      validationError: 'يرجى تصحيح الأخطاء في النموذج'
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
      phoneCountry: 'Country',
      phone: 'Phone Number'
    },
    phoneCountries: {
      saudi: 'Saudi Arabia (+966)',
      egypt: 'Egypt (+20)'
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
      discount: 'Discount',
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
      phoneSaudi: '5X XXX XXXX',
      phoneEgypt: '1X XXXX XXXX',
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
    },
    orderConfirmModal: {
      title: 'Confirm Order',
      message: 'Are you sure you want to confirm your order?',
      orderTotal: 'Order Total',
      confirmButton: 'Yes, Confirm Order',
      cancelButton: 'Cancel'
    },
    successModal: {
      title: 'Order Confirmed Successfully! 🎉',
      orderNumber: 'Order Number',
      message: 'Thank you! Your order has been received and we will contact you shortly to confirm delivery.',
      estimatedDelivery: 'Estimated delivery time: 30-45 minutes',
      continueShoppingButton: 'Continue Shopping',
      closeButton: 'Close'
    },
    validation: {
      required: 'This field is required',
      emailInvalid: 'Invalid email address',
      phoneInvalidSaudi: 'Invalid Saudi phone number - must start with 5 and be 9 digits',
      phoneInvalidEgypt: 'Invalid Egyptian phone number - must start with 1 and be 10 digits',
      cardInvalid: 'Invalid card number',
      expiryInvalid: 'Invalid expiry date',
      cvvInvalid: 'Invalid CVV'
    },
    messages: {
      orderSuccess: 'Order placed successfully!',
      orderError: 'Error processing your order',
      processingOrder: 'Processing your order...',
      validationError: 'Please correct the errors in the form'
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRate = 0.15
  const tax = subtotal * taxRate
  const deliveryFee = subtotal >= 100 ? 0 : 10
  const discount = subtotal >= 50 ? 5 : 0
  const total = subtotal + tax + deliveryFee - discount

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (step === 1) {
      // Customer info validation
      if (!formData.firstName.trim()) newErrors.firstName = content.validation.required
      if (!formData.lastName.trim()) newErrors.lastName = content.validation.required
      if (!formData.email.trim()) {
        newErrors.email = content.validation.required
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = content.validation.emailInvalid
      }
      if (!formData.phone.trim()) {
        newErrors.phone = content.validation.required
      } else {
        const cleanPhone = formData.phone.replace(/\s/g, '')
        
        if (formData.phoneCountry === 'saudi') {
          // Saudi format: 5XXXXXXXX (9 digits starting with 5)
          if (!/^5\d{8}$/.test(cleanPhone)) {
            newErrors.phone = content.validation.phoneInvalidSaudi
          }
        } else if (formData.phoneCountry === 'egypt') {
          // Egyptian format: 1XXXXXXXXX (10 digits starting with 1)
          if (!/^1[0125]\d{8}$/.test(cleanPhone)) {
            newErrors.phone = content.validation.phoneInvalidEgypt
          }
        }
      }

      // Delivery info validation
      if (!formData.address.trim()) newErrors.address = content.validation.required
      if (!formData.city.trim()) newErrors.city = content.validation.required
    }

    if (step === 2 && formData.paymentMethod === 'card') {
      // Card validation
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = content.validation.required
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = content.validation.cardInvalid
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = content.validation.required
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = content.validation.expiryInvalid
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = content.validation.required
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = content.validation.cvvInvalid
      }
      if (!formData.cardholderName.trim()) newErrors.cardholderName = content.validation.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  // Format phone number based on selected country
  const formatPhoneNumber = (value, country) => {
    let v = value.replace(/\D/g, '')
    
    if (country === 'egypt') {
      // Egyptian format: 1X XXXX XXXX (10 digits starting with 1)
      // Auto-add 1 prefix if not present
      if (v.length > 0 && !v.startsWith('1')) {
        if (v.startsWith('0') || v.startsWith('2')) {
          v = '1' + v
        } else {
          v = '1' + v
        }
      }
      
      // Limit to 10 digits
      v = v.substring(0, 10)
      
      // Format as 1X XXXX XXXX
      if (v.length >= 6) {
        return v.substring(0, 2) + ' ' + v.substring(2, 6) + ' ' + v.substring(6, 10)
      } else if (v.length >= 2) {
        return v.substring(0, 2) + ' ' + v.substring(2)
      }
      return v
    } else {
      // Saudi format: 5X XXX XXXX (9 digits starting with 5)
      // Auto-add 5 prefix if not present
      if (v.length > 0 && !v.startsWith('5')) {
        if (v.startsWith('0')) {
          v = '5' + v.substring(1)
        } else {
          v = '5' + v
        }
      }
      
      // Limit to 9 digits
      v = v.substring(0, 9)
      
      // Format as 5X XXX XXXX
      if (v.length >= 5) {
        return v.substring(0, 2) + ' ' + v.substring(2, 5) + ' ' + v.substring(5, 9)
      } else if (v.length >= 2) {
        return v.substring(0, 2) + ' ' + v.substring(2)
      }
      return v
    }
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target
    let updatedFormData = { ...formData }

    // Format specific fields
    if (name === 'cardNumber') {
      value = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      value = formatExpiryDate(value)
    } else if (name === 'phone') {
      value = formatPhoneNumber(value, formData.phoneCountry)
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4)
    } else if (name === 'phoneCountry') {
      // Clear phone number when country changes
      updatedFormData.phone = ''
      // Also clear phone error if exists
      if (errors.phone) {
        setErrors({
          ...errors,
          phone: ''
        })
      }
    }

    updatedFormData[name] = value
    setFormData(updatedFormData)

    // Clear error when user starts typing
    if (errors[name] && name !== 'phoneCountry') {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1)
    } else {
      showToast(content.messages.validationError, 'error')
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      showToast(content.messages.validationError, 'error')
      return
    }
    
    // Show confirmation modal first
    setShowOrderConfirmModal(true)
  }

  const confirmPlaceOrder = async () => {
    setShowOrderConfirmModal(false)
    setLoading(true)
    showToast(content.messages.processingOrder, 'info')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate order number
      const orderNumber = Date.now().toString(36).toUpperCase()
      
      // Store order details
      const newOrderData = {
        orderNumber,
        items: cartItems,
        customerInfo: formData,
        totals: {
          subtotal,
          tax,
          deliveryFee,
          discount,
          total
        },
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      }
      
      localStorage.setItem('lastOrder', JSON.stringify(newOrderData))
      
      // Clear cart and show success modal
      clearCart()
      setOrderData(newOrderData)
      setShowSuccessModal(true)
      
    } catch {
      showToast(content.messages.orderError, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if cart is empty and no success modal is shown
  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="pt-16 md:pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 arabic-heading-font">
            {isArabic ? 'السلة فارغة' : 'Cart is Empty'}
          </h1>
          <Link
            to="/menu"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300"
          >
            {isArabic ? 'متابعة التسوق' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    )
  }

  return (

    <div className="pt-20 md:pt-24">
         <HeroSection
            backgroundImage="/images/bg_3.jpg"
            title={isArabic ? " الدفع" : "Checkout"}
          />
    <div className="pt-16 md:pt-20 relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
      <div className="absolute inset-0"></div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 border-2 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center mx-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-700 text-sm sm:text-base arabic-body">{content.messages.processingOrder}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className=" py-8 sm:py-12 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 space-x-reverse text-sm sm:text-lg">
              <Link to="/" className="text-white hover:text-primary transition-colors arabic-body">
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="text-gray-400">›</span>
              <Link to="/cart" className="text-white hover:text-primary transition-colors arabic-body">
                {isArabic ? 'السلة' : 'Cart'}
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-primary arabic-body">{content.title}</span>
            </div>
          </nav>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 arabic-heading-font text-white">
              {content.title}
            </h1>
            <p className="text-gray-300 arabic-body text-sm sm:text-base">
              {content.subtitle}
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 sm:space-x-8 space-x-reverse">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold ${
                    step >= stepNumber ? 'bg-primary text-white' : 'bg-white/20 text-gray-300'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`mx-2 sm:mx-3 arabic-body text-sm sm:text-base ${
                    step >= stepNumber ? 'text-primary' : 'text-gray-300'
                  }`}>
                    {content.steps[stepNumber]}
                  </span>
                  {stepNumber < 2 && (
                    <div className={`w-12 sm:w-20 h-1 mx-2 sm:mx-4 ${
                      step > stepNumber ? 'bg-primary' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="section-padding relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Checkout Form */}
            <div className="xl:col-span-2">
              {step === 1 && (
                <div className="backdrop-blur-sm border-2 border-primary/30 rounded-xl shadow-2xl p-6 md:p-8">
                  {/* Customer Information */}
                  <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-6 arabic-heading-font text-white">
                      {content.customerInfo.title}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.customerInfo.firstName}
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.firstName}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                            errors.firstName ? 'border-red-500' : 'border-white/20'
                          }`}
                          required
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.customerInfo.lastName}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.lastName}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                            errors.lastName ? 'border-red-500' : 'border-white/20'
                          }`}
                          required
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.lastName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.customerInfo.email}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.email}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                            errors.email ? 'border-red-500' : 'border-white/20'
                          }`}
                          required
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.customerInfo.phoneCountry}
                        </label>
                        <select
                          name="phoneCountry"
                          value={formData.phoneCountry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white"
                        >
                          <option value="saudi" className="text-black">{content.phoneCountries.saudi}</option>
                          <option value="egypt" className="text-black">{content.phoneCountries.egypt}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.customerInfo.phone}
                        </label>
                        <div className="flex">
                          <div className="flex items-center px-3 py-3 bg-white/20 border border-white/20 rounded-l-lg text-white font-medium">
                            {formData.phoneCountry === 'egypt' ? '+20' : '+966'}
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={formData.phoneCountry === 'egypt' ? content.placeholders.phoneEgypt : content.placeholders.phoneSaudi}
                            className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                              errors.phone ? 'border-red-500' : 'border-white/20'
                            }`}
                            dir="ltr"
                            required
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="border-t border-white/20 pt-8">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-6 arabic-heading-font text-white">
                      {content.deliveryInfo.title}
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.deliveryInfo.address}
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.address}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                            errors.address ? 'border-red-500' : 'border-white/20'
                          }`}
                          required
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.address}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 arabic-body">
                            {content.deliveryInfo.city}
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.city}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                              errors.city ? 'border-red-500' : 'border-white/20'
                            }`}
                            required
                          />
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-400 arabic-body">{errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 arabic-body">
                            {content.deliveryInfo.district}
                          </label>
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.district}
                            className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 arabic-body">
                            {content.deliveryInfo.postalCode}
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.postalCode}
                            className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.deliveryInfo.deliveryNotes}
                        </label>
                        <textarea
                          name="deliveryNotes"
                          value={formData.deliveryNotes}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.deliveryNotes}
                          rows={3}
                          className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body resize-none bg-white/10 text-white placeholder-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="backdrop-blur-sm border-2 border-primary/30 rounded-xl shadow-2xl p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6 arabic-heading-font text-white">
                    {content.paymentInfo.title}
                  </h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-4 arabic-body">
                      {content.paymentInfo.paymentMethod}
                    </label>
                    
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 bg-white/10">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="mr-3 ml-3"
                        />
                        <FaCreditCard className="w-5 h-5 text-white mr-3 ml-3" />
                        <span className="arabic-body text-white">{content.paymentInfo.card}</span>
                      </label>
                      
                      <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 bg-white/10">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="mr-3 ml-3"
                        />
                        <span className="w-5 h-5 mr-3 ml-3 text-white">💵</span>
                        <span className="arabic-body text-white">{content.paymentInfo.cash}</span>
                      </label>
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.paymentInfo.cardNumber}
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.cardNumber}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 text-white placeholder-gray-300 ${
                            errors.cardNumber ? 'border-red-500' : 'border-white/20'
                          }`}
                          dir="ltr"
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 arabic-body">
                            {content.paymentInfo.expiryDate}
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.expiryDate}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 text-white placeholder-gray-300 ${
                              errors.expiryDate ? 'border-red-500' : 'border-white/20'
                            }`}
                            dir="ltr"
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-400 arabic-body">{errors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 arabic-body">
                            {content.paymentInfo.cvv}
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder={content.placeholders.cvv}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 text-white placeholder-gray-300 ${
                              errors.cvv ? 'border-red-500' : 'border-white/20'
                            }`}
                            dir="ltr"
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-400 arabic-body">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 arabic-body">
                          {content.paymentInfo.cardholderName}
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          placeholder={content.placeholders.cardholderName}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent arabic-body bg-white/10 text-white placeholder-gray-300 ${
                            errors.cardholderName ? 'border-red-500' : 'border-white/20'
                          }`}
                        />
                        {errors.cardholderName && (
                          <p className="mt-1 text-sm text-red-400 arabic-body">{errors.cardholderName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FaLock className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-green-400 arabic-body">
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
                    className="inline-flex items-center text-gray-300 hover:text-primary transition-colors duration-300 arabic-body text-sm sm:text-base"
                  >
                    {isArabic ? <FaArrowRight className="ml-2" /> : <FaArrowLeft className="mr-2" />}
                    {content.buttons.backToCart}
                  </Link>
                  
                  {step > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="inline-flex items-center text-gray-300 hover:text-primary transition-colors duration-300 arabic-body text-sm sm:text-base"
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
                      disabled={loading}
                      className="bg-primary text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {content.buttons.continue}
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>{content.messages.processingOrder}</span>
                        </div>
                      ) : (
                        content.buttons.placeOrder
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="backdrop-blur-sm border-2 border-primary/30 rounded-xl shadow-2xl p-6 md:p-8 sticky top-24">
                <h3 className="text-lg sm:text-xl font-semibold mb-6 arabic-heading-font text-white">
                  {content.orderSummary.title}
                </h3>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.src = '/images/menu1.jpg'
                        }}
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium arabic-heading-font text-sm text-white">{item.name}</h4>
                        <p className="text-sm text-gray-300">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold text-white text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="arabic-body text-sm sm:text-base">{content.orderSummary.subtotal}</span>
                    <span className="text-white text-sm sm:text-base">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="arabic-body text-sm sm:text-base">{content.orderSummary.tax}</span>
                    <span className="text-white text-sm sm:text-base">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="arabic-body text-sm sm:text-base">{content.orderSummary.delivery}</span>
                    <span className="text-white text-sm sm:text-base">
                      {deliveryFee === 0 ? (isArabic ? 'مجاني' : 'Free') : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="arabic-body text-sm sm:text-base">{content.orderSummary.discount}</span>
                      <span className="text-green-400 text-sm sm:text-base">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t border-white/20 pt-3">
                    <span className="arabic-heading-font text-white">TOTAL</span>
                    <span className="text-white">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Confirmation Modal */}
      {showOrderConfirmModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 arabic-heading-font">
                  {content.orderConfirmModal.title}
                </h3>
                <p className="text-gray-600 arabic-body">
                  {content.orderConfirmModal.message}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 arabic-body">
                    {content.orderConfirmModal.orderTotal}:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2 arabic-body">
                  {cartItems.length} {isArabic ? 'منتج' : 'items'}
                </div>
              </div>

              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowOrderConfirmModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 arabic-body"
                >
                  {content.orderConfirmModal.cancelButton}
                </button>
                <button
                  onClick={confirmPlaceOrder}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 arabic-body"
                >
                  {content.orderConfirmModal.confirmButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && orderData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 arabic-heading-font">
                  {content.successModal.title}
                </h3>
                <p className="text-gray-600 arabic-body">
                  {content.successModal.message}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1 arabic-body">
                    {content.successModal.orderNumber}
                  </div>
                  <div className="text-xl font-bold text-green-700 mb-3">
                    #{orderData.orderNumber}
                  </div>
                  <div className="text-sm text-green-600 arabic-body">
                    {content.successModal.estimatedDelivery}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 arabic-body"
                >
                  {content.successModal.closeButton}
                </button>
                <Link
                  to="/menu"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 arabic-body text-center"
                  onClick={() => setShowSuccessModal(false)}
                >
                  {content.successModal.continueShoppingButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   </div>
  )
}

export default Checkout 