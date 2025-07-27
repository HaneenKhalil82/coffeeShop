import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaEdit, FaPlus, FaTimes, FaCheck, FaSpinner, FaEye, FaClock, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useRTL } from '../App'
import { useAuth } from '../contexts/AuthContext'
import { addressService, orderService } from '../services/userServices'
import { updateUserProfile, changePassword } from '../services/api'
import HeroSection from '../components/HeroSection'
import { toast } from 'react-toastify'

const Profile = () => {
  const { isArabic } = useRTL()
  const { user, updateProfile } = useAuth()
  const location = useLocation()

  // State management
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    profile_image: user?.profile_image || ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  const content = isArabic ? {
    title: 'الملف الشخصي',
    tabs: {
      profile: 'المعلومات الشخصية',
      orders: 'طلباتي',
      addresses: 'عناويني'
    },
    profile: {
      edit: 'تعديل الملف الشخصي',
      changePassword: 'تغيير كلمة المرور',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      joinDate: 'تاريخ الانضمام'
    },
    orders: {
      title: 'طلباتي',
      empty: 'لا توجد طلبات',
      emptyMessage: 'لم تقم بأي طلبات بعد',
      orderNumber: 'رقم الطلب',
      date: 'التاريخ',
      total: 'المجموع',
      status: 'الحالة',
      viewDetails: 'عرض التفاصيل',
      items: 'العناصر',
      deliveryAddress: 'عنوان التوصيل',
      orderType: 'نوع الطلب',
      paymentMethod: 'طريقة الدفع'
    },
    addresses: {
      title: 'عناويني',
      add: 'إضافة عنوان جديد',
      edit: 'تعديل',
      delete: 'حذف',
      default: 'افتراضي',
      empty: 'لا توجد عناوين',
      emptyMessage: 'لم تضف أي عناوين بعد'
    },
    status: {
      pending_confirmation: 'في انتظار التأكيد',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      out_for_delivery: 'في الطريق',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    },
    orderTypes: {
      delivery: 'توصيل',
      takeaway: 'استلام'
    },
    paymentMethods: {
      cash_on_delivery: 'الدفع عند الاستلام',
      credit_card: 'بطاقة ائتمان'
    },
    buttons: {
      save: 'حفظ',
      cancel: 'إلغاء',
      close: 'إغلاق',
      update: 'تحديث'
    },
    messages: {
      profileUpdated: 'تم تحديث الملف الشخصي',
      passwordChanged: 'تم تغيير كلمة المرور',
      orderSuccess: 'تم تأكيد طلبك بنجاح!',
      error: 'حدث خطأ'
    },
    passwordForm: {
      current: 'كلمة المرور الحالية',
      new: 'كلمة المرور الجديدة',
      confirm: 'تأكيد كلمة المرور الجديدة'
    }
  } : {
    title: 'Profile',
    tabs: {
      profile: 'Profile Info',
      orders: 'My Orders',
      addresses: 'My Addresses'
    },
    profile: {
      edit: 'Edit Profile',
      changePassword: 'Change Password',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      joinDate: 'Member Since'
    },
    orders: {
      title: 'My Orders',
      empty: 'No Orders',
      emptyMessage: 'You haven\'t placed any orders yet',
      orderNumber: 'Order #',
      date: 'Date',
      total: 'Total',
      status: 'Status',
      viewDetails: 'View Details',
      items: 'Items',
      deliveryAddress: 'Delivery Address',
      orderType: 'Order Type',
      paymentMethod: 'Payment Method'
    },
    addresses: {
      title: 'My Addresses',
      add: 'Add New Address',
      edit: 'Edit',
      delete: 'Delete',
      default: 'Default',
      empty: 'No Addresses',
      emptyMessage: 'You haven\'t added any addresses yet'
    },
    status: {
      pending_confirmation: 'Pending Confirmation',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for Delivery',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    orderTypes: {
      delivery: 'Delivery',
      takeaway: 'Takeaway'
    },
    paymentMethods: {
      cash_on_delivery: 'Cash on Delivery',
      credit_card: 'Credit Card'
    },
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      update: 'Update'
    },
    messages: {
      profileUpdated: 'Profile updated successfully',
      passwordChanged: 'Password changed successfully',
      orderSuccess: 'Your order has been placed successfully!',
      error: 'An error occurred'
    },
    passwordForm: {
      current: 'Current Password',
      new: 'New Password',
      confirm: 'Confirm New Password'
    }
  }

  // Show order success message if redirected from checkout
  useEffect(() => {
    if (location.state?.orderSuccess) {
      toast.success(content.messages.orderSuccess, {
        position: "top-right",
        autoClose: 5000,
      })
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title)
    }
  }, [location.state, content.messages.orderSuccess])

  // Fetch user data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (activeTab === 'orders') {
          const result = await orderService.getUserOrders()
          if (result.success) {
            setOrders(result.data?.data || result.data || [])
          }
        } else if (activeTab === 'addresses') {
          const result = await addressService.getUserAddresses()
          if (result.success) {
            setAddresses(result.data?.data || result.data || [])
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(content.messages.error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab, content.messages.error])

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      const response = await updateUserProfile(profileData)
      if (response.data) {
        await updateProfile()
        setShowEditProfile(false)
        toast.success(content.messages.profileUpdated)
      }
    } catch (error) {
      toast.error(content.messages.error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await changePassword(passwordData)
      setShowChangePassword(false)
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      })
      toast.success(content.messages.passwordChanged)
    } catch (error) {
      toast.error(content.messages.error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrderDetails = async (orderId) => {
    try {
      const result = await orderService.getOrderDetails(orderId)
      if (result.success) {
        setSelectedOrder(result.data?.data || result.data)
        setShowOrderModal(true)
      }
    } catch (error) {
      toast.error(content.messages.error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending_confirmation: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

            {/* Profile Header */}
            <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center">
                      <FaUser className="text-white text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white arabic-heading-font">
                    {user?.name || 'User'}
                  </h1>
                  <p className="text-gray-300 arabic-body">{user?.email}</p>
                  {user?.mobile && (
                    <p className="text-gray-400 arabic-body">{user.mobile}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FaEdit />
                  {content.profile.edit}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              {Object.entries(content.tabs).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === key
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white arabic-heading-font">
                    {content.tabs.profile}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          {content.profile.name}
                        </label>
                        <div className="p-3 bg-white/10 rounded-lg text-white">
                          {user?.name || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          {content.profile.email}
                        </label>
                        <div className="p-3 bg-white/10 rounded-lg text-white">
                          {user?.email || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          {content.profile.phone}
                        </label>
                        <div className="p-3 bg-white/10 rounded-lg text-white">
                          {user?.mobile || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          {content.profile.joinDate}
                        </label>
                        <div className="p-3 bg-white/10 rounded-lg text-white">
                          {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaEdit />
                    {content.profile.changePassword}
                  </button>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white arabic-heading-font">
                      {content.orders.title}
                    </h2>
                    <Link
                      to="/menu"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <FaPlus />
                      {isArabic ? 'طلب جديد' : 'New Order'}
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-primary mb-4 mx-auto" />
                      <p className="text-gray-300">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaShoppingBag className="text-4xl text-gray-400 mb-4 mx-auto" />
                      <h3 className="text-xl font-semibold text-white mb-2">{content.orders.empty}</h3>
                      <p className="text-gray-300 mb-6">{content.orders.emptyMessage}</p>
                      <Link
                        to="/menu"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <FaShoppingBag />
                        {isArabic ? 'تصفح المنتجات' : 'Browse Products'}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-white">
                                {content.orders.orderNumber}{order.id}
                              </h3>
                              <p className="text-gray-300 text-sm">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {content.status[order.status] || order.status}
                              </span>
                              <p className="text-white font-bold mt-1">
                                EGP {parseFloat(order.total || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-300">
                              <span className="mr-4">
                                {content.orders.items}: {order.items?.length || 0}
                              </span>
                              <span>
                                {content.orderTypes[order.order_type] || order.order_type}
                              </span>
                            </div>
                            <button
                              onClick={() => handleViewOrderDetails(order.id)}
                              className="flex items-center gap-2 px-3 py-1 text-primary hover:text-primary/80 transition-colors"
                            >
                              <FaEye />
                              {content.orders.viewDetails}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white arabic-heading-font">
                      {content.addresses.title}
                    </h2>
                    <Link
                      to="/checkout"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <FaPlus />
                      {content.addresses.add}
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-primary mb-4 mx-auto" />
                      <p className="text-gray-300">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <FaMapMarkerAlt className="text-4xl text-gray-400 mb-4 mx-auto" />
                      <h3 className="text-xl font-semibold text-white mb-2">{content.addresses.empty}</h3>
                      <p className="text-gray-300 mb-6">{content.addresses.emptyMessage}</p>
                      <Link
                        to="/checkout"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <FaPlus />
                        {content.addresses.add}
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-white flex items-center gap-2">
                                {address.title}
                                {address.is_default && (
                                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                                    {content.addresses.default}
                                  </span>
                                )}
                              </h3>
                              <p className="text-gray-300 text-sm mt-1">
                                {address.address}
                              </p>
                              {address.building_number && (
                                <p className="text-gray-400 text-sm">
                                  {isArabic ? 'مبنى' : 'Building'} {address.building_number}
                                  {address.apartment_number && `, ${isArabic ? 'شقة' : 'Apt'} ${address.apartment_number}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 arabic-heading-font">
                  {content.profile.edit}
                </h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.profile.name}
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.profile.phone}
                  </label>
                  <input
                    type="text"
                    value={profileData.mobile}
                    onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {content.buttons.cancel}
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : content.buttons.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 arabic-heading-font">
                  {content.profile.changePassword}
                </h3>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.passwordForm.current}
                  </label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.passwordForm.new}
                  </label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {content.passwordForm.confirm}
                  </label>
                  <input
                    type="password"
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {content.buttons.cancel}
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.current_password || !passwordData.password || passwordData.password !== passwordData.password_confirmation}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : content.buttons.update}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 pt-[140px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 arabic-heading-font">
                  {content.orders.orderNumber}{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.orders.status}
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {content.status[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.orders.date}
                    </label>
                    <p className="text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.orders.orderType}
                    </label>
                    <p className="text-gray-900">{content.orderTypes[selectedOrder.order_type] || selectedOrder.order_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.orders.paymentMethod}
                    </label>
                    <p className="text-gray-900">{content.paymentMethods[selectedOrder.payment_method] || selectedOrder.payment_method}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{content.orders.items}</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium">{item.product?.name || `Product ${item.product_id}`}</h5>
                          <p className="text-sm text-gray-600">
                            {isArabic ? 'الكمية' : 'Quantity'}: {item.quantity}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-gray-500">{item.notes}</p>
                          )}
                        </div>
                        <span className="font-bold">
                          EGP {(parseFloat(item.unit_price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{content.orders.total}</span>
                    <span>EGP {parseFloat(selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {content.buttons.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
