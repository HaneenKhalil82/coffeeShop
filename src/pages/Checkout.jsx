import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaCreditCard, FaPaypal, FaMoneyBill, FaCheckCircle, FaExclamationTriangle, FaTimes, FaCheck, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa'
import { useCart, useRTL } from '../App'
import { useAuth } from '../contexts/AuthContext'
import { getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress, getDeliveryFee, validatePromoCode, placeOrder, getDeliveryLocations } from '../services/api'
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
  const { isAuthenticated } = useAuth()
  const { cartItems, clearCart } = useCart()
  const navigate = useNavigate()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // All state declarations first
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderData, setOrderData] = useState(null)

  // Address Management
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    title: '',
    address: '',
    building_number: '',
    apartment_number: '',
    floor: '',
    additional_notes: '',
    delivery_location_id: '',
    is_default: false
  })

  // Delivery & Pricing
  const [deliveryLocations, setDeliveryLocations] = useState([])
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [calculatingDeliveryFee, setCalculatingDeliveryFee] = useState(false)

  // Promo Code
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [validatingPromo, setValidatingPromo] = useState(false)

  // Order Type
  const [orderType, setOrderType] = useState('delivery') // 'delivery' or 'takeaway'

  // Payment Info
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountry: 'egypt', // Default country
    // Address Information
    address: '',
    city: '',
    // Payment Information
    paymentMethod: 'cash_on_delivery',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    // Additional Notes
    customer_notes: '',
    scheduled_delivery_time: ''
  })

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses()
      loadDeliveryLocations()
    }
  }, [isAuthenticated])

  // Calculate delivery fee when address changes
  useEffect(() => {
    if (selectedAddressId && orderType === 'delivery') {
      calculateDeliveryFee()
    } else if (orderType === 'takeaway') {
      setDeliveryFee(0)
    }
  }, [selectedAddressId, orderType])

  const loadAddresses = async () => {
    try {
      const response = await getUserAddresses()
      const addressesData = response.data.data || response.data
      setAddresses(Array.isArray(addressesData) ? addressesData : [])
      
      // Auto-select default address
      const defaultAddress = addressesData.find(addr => addr.is_default)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id)
      } else if (addressesData.length > 0) {
        setSelectedAddressId(addressesData[0].id)
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      showToast(isArabic ? 'خطأ في تحميل العناوين' : 'Error loading addresses', 'error')
    }
  }

  const loadDeliveryLocations = async () => {
    try {
      const response = await getDeliveryLocations()
      const locationsData = response.data.data || response.data
      setDeliveryLocations(Array.isArray(locationsData) ? locationsData : [])
    } catch (error) {
      console.error('Error loading delivery locations:', error)
    }
  }

  const calculateDeliveryFee = async () => {
    if (!selectedAddressId) return
    
    setCalculatingDeliveryFee(true)
    try {
      const response = await getDeliveryFee(selectedAddressId)
      const fee = response.data.delivery_fee || response.data.data?.delivery_fee || 0
      setDeliveryFee(Number(fee) || 0)
    } catch (error) {
      console.error('Error calculating delivery fee:', error)
      setDeliveryFee(10) // Fallback fee
      showToast(isArabic ? 'خطأ في حساب رسوم التوصيل' : 'Error calculating delivery fee', 'error')
    } finally {
      setCalculatingDeliveryFee(false)
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  const content = isArabic ? {
    title: 'إتمام الطلب',
    steps: {
      address: 'العنوان',
      payment: 'الدفع',
      confirm: 'التأكيد'
    },
    orderType: {
      title: 'نوع الطلب',
      delivery: 'توصيل',
      takeaway: 'استلام من المحل'
    },
    address: {
      title: 'عنوان التوصيل',
      select: 'اختر العنوان',
      add: 'إضافة عنوان جديد',
      edit: 'تعديل',
      delete: 'حذف',
      form: {
        title: 'اسم العنوان',
        address: 'العنوان',
        building: 'رقم المبنى',
        apartment: 'رقم الشقة',
        floor: 'الطابق',
        notes: 'ملاحظات إضافية',
        location: 'منطقة التوصيل',
        default: 'جعل هذا العنوان الافتراضي'
      }
    },
    promo: {
      title: 'كود الخصم',
      placeholder: 'أدخل كود الخصم',
      apply: 'تطبيق',
      validating: 'جاري التحقق...'
    },
    orderSummary: {
      title: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      delivery: 'التوصيل',
      discount: 'الخصم',
      total: 'المجموع الكلي'
    },
    paymentInfo: {
      title: 'معلومات الدفع',
      method: 'طريقة الدفع',
      cash: 'الدفع عند الاستلام',
      card: 'بطاقة ائتمانية',
      paypal: 'PayPal'
    },
    buttons: {
      back: 'رجوع',
      next: 'التالي',
      placeOrder: 'تأكيد الطلب',
      save: 'حفظ',
      cancel: 'إلغاء'
    },
    messages: {
      orderSuccess: 'تم تأكيد طلبك بنجاح!',
      processingOrder: 'جاري معالجة الطلب...',
      orderError: 'خطأ في تأكيد الطلب',
      validationError: 'يرجى تعبئة جميع الحقول المطلوبة'
    },
    validation: {
      required: 'هذا الحقل مطلوب',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
      phoneInvalidSaudi: 'يرجى إدخال رقم هاتف سعودي صحيح (5XXXXXXXX)',
      phoneInvalidEgypt: 'يرجى إدخال رقم هاتف مصري صحيح (1XXXXXXXXX)',
      cardInvalid: 'يرجى إدخال رقم بطاقة صحيح',
      expiryInvalid: 'يرجى إدخال تاريخ انتهاء صحيح (MM/YY)',
      cvvInvalid: 'يرجى إدخال رمز CVV صحيح'
    }
  } : {
    title: 'Checkout',
    steps: {
      address: 'Address',
      payment: 'Payment',
      confirm: 'Confirmation'
    },
    orderType: {
      title: 'Order Type',
      delivery: 'Delivery',
      takeaway: 'Takeaway'
    },
    address: {
      title: 'Delivery Address',
      select: 'Select Address',
      add: 'Add New Address',
      edit: 'Edit',
      delete: 'Delete',
      form: {
        title: 'Address Title',
        address: 'Address',
        building: 'Building Number',
        apartment: 'Apartment Number',
        floor: 'Floor',
        notes: 'Additional Notes',
        location: 'Delivery Location',
        default: 'Make this default address'
      }
    },
    promo: {
      title: 'Promo Code',
      placeholder: 'Enter promo code',
      apply: 'Apply',
      validating: 'Validating...'
    },
    orderSummary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'Tax',
      delivery: 'Delivery',
      discount: 'Discount',
      total: 'Total'
    },
    paymentInfo: {
      title: 'Payment Information',
      method: 'Payment Method',
      cash: 'Cash on Delivery',
      card: 'Credit Card',
      paypal: 'PayPal'
    },
    buttons: {
      back: 'Back',
      next: 'Next',
      placeOrder: 'Place Order',
      save: 'Save',
      cancel: 'Cancel'
    },
    messages: {
      orderSuccess: 'Order placed successfully!',
      processingOrder: 'Processing your order...',
      orderError: 'Error placing order',
      validationError: 'Please fill in all required fields'
    },
    validation: {
      required: 'This field is required',
      emailInvalid: 'Please enter a valid email address',
      phoneInvalidSaudi: 'Please enter a valid Saudi phone number (5XXXXXXXX)',
      phoneInvalidEgypt: 'Please enter a valid Egyptian phone number (1XXXXXXXXX)',
      cardInvalid: 'Please enter a valid card number',
      expiryInvalid: 'Please enter a valid expiry date (MM/YY)',
      cvvInvalid: 'Please enter a valid CVV code'
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRate = 0.15
  const tax = subtotal * taxRate
  const total = subtotal + tax + (Number(deliveryFee) || 0) - promoDiscount

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (step === 1) {
      // Order type validation
      if (!orderType) {
        newErrors.orderType = content.validation.required
      }
      
      // Address validation for delivery orders
      if (orderType === 'delivery' && !selectedAddressId) {
        newErrors.address = isArabic ? 'يرجى تحديد عنوان التوصيل' : 'Please select delivery address'
      }
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

  const handlePlaceOrder = async () => {
    setShowOrderConfirmModal(false)
    setLoading(true)
    
    try {
      // Prepare order data for API
      const orderItems = cartItems.map(item => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity),
        notes: item.notes || ''
      }))

      const orderData = {
        branch_id: 1, // Default branch - could be made dynamic
        order_type: orderType,
        payment_method: formData.paymentMethod,
        customer_notes: formData.customer_notes || '',
        items: orderItems
      }

      // Add delivery-specific fields
      if (orderType === 'delivery') {
        if (!selectedAddressId) {
          throw new Error(isArabic ? 'يرجى تحديد عنوان التوصيل' : 'Please select delivery address')
        }
        orderData.user_address_id = Number(selectedAddressId)
        orderData.delivery_notes = addresses.find(addr => addr.id === selectedAddressId)?.additional_notes || ''
      }

      // Add promo code if applied
      if (promoCode && promoDiscount > 0) {
        orderData.promo_code = promoCode
      }

      // Add scheduled delivery time if provided
      if (formData.scheduled_delivery_time) {
        orderData.scheduled_delivery_time = formData.scheduled_delivery_time
      }

      const response = await placeOrder(orderData)
      const newOrderData = response.data.data || response.data

      // Store order details for success modal
      setOrderData({
        ...newOrderData,
        orderNumber: newOrderData.id || newOrderData.order_number || Date.now().toString(36).toUpperCase(),
        items: cartItems,
        totals: {
          subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          tax: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.15,
          deliveryFee,
          discount: promoDiscount,
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.15 + (Number(deliveryFee) || 0) - promoDiscount
        },
        orderDate: new Date().toISOString(),
        status: newOrderData.status || 'confirmed'
      })

      // Clear cart and show success modal
      clearCart()
      setShowSuccessModal(true)
      showToast(isArabic ? 'تم تأكيد طلبك بنجاح!' : 'Order placed successfully!', 'success')
      
    } catch (error) {
      console.error('Error placing order:', error)
      
      // Handle validation errors (422) with specific messages
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors || error.response.data.message || {}
        console.error('Validation errors:', validationErrors)
        
        if (typeof validationErrors === 'object' && Object.keys(validationErrors).length > 0) {
          const errorMessages = Object.values(validationErrors).flat()
          showToast(errorMessages.join('. '), 'error')
        } else {
          showToast(validationErrors || (isArabic ? 'خطأ في البيانات المرسلة' : 'Validation error'), 'error')
        }
      } else {
        showToast(error.response?.data?.message || error.message || (isArabic ? 'خطأ في تأكيد الطلب' : 'Error placing order'), 'error')
      }
    } finally {
      setLoading(false)
    }
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
          discount: promoDiscount,
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

  const handleAddAddress = async () => {
    try {
      setLoading(true)
      const response = await addUserAddress(addressForm)
      const newAddress = response.data.data || response.data
      
      setAddresses(prev => [...prev, newAddress])
      setSelectedAddressId(newAddress.id)
      setShowAddressModal(false)
      resetAddressForm()
      showToast(isArabic ? 'تم إضافة العنوان بنجاح' : 'Address added successfully', 'success')
    } catch (error) {
      console.error('Error adding address:', error)
      showToast(error.response?.data?.message || (isArabic ? 'خطأ في إضافة العنوان' : 'Error adding address'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = async () => {
    try {
      setLoading(true)
      const response = await updateUserAddress(editingAddress.id, addressForm)
      const updatedAddress = response.data.data || response.data
      
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? updatedAddress : addr
      ))
      setShowAddressModal(false)
      setEditingAddress(null)
      resetAddressForm()
      showToast(isArabic ? 'تم تحديث العنوان بنجاح' : 'Address updated successfully', 'success')
    } catch (error) {
      console.error('Error updating address:', error)
      showToast(error.response?.data?.message || (isArabic ? 'خطأ في تحديث العنوان' : 'Error updating address'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا العنوان؟' : 'Are you sure you want to delete this address?')) {
      return
    }

    try {
      setLoading(true)
      await deleteUserAddress(addressId)
      
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
      if (selectedAddressId === addressId) {
        const remainingAddresses = addresses.filter(addr => addr.id !== addressId)
        setSelectedAddressId(remainingAddresses.length > 0 ? remainingAddresses[0].id : null)
      }
      showToast(isArabic ? 'تم حذف العنوان بنجاح' : 'Address deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting address:', error)
      showToast(error.response?.data?.message || (isArabic ? 'خطأ في حذف العنوان' : 'Error deleting address'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      title: '',
      address: '',
      building_number: '',
      apartment_number: '',
      floor: '',
      additional_notes: '',
      delivery_location_id: '',
      is_default: false
    })
  }

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address)
      setAddressForm({
        title: address.title || '',
        address: address.address || '',
        building_number: address.building_number || '',
        apartment_number: address.apartment_number || '',
        floor: address.floor || '',
        additional_notes: address.additional_notes || '',
        delivery_location_id: address.delivery_location_id || '',
        is_default: address.is_default || false
      })
    } else {
      setEditingAddress(null)
      resetAddressForm()
    }
    setShowAddressModal(true)
  }

  const handleValidatePromoCode = async () => {
    if (!promoCode.trim()) return

    setValidatingPromo(true)
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      // Hardcoded promo codes for immediate testing
      const hardcodedPromoCodes = {
        'WELCOME10': {
          type: 'percentage',
          value: 10,
          minimum_order: 25,
          message: isArabic ? 'تم تطبيق خصم 10%!' : '10% discount applied!'
        },
        'SAVE20': {
          type: 'fixed',
          value: 20,
          minimum_order: 50,
          message: isArabic ? 'تم خصم 20 جنيه!' : '20 EGP discount applied!'
        },
        'FIRST15': {
          type: 'percentage',
          value: 15,
          minimum_order: 30,
          message: isArabic ? 'خصم 15% للعملاء الجدد!' : '15% first customer discount!'
        }
      }

      const promoCodeUpper = promoCode.toUpperCase()
      const hardcodedPromo = hardcodedPromoCodes[promoCodeUpper]

      if (hardcodedPromo) {
        // Check minimum order amount
        if (subtotal < hardcodedPromo.minimum_order) {
          const minOrderMessage = isArabic 
            ? `الحد الأدنى للطلب ${hardcodedPromo.minimum_order} ريال`
            : `Minimum order ${hardcodedPromo.minimum_order} EGP required`
          setPromoDiscount(0)
          setPromoMessage(minOrderMessage)
          showToast(minOrderMessage, 'error')
          setValidatingPromo(false)
          return
        }

        // Calculate discount
        let discount = 0
        if (hardcodedPromo.type === 'percentage') {
          discount = subtotal * (hardcodedPromo.value / 100)
        } else if (hardcodedPromo.type === 'fixed') {
          discount = hardcodedPromo.value
        }

        // Apply discount
        setPromoDiscount(discount)
        setPromoMessage(hardcodedPromo.message)
        showToast(hardcodedPromo.message, 'success')
        setValidatingPromo(false)
        return
      }

      // If not a hardcoded promo, try API validation
      try {
        const response = await validatePromoCode(promoCode, subtotal)
        
        const promoData = response.data.data || response.data
        if (promoData.valid || response.data.success) {
          const discount = promoData.discount_amount || promoData.value || 0
          setPromoDiscount(discount)
          setPromoMessage(promoData.message || (isArabic ? 'تم تطبيق الكود بنجاح!' : 'Promo code applied successfully!'))
          showToast(isArabic ? 'تم تطبيق الكود بنجاح!' : 'Promo code applied!', 'success')
        } else {
          setPromoDiscount(0)
          setPromoMessage(promoData.message || (isArabic ? 'كود غير صالح' : 'Invalid promo code'))
          showToast(promoData.message || (isArabic ? 'كود غير صالح' : 'Invalid promo code'), 'error')
        }
      } catch {
        // API failed, show invalid code message
        setPromoDiscount(0)
        setPromoMessage(isArabic ? 'كود غير صالح' : 'Invalid promo code')
        showToast(isArabic ? 'كود غير صالح' : 'Invalid promo code', 'error')
      }
    } catch (error) {
      console.error('Error validating promo code:', error)
      setPromoDiscount(0)
      setPromoMessage(isArabic ? 'خطأ في التحقق من الكود' : 'Error validating promo code')
      showToast(isArabic ? 'خطأ في التحقق من الكود' : 'Error validating promo code', 'error')
    } finally {
      setValidatingPromo(false)
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
            backgroundImage="/images/bg13.jpeg"
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
          {/* Steps Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Main Form Section */}
            <div className="xl:col-span-2">
              {step === 1 && (
                <div className="backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-primary px-4 md:px-8 py-4 md:py-6">
                    <h3 className="text-white text-xl md:text-2xl font-bold arabic-heading-font">
                      {content.steps.address}
                    </h3>
                  </div>

                  <div className="bg-black/40 p-4 md:p-8 lg:p-10 space-y-6">
                    {/* Order Type Selection */}
                    <div>
                      <label className="block text-white font-semibold mb-3 arabic-body text-lg">
                        {content.orderType.title}
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            orderType === 'delivery'
                              ? 'border-primary bg-primary/20 text-white'
                              : 'border-gray-400 text-gray-300 hover:border-primary'
                          }`}
                        >
                          <FaMapMarkerAlt className="w-6 h-6 mx-auto mb-2" />
                          <span className="arabic-body font-medium">{content.orderType.delivery}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('takeaway')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            orderType === 'takeaway'
                              ? 'border-primary bg-primary/20 text-white'
                              : 'border-gray-400 text-gray-300 hover:border-primary'
                          }`}
                        >
                          <FaShoppingBag className="w-6 h-6 mx-auto mb-2" />
                          <span className="arabic-body font-medium">{content.orderType.takeaway}</span>
                        </button>
                      </div>
                    </div>

                    {/* Address Selection (only for delivery) */}
                    {orderType === 'delivery' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-white font-semibold arabic-body text-lg">
                            {content.address.title}
                          </label>
                          <button
                            type="button"
                            onClick={() => openAddressModal()}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                          >
                            <FaPlus className="w-4 h-4" />
                            <span className="arabic-body">{content.address.add}</span>
                          </button>
                        </div>

                        {addresses.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed border-gray-500 rounded-xl">
                            <FaMapMarkerAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 arabic-body">
                              {isArabic ? 'لا توجد عناوين محفوظة' : 'No saved addresses'}
                            </p>
                            <button
                              type="button"
                              onClick={() => openAddressModal()}
                              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              {content.address.add}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {addresses.map((address) => (
                              <div
                                key={address.id}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  selectedAddressId === address.id
                                    ? 'border-primary bg-primary/20'
                                    : 'border-gray-500 hover:border-primary/50'
                                }`}
                                onClick={() => setSelectedAddressId(address.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="text-white font-semibold arabic-body mb-1">
                                      {address.title}
                                    </h4>
                                    <p className="text-gray-300 arabic-body text-sm">
                                      {address.address}
                                      {address.building_number && `, ${isArabic ? 'مبنى' : 'Building'} ${address.building_number}`}
                                      {address.apartment_number && `, ${isArabic ? 'شقة' : 'Apt'} ${address.apartment_number}`}
                                    </p>
                                    {address.additional_notes && (
                                      <p className="text-gray-400 arabic-body text-xs mt-1">
                                        {address.additional_notes}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openAddressModal(address)
                                      }}
                                      className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                      <FaEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteAddress(address.id)
                                      }}
                                      className="text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                      <FaTrash className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Customer Notes */}
                    <div>
                      <label className="block text-white font-semibold mb-3 arabic-body text-lg">
                        {isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}
                      </label>
                      <textarea
                        value={formData.customer_notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer_notes: e.target.value }))}
                        placeholder={isArabic ? 'أي ملاحظات خاصة للطلب...' : 'Any special notes for your order...'}
                        className="w-full bg-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setStep(2)}
                        disabled={orderType === 'delivery' && !selectedAddressId}
                        className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <span className="arabic-body font-semibold">{content.buttons.next}</span>
                        {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                      </button>
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
                      {content.paymentInfo.method}
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
                            value="cash_on_delivery"
                            checked={formData.paymentMethod === 'cash_on_delivery'}
                            onChange={handleInputChange}
                            className="mr-3 ml-3"
                          />
                        <FaMoneyBill className="w-5 h-5 text-white mr-3 ml-3" />
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
                      <FaCheckCircle className="w-5 h-5 text-green-400" />
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
                        {content.buttons.next}
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
            <div className="backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-primary px-4 md:px-8 py-4 md:py-6">
                <h3 className="text-white text-xl md:text-2xl font-bold arabic-heading-font">
                  {content.orderSummary.title}
                </h3>
              </div>
              
              <div className="bg-black/40 p-4 md:p-8 lg:p-10">
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-600">
                      <div className="flex-1">
                        <span className="text-white font-medium arabic-body text-sm sm:text-base">{item.name}</span>
                        <span className="text-gray-400 arabic-body text-xs sm:text-sm block">
                          {item.quantity} x {item.price} EGP
                        </span>
                      </div>
                      <span className="text-white font-bold text-sm sm:text-base">
                        {(item.price * item.quantity).toFixed(2)} EGP
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Section */}
                <div className="border-t border-gray-600 pt-6 mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={content.promo.placeholder}
                      className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    />
                    <button
                      type="button"
                      onClick={handleValidatePromoCode}
                      disabled={!promoCode.trim() || validatingPromo}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validatingPromo ? content.promo.validating : content.promo.apply}
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`mt-2 text-sm ${promoDiscount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>
                
                {/* Order Totals */}
                <div className="space-y-3 border-t border-gray-600 pt-6">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="arabic-body text-sm sm:text-base">{content.orderSummary.subtotal}</span>
                    <span className="text-sm sm:text-base">{subtotal.toFixed(2)} EGP</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="arabic-body text-sm sm:text-base">{content.orderSummary.tax}</span>
                    <span className="text-sm sm:text-base">{(subtotal * taxRate).toFixed(2)} EGP</span>
                  </div>
                  
                  {orderType === 'delivery' && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="arabic-body text-sm sm:text-base">
                        {content.orderSummary.delivery}
                        {calculatingDeliveryFee && (
                          <span className="text-xs ml-2">(جاري الحساب...)</span>
                        )}
                      </span>
                                             <span className="text-sm sm:text-base">{(Number(deliveryFee) || 0).toFixed(2)} EGP</span>
                    </div>
                  )}
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="arabic-body text-sm sm:text-base">{content.orderSummary.discount}</span>
                      <span className="text-green-400 text-sm sm:text-base">-{promoDiscount.toFixed(2)} EGP</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-white font-bold text-lg border-t border-gray-600 pt-3">
                    <span className="arabic-body">{content.orderSummary.total}</span>
                    <span>{total.toFixed(2)} EGP</span>
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
                    {total.toFixed(2)} EGP
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

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAddress ? content.address.edit : content.address.add}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  editingAddress ? handleEditAddress() : handleAddAddress()
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.address.form.title}
                  </label>
                  <input
                    type="text"
                    value={addressForm.title}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    placeholder={isArabic ? 'مثل: المنزل، العمل' : 'e.g., Home, Work'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.address.form.address}
                  </label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    placeholder={isArabic ? 'العنوان الكامل' : 'Full address'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.address.form.building}
                    </label>
                    <input
                      type="text"
                      value={addressForm.building_number}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, building_number: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.address.form.apartment}
                    </label>
                    <input
                      type="text"
                      value={addressForm.apartment_number}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, apartment_number: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.address.form.floor}
                  </label>
                  <input
                    type="text"
                    value={addressForm.floor}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, floor: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={isArabic ? 'الطابق الأول' : 'Ground floor'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.address.form.location}
                  </label>
                  <select
                    value={addressForm.delivery_location_id}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, delivery_location_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">
                      {isArabic ? 'اختر المنطقة' : 'Select location'}
                    </option>
                    {deliveryLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.delivery_fee} EGP)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.address.form.notes}
                  </label>
                  <textarea
                    value={addressForm.additional_notes}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, additional_notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={isArabic ? 'ملاحظات إضافية للتوصيل' : 'Additional delivery notes'}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defaultAddress"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, is_default: e.target.checked }))}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-700">
                    {content.address.form.default}
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {content.buttons.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? '...' : content.buttons.save}
                  </button>
                </div>
              </form>
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
                  <FaCheckCircle className="w-10 h-10 text-green-600" />
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