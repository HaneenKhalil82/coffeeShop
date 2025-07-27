import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMapMarkerAlt, FaPlus, FaCreditCard, FaShoppingCart, FaCheck, FaTimes, FaSpinner, FaGift, FaTruck, FaStore } from 'react-icons/fa'
import { useCart, useRTL } from '../App'
import { useAuth } from '../contexts/AuthContext'
import { addressService, orderService, completeOrderFlow } from '../services/userServices'
import { getBranches } from '../services/api'
import HeroSection from '../components/HeroSection'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { isArabic } = useRTL()
  const { isAuthenticated, user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  // State management
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [deliveryLocations, setDeliveryLocations] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [orderType, setOrderType] = useState('delivery') // 'delivery' or 'takeaway'
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoValidating, setPromoValidating] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)
  const [customerNotes, setCustomerNotes] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [showAddAddressModal, setShowAddAddressModal] = useState(false)
  const [newAddress, setNewAddress] = useState({
    title: '',
    address: '',
    building_number: '',
    apartment_number: '',
    floor: '',
    additional_notes: '',
    delivery_location_id: '',
    is_default: false
  })

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }
  }, [isAuthenticated, cartItems, navigate])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)

        // Fetch addresses, delivery locations, and branches in parallel
        const [addressResult, deliveryResult, branchesResponse] = await Promise.all([
          addressService.getUserAddresses(),
          orderService.getDeliveryLocations(),
          getBranches()
        ])

        if (addressResult.success) {
          setAddresses(addressResult.data?.data || addressResult.data || [])
          // Set default address if available
          const defaultAddr = (addressResult.data?.data || addressResult.data || []).find(addr => addr.is_default)
          if (defaultAddr) {
            setSelectedAddress(defaultAddr)
          }
        }

        if (deliveryResult.success) {
          setDeliveryLocations(deliveryResult.data?.data || deliveryResult.data || [])
        }

        if (branchesResponse.data) {
          const branchesData = branchesResponse.data?.data || branchesResponse.data || []
          setBranches(branchesData)
          // Set first branch as default
          if (branchesData.length > 0) {
            setSelectedBranch(branchesData[0])
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
        toast.error(isArabic ? 'خطأ في تحميل البيانات' : 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [isArabic])

  // Calculate delivery fee when address changes
  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (orderType === 'delivery' && selectedAddress?.id) {
        try {
          const result = await orderService.getDeliveryFee(selectedAddress.id)
          if (result.success) {
            setDeliveryFee(result.data?.delivery_fee || 0)
          }
        } catch (error) {
          console.error('Error calculating delivery fee:', error)
          setDeliveryFee(10) // Fallback fee
        }
      } else {
        setDeliveryFee(0)
      }
    }

    calculateDeliveryFee()
  }, [orderType, selectedAddress])

  const content = isArabic ? {
    title: 'إتمام الطلب',
    orderType: {
      title: 'نوع الطلب',
      delivery: 'توصيل',
      takeaway: 'استلام من الفرع'
    },
    address: {
      title: 'عنوان التوصيل',
      select: 'اختر العنوان',
      add: 'إضافة عنوان جديد',
      required: 'يرجى اختيار عنوان للتوصيل'
    },
    branch: {
      title: 'اختر الفرع',
      select: 'اختر الفرع للاستلام'
    },
    payment: {
      title: 'طريقة الدفع',
      cash: 'الدفع عند الاستلام',
      card: 'بطاقة ائتمان'
    },
    promo: {
      title: 'كود الخصم',
      placeholder: 'أدخل كود الخصم',
      apply: 'تطبيق',
      applied: 'تم التطبيق',
      invalid: 'كود خصم غير صالح'
    },
    summary: {
      title: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      delivery: 'رسوم التوصيل',
      discount: 'الخصم',
      total: 'المجموع الكلي'
    },
    notes: {
      customer: 'ملاحظات إضافية',
      delivery: 'ملاحظات التوصيل',
      customerPlaceholder: 'أي ملاحظات خاصة بالطلب...',
      deliveryPlaceholder: 'تعليمات للسائق...'
    },
    schedule: {
      title: 'وقت التوصيل المفضل',
      placeholder: 'اختياري - حدد الوقت المفضل'
    },
    buttons: {
      placeOrder: 'تأكيد الطلب',
      cancel: 'إلغاء',
      save: 'حفظ'
    },
    messages: {
      orderPlaced: 'تم تأكيد طلبك بنجاح!',
      orderError: 'حدث خطأ في تأكيد الطلب',
      addressAdded: 'تم إضافة العنوان بنجاح'
    },
    addAddress: {
      title: 'إضافة عنوان جديد',
      titleField: 'اسم العنوان',
      address: 'العنوان',
      building: 'رقم المبنى',
      apartment: 'رقم الشقة',
      floor: 'الطابق',
      notes: 'ملاحظات إضافية',
      location: 'منطقة التوصيل',
      default: 'جعل هذا العنوان الافتراضي'
    }
  } : {
    title: 'Checkout',
    orderType: {
      title: 'Order Type',
      delivery: 'Delivery',
      takeaway: 'Takeaway'
    },
    address: {
      title: 'Delivery Address',
      select: 'Select Address',
      add: 'Add New Address',
      required: 'Please select a delivery address'
    },
    branch: {
      title: 'Select Branch',
      select: 'Choose branch for pickup'
    },
    payment: {
      title: 'Payment Method',
      cash: 'Cash on Delivery',
      card: 'Credit Card'
    },
    promo: {
      title: 'Promo Code',
      placeholder: 'Enter promo code',
      apply: 'Apply',
      applied: 'Applied',
      invalid: 'Invalid promo code'
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      delivery: 'Delivery Fee',
      discount: 'Discount',
      total: 'Total'
    },
    notes: {
      customer: 'Additional Notes',
      delivery: 'Delivery Notes',
      customerPlaceholder: 'Any special notes for your order...',
      deliveryPlaceholder: 'Instructions for delivery driver...'
    },
    schedule: {
      title: 'Preferred Delivery Time',
      placeholder: 'Optional - specify preferred time'
    },
    buttons: {
      placeOrder: 'Place Order',
      cancel: 'Cancel',
      save: 'Save'
    },
    messages: {
      orderPlaced: 'Your order has been placed successfully!',
      orderError: 'Error placing order',
      addressAdded: 'Address added successfully'
    },
    addAddress: {
      title: 'Add New Address',
      titleField: 'Address Title',
      address: 'Address',
      building: 'Building Number',
      apartment: 'Apartment Number',
      floor: 'Floor',
      notes: 'Additional Notes',
      location: 'Delivery Location',
      default: 'Make this my default address'
    }
  }

  const handlePromoCodeValidation = async () => {
    if (!promoCode.trim()) return

    if (cartTotal <= 0) {
      toast.error(isArabic ? 'السلة فارغة' : 'Cart is empty')
      return
    }
    setPromoValidating(true)
    try {
      console.log('🎫 Validating promo with cart total:', cartTotal);
      const result = await orderService.validatePromoCode(promoCode, cartTotal)
      if (result.success) {
        setPromoDiscount(result.data?.discount_amount || 0)
        setPromoApplied(true)
        toast.success(isArabic ? 'تم تطبيق كود الخصم' : 'Promo code applied')
      } else {
        setPromoDiscount(0)
        setPromoApplied(false)
        toast.error(result.error || content.promo.invalid)
      }
    } catch (error) {
      console.error('❌ Promo validation error:', error);
      setPromoDiscount(0)
      setPromoApplied(false)
      toast.error(content.promo.invalid)
    } finally {
      setPromoValidating(false)
    }
  }

  const handleAddAddress = async () => {
    try {
      const result = await addressService.addAddress(newAddress)
      if (result.success) {
        const addedAddress = result.data?.data || result.data
        setAddresses(prev => [...prev, addedAddress])
        setSelectedAddress(addedAddress)
        setShowAddAddressModal(false)
        setNewAddress({
          title: '',
          address: '',
          building_number: '',
          apartment_number: '',
          floor: '',
          additional_notes: '',
          delivery_location_id: '',
          is_default: false
        })
        toast.success(content.messages.addressAdded)
      } else {
        toast.error(result.error || 'Error adding address')
      }
    } catch (error) {
      toast.error('Error adding address')
    }
  }

  const handlePlaceOrder = async () => {
    // Validation
    if (orderType === 'delivery' && !selectedAddress) {
      toast.error(content.address.required)
      return
    }

    if (!selectedBranch) {
      toast.error(isArabic ? 'يرجى اختيار الفرع' : 'Please select a branch')
      return
    }

    // Validate cart has items
    if (!cartItems || cartItems.length === 0) {
      toast.error(isArabic ? 'السلة فارغة' : 'Cart is empty')
      return
    }

    setLoading(true)
    try {
      // Prepare order data
      const orderData = {
        branch_id: selectedBranch.id,
        order_type: orderType,
        payment_method: paymentMethod,
        customer_notes: customerNotes || '',
        loyalty_points_used: 0,
        order_amount: cartTotal // Add cart total for promo validation
      }

      // Add delivery-specific fields
      if (orderType === 'delivery') {
        orderData.user_address_id = selectedAddress.id
        orderData.delivery_notes = deliveryNotes || ''
        if (scheduledTime) {
          orderData.scheduled_delivery_time = scheduledTime
        }
      }

      // Add promo code if applied
      if (promoApplied && promoCode) {
        orderData.promo_code = promoCode;
      }

      console.log('🚀 Placing order with data:', orderData)

      // Pass user ID for cart operations
      const result = await completeOrderFlow(orderData, user?.id)

      if (result.success) {
        toast.success(content.messages.orderPlaced)
        clearCart()
        navigate('/profile', {
          state: {
            orderSuccess: true,
            orderData: result.data
          }
        })
      } else {
        console.error('❌ Order failed:', result.error)
        toast.error(result.error || content.messages.orderError)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.message || content.messages.orderError)
    } finally {
      setLoading(false)
    }
  }

  const finalTotal = cartTotal + deliveryFee - promoDiscount

  if (loading && addresses.length === 0) {
    return (
      <div className="pt-20 md:pt-24">
        <HeroSection
          backgroundImage="/images/bg13.jpeg"
          title={content.title}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mb-4 mx-auto" />
            <p className="text-gray-600">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 md:pt-24">
      <HeroSection
        backgroundImage="/images/bg13.jpeg"
        title={content.title}
      />

      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
        <div className="absolute inset-0"></div>

        <section className="section-padding relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main Checkout Form */}
              <div className="lg:col-span-2 space-y-8">

                {/* Order Type Selection */}
                <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                  <h3 className="text-xl font-bold text-white mb-4 arabic-heading-font">
                    {content.orderType.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setOrderType('delivery')}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${orderType === 'delivery'
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-gray-300 text-gray-300 hover:border-primary'
                        }`}
                    >
                      <FaTruck className="mr-2" />
                      {content.orderType.delivery}
                    </button>
                    <button
                      onClick={() => setOrderType('takeaway')}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${orderType === 'takeaway'
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-gray-300 text-gray-300 hover:border-primary'
                        }`}
                    >
                      <FaStore className="mr-2" />
                      {content.orderType.takeaway}
                    </button>
                  </div>
                </div>

                {/* Branch Selection */}
                <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                  <h3 className="text-xl font-bold text-white mb-4 arabic-heading-font">
                    {content.branch.title}
                  </h3>
                  <div className="space-y-3">
                    {branches.map((branch) => (
                      <div
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${selectedBranch?.id === branch.id
                          ? 'border-primary bg-primary/20'
                          : 'border-gray-300 hover:border-primary'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">{branch.name}</h4>
                            <p className="text-gray-300 text-sm">{branch.address}</p>
                            {branch.phone && (
                              <p className="text-gray-400 text-sm">{branch.phone}</p>
                            )}
                          </div>
                          {selectedBranch?.id === branch.id && (
                            <FaCheck className="text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Selection (for delivery) */}
                {orderType === 'delivery' && (
                  <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white arabic-heading-font">
                        {content.address.title}
                      </h3>
                      <button
                        onClick={() => setShowAddAddressModal(true)}
                        className="flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <FaPlus className="mr-2" />
                        {content.address.add}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${selectedAddress?.id === address.id
                            ? 'border-primary bg-primary/20'
                            : 'border-gray-300 hover:border-primary'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-white">{address.title}</h4>
                              <p className="text-gray-300 text-sm">{address.address}</p>
                              {address.building_number && (
                                <p className="text-gray-400 text-sm">
                                  {isArabic ? 'مبنى' : 'Building'} {address.building_number}
                                  {address.apartment_number && `, ${isArabic ? 'شقة' : 'Apt'} ${address.apartment_number}`}
                                </p>
                              )}
                            </div>
                            {selectedAddress?.id === address.id && (
                              <FaCheck className="text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                  <h3 className="text-xl font-bold text-white mb-4 arabic-heading-font">
                    {content.payment.title}
                  </h3>
                  <div className="space-y-3">
                    <div
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center ${paymentMethod === 'cash_on_delivery'
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-300 hover:border-primary'
                        }`}
                    >
                      <FaShoppingCart className="mr-3 text-primary" />
                      <span className="text-white">{content.payment.cash}</span>
                      {paymentMethod === 'cash_on_delivery' && (
                        <FaCheck className="ml-auto text-primary" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                  <h3 className="text-xl font-bold text-white mb-4 arabic-heading-font">
                    {content.promo.title}
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={content.promo.placeholder}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={promoApplied}
                    />
                    <button
                      onClick={handlePromoCodeValidation}
                      disabled={promoValidating || promoApplied || !promoCode.trim()}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {promoValidating ? (
                        <FaSpinner className="animate-spin" />
                      ) : promoApplied ? (
                        <>
                          <FaCheck className="mr-2" />
                          {content.promo.applied}
                        </>
                      ) : (
                        content.promo.apply
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2 arabic-body">
                        {content.notes.customer}
                      </label>
                      <textarea
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder={content.notes.customerPlaceholder}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    {orderType === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-white font-semibold mb-2 arabic-body">
                            {content.notes.delivery}
                          </label>
                          <textarea
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            placeholder={content.notes.deliveryPlaceholder}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-semibold mb-2 arabic-body">
                            {content.schedule.title}
                          </label>
                          <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-6 arabic-heading-font">
                    {content.summary.title}
                  </h3>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/images/menu1.jpg'
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-300 text-xs">
                            {item.quantity} × EGP {item.price}
                          </p>
                        </div>
                        <span className="text-white font-bold">
                          EGP {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Calculations */}
                  <div className="space-y-3 border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-gray-300">
                      <span>{content.summary.subtotal}</span>
                      <span>EGP {cartTotal.toFixed(2)}</span>
                    </div>

                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-gray-300">
                        <span>{content.summary.delivery}</span>
                        <span>EGP {deliveryFee.toFixed(2)}</span>
                      </div>
                    )}

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>{content.summary.discount}</span>
                        <span>-EGP {promoDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-white font-bold text-lg border-t border-gray-600 pt-3">
                      <span>{content.summary.total}</span>
                      <span>EGP {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || (orderType === 'delivery' && !selectedAddress) || !selectedBranch}
                    className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaShoppingCart className="mr-2" />
                    )}
                    {loading ? (isArabic ? 'جاري التأكيد...' : 'Processing...') : content.buttons.placeOrder}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 arabic-heading-font">
                  {content.addAddress.title}
                </h3>
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.addAddress.titleField}
                  </label>
                  <input
                    type="text"
                    value={newAddress.title}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={isArabic ? 'مثل: المنزل، العمل' : 'e.g., Home, Work'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.addAddress.address}
                  </label>
                  <textarea
                    value={newAddress.address}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.addAddress.building}
                    </label>
                    <input
                      type="text"
                      value={newAddress.building_number}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, building_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.addAddress.apartment}
                    </label>
                    <input
                      type="text"
                      value={newAddress.apartment_number}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, apartment_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.addAddress.floor}
                  </label>
                  <input
                    type="text"
                    value={newAddress.floor}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, floor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.addAddress.location}
                  </label>
                  <select
                    value={newAddress.delivery_location_id}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, delivery_location_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">{isArabic ? 'اختر المنطقة' : 'Select Location'}</option>
                    {deliveryLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - EGP {location.delivery_fee}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, is_default: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{content.addAddress.default}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {content.buttons.cancel}
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={!newAddress.title || !newAddress.address || !newAddress.delivery_location_id}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {content.buttons.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
