import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Camera, Edit, Save, X, Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateUserProfile, changePassword, getUserOrders, getOrderDetails, getLocalOrders, getLocalOrderById, cancelOrder, saveOrderLocally } from '../services/api';
import { useRTL } from '../App';

const createProfileSchema = (isArabic) => z.object({
  name: z.string().min(2, isArabic ? 'الاسم يجب أن يكون على الأقل حرفين' : 'Name must be at least 2 characters'),
  email: z.string().email(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email'),
  mobile: z.string().optional(),
  profile_image: z.string().optional(),
});

const createPasswordSchema = (isArabic) => z.object({
  current_password: z.string().min(6, isArabic ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required'),
  password: z.string().min(6, isArabic ? 'كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف' : 'New password must be at least 6 characters'),
  password_confirmation: z.string().min(6, isArabic ? 'تأكيد كلمة المرور مطلوب' : 'Password confirmation is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: isArabic ? "كلمات المرور غير متطابقة" : "Passwords don't match",
  path: ["password_confirmation"],
});



const Profile = () => {
  const { user, logout, refreshUserData } = useAuth();
  const { isArabic } = useRTL();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({
    resolver: zodResolver(createProfileSchema(isArabic)),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      profile_image: user?.profile_image || '',
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(createPasswordSchema(isArabic)),
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        profile_image: user.profile_image || '',
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    setLoading(true);
    console.log('🚀 Profile Update Started');
    console.log('📝 Form Data:', data);
    console.log('👤 Current User:', user);
    console.log('🔑 Auth Token Present:', !!localStorage.getItem('auth_token'));
    
    try {
      const response = await updateUserProfile(data);
      console.log('✅ Profile Update Response:', response);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(isArabic ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!');
        console.log('🔄 Refreshing user data...');
        await refreshUserData();
        setIsEditing(false);
        console.log('✨ Profile update completed successfully');
      } else {
        console.warn('⚠️ Unexpected response status:', response.status);
        toast.warning(isArabic ? 'استجابة غير متوقعة من الخادم' : 'Unexpected server response');
      }
    } catch (error) {
      console.error('❌ Profile Update Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        statusText: error.response?.statusText
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          (isArabic ? 'فشل في تحديث الملف الشخصي' : 'Failed to update profile');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 Profile update process finished');
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await changePassword(data);
      
      if (response.status === 200) {
        toast.success(isArabic ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
        resetPassword();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (isArabic ? 'فشل في تغيير كلمة المرور' : 'Failed to change password'));
    } finally {
      setLoading(false);
    }
  };

  // =================== 🛒 ORDERS FUNCTIONALITY ===================
  
  const fetchUserOrders = async () => {
    setOrdersLoading(true);
    try {
      console.log('🛒 Fetching user orders...');
      console.log('🔑 Auth token available:', !!localStorage.getItem('auth_token'));
      console.log('👤 User authenticated:', !!user);
      
      // Try to get orders from API first
      let ordersData = [];
      try {
        const response = await getUserOrders();
        console.log('🛒 Orders API Response Status:', response.status);
        console.log('🛒 Orders API Response Data:', response.data);
        
        // Handle different response structures
        if (response.data) {
          if (Array.isArray(response.data)) {
            ordersData = response.data;
          } else if (response.data.orders && Array.isArray(response.data.orders)) {
            ordersData = response.data.orders;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            ordersData = response.data.data;
          } else {
            console.log('🛒 Unexpected response structure, treating as empty array');
            ordersData = [];
          }
        }
        
        console.log('🛒 Processed API orders data:', ordersData);
        console.log('🛒 Number of API orders found:', ordersData.length);
        
        if (ordersData.length > 0) {
          // Process all orders to ensure pricing information is available
          const processedOrders = ordersData.map(order => processOrderData(order));
          console.log('✅ Processed orders with pricing:', processedOrders);
          setOrders(processedOrders);
          toast.success(isArabic ? `تم العثور على ${processedOrders.length} طلب` : `Found ${processedOrders.length} orders`);
          return;

        }
        
      } catch (apiError) {
        console.log('⚠️ API orders failed, using local orders:', apiError.message);
      }
      
      // Fallback to local orders
      if (user) {
        const localOrders = getLocalOrders(user.id || user.email);
        console.log('📦 Local orders:', localOrders);
        
        if (localOrders.length > 0) {
          // Process all local orders to ensure pricing information is available
          const processedLocalOrders = localOrders.map(order => processOrderData(order));
          console.log('✅ Processed local orders with pricing:', processedLocalOrders);
          setOrders(processedLocalOrders);
          toast.success(isArabic ? `تم العثور على ${processedLocalOrders.length} طلب محلي` : `Found ${processedLocalOrders.length} local orders`);
        } else {
          setOrders([]);
          toast.info(isArabic ? 'لا توجد طلبات حالياً' : 'No orders found');
        }
      } else {
        setOrders([]);
        toast.info(isArabic ? 'لا توجد طلبات حالياً' : 'No orders found');
      }
      
    } catch (error) {
      console.error('❌ Error fetching orders details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          (isArabic ? 'فشل في جلب الطلبات' : 'Failed to fetch orders');
      
      toast.error(errorMessage);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };
  

//   const fetchUserOrders = async () => {
//   setOrdersLoading(true);

//   try {
//     console.log('🛒 Fetching user orders...');
//     console.log('🔑 Auth token available:', !!localStorage.getItem('auth_token'));
//     console.log('👤 User authenticated:', !!user);

//     let ordersData = [];

//     try {
//       const response = await getUserOrders();
//       console.log('🛒 Orders API Response Status:', response.status);
//       console.log('🛒 Orders API Response Data:', response.data);

//       // استخراج الطلبات حسب تركيب البيانات
//       if (response.data) {
//         if (Array.isArray(response.data)) {
//           ordersData = response.data;
//         } else if (response.data.orders && Array.isArray(response.data.orders)) {
//           ordersData = response.data.orders;
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           ordersData = response.data.data;
//         } else {
//           ordersData = [];
//         }
//       }

//       console.log('🛒 Processed API orders data:', ordersData);
//       console.log('🛒 Number of API orders found:', ordersData.length);

//       if (ordersData.length > 0) {
//         const processedOrders = ordersData.map(order => processOrderData(order));
//         console.log('✅ Processed orders with pricing:', processedOrders);

//         setOrders(processedOrders);

//         // ✅ احفظ الطلبات الحقيقية في localStorage
//         saveOrderLocally(processedOrders, user.id || user.email);

//         toast.success(isArabic ? `تم العثور على ${processedOrders.length} طلب` : `Found ${processedOrders.length} orders`);
//         return;
//       } else {
//         setOrders([]);
//         toast.info(isArabic ? 'لا توجد طلبات حالياً' : 'No orders found');
//         return;
//       }

//     } catch (apiError) {
//       console.error('⚠️ API orders failed:', apiError.message);
//     }

//     // fallback: لو فشل الـ API نجيب الطلبات من localStorage
//     if (user) {
//       const localOrders = getLocalOrders(user.id || user.email);
//       console.log('📦 Local orders:', localOrders);

//       if (localOrders.length > 0) {
//         const processedLocalOrders = localOrders.map(order => processOrderData(order));
//         setOrders(processedLocalOrders);
//         toast.success(isArabic ? `تم العثور على ${processedLocalOrders.length} طلب محلي` : `Found ${processedLocalOrders.length} local orders`);
//       } else {
//         setOrders([]);
//         toast.info(isArabic ? 'لا توجد طلبات محلية' : 'No local orders found');
//       }
//     } else {
//       setOrders([]);
//       toast.info(isArabic ? 'لا توجد طلبات حالياً' : 'No orders found');
//     }

//   } catch (error) {
//     console.error('❌ Error fetching orders details:', {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status,
//       statusText: error.response?.statusText
//     });

//     const errorMessage = error.response?.data?.message || 
//                         error.response?.data?.error || 
//                         error.message || 
//                         (isArabic ? 'فشل في جلب الطلبات' : 'Failed to fetch orders');

//     toast.error(errorMessage);
//     setOrders([]);
//   } finally {
//     setOrdersLoading(false);
//   }
// };


  const fetchOrderDetails = async (orderId) => {
    setOrderDetailsLoading(true);
    try {
      console.log('🛒 Fetching order details for ID:', orderId);
      console.log('🛒 Available orders:', orders);
      
      // First, try to find the order in the current orders list
      const currentOrder = orders.find(order => 
        order.id === orderId || 
        order.orderNumber === orderId || 
        order.id?.toString() === orderId?.toString() ||
        order.orderNumber?.toString() === orderId?.toString()
      );
      
      if (currentOrder) {
        console.log('✅ Found order in current list:', currentOrder);
        // Process order data to ensure pricing information is available
        const processedOrder = processOrderData(currentOrder);
        setSelectedOrder(processedOrder);
        setOrderDetailsLoading(false);
        return;
      }
      
      // Try to get order details from API
      try {
        console.log('🌐 Attempting API call for order details...');
        const response = await getOrderDetails(orderId);
        console.log('🛒 Order details API response:', response.data);
        
        const orderData = response.data.order || response.data;
        if (orderData) {
          console.log('✅ Setting order data from API:', orderData);
          // Process order data to ensure pricing information is available
          const processedOrder = processOrderData(orderData);
          setSelectedOrder(processedOrder);
          setOrderDetailsLoading(false);
          return;
        }
      } catch (apiError) {
        console.log('⚠️ API order details failed:', apiError.message);
        console.log('⚠️ API error details:', apiError.response?.data);
      }
      
      // Fallback to local order details
      if (user) {
        console.log('📦 Trying local order lookup...');
        const localOrder = getLocalOrderById(orderId, user.id || user.email);
        console.log('📦 Local order details:', localOrder);
        
        if (localOrder) {
          console.log('✅ Setting order data from local storage:', localOrder);
          // Process order data to ensure pricing information is available
          const processedOrder = processOrderData(localOrder);
          setSelectedOrder(processedOrder);
          setOrderDetailsLoading(false);
          return;
        }
      }
      
      // If we get here, we couldn't find the order
      console.error('❌ Order not found in any source');
      toast.error(isArabic ? 'لم يتم العثور على الطلب' : 'Order not found');
      setSelectedOrder(null);
      
    } catch (error) {
      console.error('❌ Error fetching order details:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(isArabic ? 'فشل في جلب تفاصيل الطلب' : 'Failed to fetch order details');
      setSelectedOrder(null);
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  // Helper function to process order data and ensure pricing information is available
  const processOrderData = (order) => {
    console.log('🔧 Processing order data:', order);
    console.log('🔧 Order items:', order.items);
    
    // Calculate totals if not present
    let subtotal = 0;
    let total = 0;
    
    if (order.items && order.items.length > 0) {
      // Calculate subtotal from items
      subtotal = order.items.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price || item.unit_price || item.product?.price || 0);
        const itemQuantity = parseInt(item.quantity || 1);
        const itemTotal = itemPrice * itemQuantity;
        console.log(`📦 Item: ${item.product_name || item.name}, Price: ${itemPrice}, Qty: ${itemQuantity}, Total: ${itemTotal}`);
        return sum + itemTotal;
      }, 0);
      
      console.log('💰 Calculated subtotal:', subtotal);
      
      // Calculate total with tax and delivery fee
      const tax = subtotal * 0.15; // 15% tax
      const deliveryFee = parseFloat(order.delivery_fee || order.totals?.deliveryFee || 0);
      const discount = parseFloat(order.discount_amount || order.totals?.discount || 0);
      total = subtotal + tax + deliveryFee - discount;
      
      console.log('💰 Tax:', tax, 'Delivery Fee:', deliveryFee, 'Discount:', discount, 'Total:', total);
    }
    
    // Ensure items have proper pricing information
    const processedItems = order.items?.map((item, index) => {
      const processedItem = {
        ...item,
        price: parseFloat(item.price || item.unit_price || item.product?.price || 0),
        quantity: parseInt(item.quantity || 1),
        product_name: item.product_name || item.name || item.product?.name || `${isArabic ? 'منتج' : 'Product'} ${index + 1}`,
        notes: item.notes || ''
      };
      console.log(`📦 Processed item ${index + 1}:`, processedItem);
      return processedItem;
    }) || [];
    
    // Create processed order with all necessary pricing information
    const processedOrder = {
      ...order,
      items: processedItems,
      subtotal: order.subtotal || order.totals?.subtotal || subtotal,
      total_amount: order.total_amount || order.totals?.total || total,
      delivery_fee: order.delivery_fee || order.totals?.deliveryFee || 0,
      discount_amount: order.discount_amount || order.totals?.discount || 0,
      totals: {
        subtotal: order.subtotal || order.totals?.subtotal || subtotal,
        total: order.total_amount || order.totals?.total || total,
        deliveryFee: order.delivery_fee || order.totals?.deliveryFee || 0,
        discount: order.discount_amount || order.totals?.discount || 0,
        tax: (order.subtotal || order.totals?.subtotal || subtotal) * 0.15
      }
    };
    
    console.log('✅ Processed order data:', processedOrder);
    console.log('✅ Final totals:', {
      subtotal: processedOrder.subtotal,
      total: processedOrder.total_amount,
      deliveryFee: processedOrder.delivery_fee,
      discount: processedOrder.discount_amount
    });
    return processedOrder;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      console.log('❌ Cancelling order ID:', orderId);
      
      const response = await cancelOrder(orderId, 'Cancelled by user');
      console.log('✅ Order cancellation response:', response.data);
      
      toast.success(isArabic ? 'تم إلغاء الطلب بنجاح' : 'Order cancelled successfully');
      
      // Refresh orders list
      await fetchUserOrders();
      
      // Close modal if open
      setSelectedOrder(null);
      
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      toast.error(error.message || (isArabic ? 'فشل في إلغاء الطلب' : 'Failed to cancel order'));
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={20} />;
      case 'preparing':
        return <Package className="text-orange-500" size={20} />;
      case 'out_for_delivery':
        return <Truck className="text-purple-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-white" size={20} />;
    }
  };

  const getOrderStatusText = (status) => {
    if (!isArabic) {
      switch (status?.toLowerCase()) {
        case 'pending': return 'Pending';
        case 'confirmed': return 'Confirmed';
        case 'preparing': return 'Preparing';
        case 'out_for_delivery': return 'Out for Delivery';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        default: return 'Unknown';
      }
    } else {
      switch (status?.toLowerCase()) {
        case 'pending': return 'في الانتظار';
        case 'confirmed': return 'مؤكد';
        case 'preparing': return 'قيد التحضير';
        case 'out_for_delivery': return 'في الطريق';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
        default: return 'غير معروف';
      }
    }
  };

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && user && orders.length === 0) {
      fetchUserOrders();
      
  //            Add sample order data for testing if no orders exist
  //      if (user && orders.length === 0) {
  //        const sampleOrder = {
  //          id: '13232',
  //          orderNumber: '13232',
  //          status: 'pending',
  //          order_type: 'takeaway',
  //          payment_method: 'cash_on_delivery',
  //          created_at: new Date().toISOString(),
  //          items: [
  //            {
  //              product_name: 'Espresso',
  //              price: 15.50,
  //              quantity: 2,
  //              notes: 'Extra hot'
  //            },
  //            {
  //              product_name: 'Cappuccino',
  //              price: 18.00,
  //              quantity: 1,
  //              notes: 'No sugar'
  //            }
  //          ],
  //          subtotal: 49.00,
  //          delivery_fee: 0,
  //          discount_amount: 0,
  //          total_amount: 56.35, // Including 15% tax
  //          customer_notes: 'Please make it extra hot',
  //          totals: {
  //            subtotal: 49.00,
  //            total: 56.35,
  //            deliveryFee: 0,
  //            discount: 0,
  //            tax: 7.35
  //          }
  //        };
         
  //        // Create a second sample order for testing
  //        const sampleOrder2 = {
  //          id: '13231',
  //          orderNumber: '13231',
  //          status: 'completed',
  //          order_type: 'delivery',
  //          payment_method: 'cash_on_delivery',
  //          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  //          items: [
  //            {
  //              product_name: 'Latte',
  //              price: 20.00,
  //              quantity: 1,
  //              notes: 'Extra milk'
  //            },
  //            {
  //              product_name: 'Americano',
  //              price: 12.50,
  //              quantity: 2,
  //              notes: 'No cream'
  //            }
  //          ],
  //          subtotal: 45.00,
  //          delivery_fee: 5.00,
  //          discount_amount: 2.00,
  //          total_amount: 54.75, // Including 15% tax
  //          customer_notes: 'Please deliver to the main entrance',
  //          totals: {
  //            subtotal: 45.00,
  //            total: 54.75,
  //            deliveryFee: 5.00,
  //            discount: 2.00,
  //            tax: 6.75
  //          }
  //        };
         
  //        // Save sample orders locally for testing
  //        try {
  //          saveOrderLocally(sampleOrder, user.id || user.email);
  //          saveOrderLocally(sampleOrder2, user.id || user.email);
  //          console.log('📝 Sample orders saved for testing');
  //        } catch (error) {
  //          console.error('Error saving sample orders:', error);
  //        }
  //      }
    }
  }, [activeTab, user]);

  // Handle Escape key to close order details modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && selectedOrder) {
        setSelectedOrder(null);
      }
    };

    if (selectedOrder) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedOrder]);

  // Debug selectedOrder changes
  useEffect(() => {
    console.log('🔍 selectedOrder state changed:', selectedOrder);
  }, [selectedOrder]);

  // Reset loading state when modal is closed
  useEffect(() => {
    if (!selectedOrder) {
      setOrderDetailsLoading(false);
    }
  }, [selectedOrder]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
              const reader = new FileReader();
        reader.onloadend = () => {
          // In a real app, you'd upload to a server
          // For now, we'll just show a placeholder
          toast.info(isArabic ? 'ميزة رفع الصور قريباً!' : 'Image upload feature coming soon!');
        };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {isArabic ? 'يرجى تسجيل الدخول لعرض ملفك الشخصي' : 'Please log in to view your profile'}
          </h2>
        </div>
      </div>
    );
  }

      return (
      <div 
        className="min-h-screen py-8 bg-cover bg-center bg-no-repeat relative" 
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          backgroundImage: 'url(/images/bg_4.jpg)',
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">


                  {/* Profile Header */}
          <div 
            className="rounded-xl shadow-xl overflow-hidden mb-8 border-2 border-primary bg-cover bg-center relative"
            style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}
          >
            {/* Component overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10">
          <div className="bg-gradient-to-r from-amber-600 to-primary h-32 sm:h-40"></div>
          <div className="relative px-6 pb-6">
            {/* Profile Image */}
            <div className="flex items-end -mt-16 mb-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                                          <User size={40} className="text-white" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary transition-colors">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="ml-4 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {user.name}
                </h1>
                <p className="text-white">{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`${isArabic ? 'mr-4' : 'ml-4'} flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors`}
              >
                {isEditing ? <X size={16} /> : <Edit size={16} />}
                {isEditing ? (isArabic ? 'إلغاء' : 'Cancel') : (isArabic ? 'تعديل' : 'Edit')}
              </button>
            </div>
          </div>
            </div>
          </div>

        {/* Tabs */}
        <div 
          className="rounded-xl shadow-xl overflow-hidden border-2 border-primary bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}
        >
          {/* Component overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-white hover:text-primary'
                }`}
              >
                {isArabic ? 'معلومات الملف الشخصي' : 'Profile Info'}
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'password'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-white hover:text-primary'
                }`}
              >
                {isArabic ? 'تغيير كلمة المرور' : 'Change Password'}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-white hover:text-primary'
                }`}
              >
                {isArabic ? 'طلباتي' : 'My Orders'}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {isArabic ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-white`} size={20} />
                      <input
                        {...registerProfile('name')}
                        type="text"
                        disabled={!isEditing}
                        className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm ${
                          !isEditing ? 'opacity-75' : ''
                        }`}
                        style={{ 
                          backgroundImage: 'url(/images/bg_4.jpg)',
                          backgroundBlendMode: 'overlay',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)'
                        }}
                        placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {isArabic ? 'عنوان البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-white`} size={20} />
                      <input
                        {...registerProfile('email')}
                        type="email"
                        disabled={!isEditing}
                        className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm ${
                          !isEditing ? 'opacity-75' : ''
                        }`}
                        style={{ 
                          backgroundImage: 'url(/images/bg_4.jpg)',
                          backgroundBlendMode: 'overlay',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)'
                        }}
                        placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                    )}
                  </div>

                  {/* Mobile Field */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {isArabic ? 'رقم الهاتف المحمول' : 'Mobile Number'}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-white`} size={20} />
                      <input
                        {...registerProfile('mobile')}
                        type="tel"
                        disabled={!isEditing}
                        className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm ${
                          !isEditing ? 'opacity-75' : ''
                        }`}
                        style={{ 
                          backgroundImage: 'url(/images/bg_4.jpg)',
                          backgroundBlendMode: 'overlay',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)'
                        }}
                        placeholder={isArabic ? 'أدخل رقم هاتفك المحمول' : 'Enter your mobile number'}
                      />
                    </div>
                    {profileErrors.mobile && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.mobile.message}</p>
                    )}
                  </div>

                  {/* Profile Image URL Field */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {isArabic ? 'رابط صورة الملف الشخصي' : 'Profile Image URL'}
                    </label>
                    <input
                      {...registerProfile('profile_image')}
                      type="url"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm ${
                        !isEditing ? 'opacity-75' : ''
                      }`}
                      style={{ 
                        backgroundImage: 'url(/images/bg_4.jpg)',
                        backgroundBlendMode: 'overlay',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                      }}
                      placeholder={isArabic ? 'أدخل رابط الصورة' : 'Enter image URL'}
                    />
                    {profileErrors.profile_image && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.profile_image.message}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className={`flex ${isArabic ? 'justify-start space-x-reverse' : 'justify-end'} space-x-4`}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-primary rounded-lg text-primary hover:bg-primary transition-colors"
                    >
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary     transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {loading ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التغييرات' : 'Save Changes')}
                    </button>
                  </div>
                )}
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="max-w-md space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {isArabic ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input
                    {...registerPassword('current_password')}
                    type="password"
                    className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm"
                    style={{ 
                      backgroundImage: 'url(/images/bg_4.jpg)',
                      backgroundBlendMode: 'overlay',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                    placeholder={isArabic ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                  />
                  {passwordErrors.current_password && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.current_password.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {isArabic ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input
                    {...registerPassword('password')}
                    type="password"
                    className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm"
                    style={{ 
                      backgroundImage: 'url(/images/bg_4.jpg)',
                      backgroundBlendMode: 'overlay',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                    placeholder={isArabic ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                  />
                  {passwordErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {isArabic ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                  </label>
                  <input
                    {...registerPassword('password_confirmation')}
                    type="password"
                    className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white bg-cover bg-center backdrop-blur-sm"
                    style={{ 
                      backgroundImage: 'url(/images/bg_4.jpg)',
                      backgroundBlendMode: 'overlay',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                    placeholder={isArabic ? 'أكد كلمة المرور الجديدة' : 'Confirm new password'}
                  />
                  {passwordErrors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.password_confirmation.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {loading ? (isArabic ? 'جاري تغيير كلمة المرور...' : 'Changing Password...') : (isArabic ? 'تغيير كلمة المرور' : 'Change Password')}
                </button>
              </form>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8">
                {/* Enhanced Orders Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-primary rounded-full mb-4">
                    <Package className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isArabic ? 'طلباتي' : 'My Orders'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {isArabic ? 'تتبع جميع طلباتك السابقة والحالية' : 'Track all your previous and current orders'}
                  </p>
                </div>

                {/* Enhanced Refresh Button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={fetchUserOrders}
                    disabled={ordersLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-primary transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {ordersLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isArabic ? 'جاري التحديث...' : 'Refreshing...'}
                      </>
                    ) : (
                      <>
                        <Package size={18} />
                        {isArabic ? 'تحديث الطلبات' : 'Refresh Orders'}
                      </>
                    )}
                  </button>
                </div>

                {/* Enhanced Orders List */}
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-primary rounded-full mb-6 animate-pulse">
                        <Package className="text-white" size={40} />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {isArabic ? 'جاري تحميل الطلبات...' : 'Loading Orders...'}
                      </h4>
                      <p className="text-white/70">
                        {isArabic ? 'يرجى الانتظار قليلاً' : 'Please wait a moment'}
                      </p>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6">
                        <Package className="text-white" size={48} />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {isArabic ? 'لا توجد طلبات حتى الآن' : 'No Orders Yet'}
                      </h4>
                      <p className="text-white/70 mb-6">
                        {isArabic ? 'ابدأ بالتسوق وستظهر طلباتك هنا' : 'Start shopping and your orders will appear here'}
                      </p>
                      <button
                        onClick={() => window.location.href = '/shop'}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {isArabic ? 'تسوق الآن' : 'Shop Now'}
                      </button>
                    </div>
                  </div>
                ) : (
                                     <div className="space-y-6">
                     {orders.map((order) => {
                       console.log('📋 Rendering order:', order);
                       return (
                       <div
                         key={order.id}
                         className="group relative overflow-hidden rounded-2xl border-2 border-primary/30 hover:border-primary transition-all duration-500 bg-cover bg-center shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
                         style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}
                       >
                         
                        

                         <div className="relative z-10 p-6">
                           {/* Order Header */}
                           <div className="flex items-start justify-between mb-4">
                             <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                 <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-primary rounded-full flex items-center justify-center">
                                   
                                 </div>
                                 <div>
                                   <h4 className="text-lg font-bold text-white">
                                     {isArabic ? `طلب رقم #${order.id || order.orderNumber}` : `Order #${order.id || order.orderNumber}`}
                                   </h4>
                                   <p className="text-white/80 text-sm">
                                     {order.created_at ? new Date(order.created_at).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
                                       year: 'numeric',
                                       month: 'long',
                                       day: 'numeric',
                                       hour: '2-digit',
                                       minute: '2-digit'
                                     }) : ''}
                                   </p>
                                 </div>
                               </div>
                             </div>
                             
                             {/* Total Amount */}
                             <div className="text-right">
                               <div className="bg-gradient-to-r from-amber-400 to-primary px-4 py-2 rounded-full">
                                 <p className="text-white font-bold text-lg">
                                   {order.total_amount ? parseFloat(order.total_amount).toFixed(2) : 
                                     order.totals?.total ? parseFloat(order.totals.total).toFixed(2) : '0.00'} EGP
                                 </p>
                               </div>
                             </div>
                           </div>

                           {/* Order Details */}
                           <div className="grid md:grid-cols-2 gap-4 mb-4">
                             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                               <p className="text-white/80 text-xs mb-1">
                                 {isArabic ? 'نوع الطلب' : 'Order Type'}
                               </p>
                               <p className="text-white font-medium">
                                 {isArabic ? 
                                   (order.order_type === 'delivery' ? '🚚 توصيل' : '🏪 استلام') : 
                                   (order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Takeaway')}
                               </p>
                             </div>
                             
                             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                               <p className="text-white/80 text-xs mb-1">
                                 {isArabic ? 'عدد العناصر' : 'Items Count'}
                               </p>
                               <p className="text-white font-medium">
                                 {order.items ? order.items.length : 0} {isArabic ? 'عنصر' : 'items'}
                               </p>
                             </div>
                           </div>

                           {/* Action Button */}
                           <div className="flex justify-center">
                             <button
                               onClick={() => {
                                 console.log('🔍 View Details clicked for order:', order);
                                 setOrderDetailsLoading(false); // Ensure loading is false when showing from current list
                                 // First try to show directly from current orders list
                                 const currentOrder = orders.find(o => 
                                   o.id === order.id || 
                                   o.orderNumber === order.orderNumber ||
                                   o.id?.toString() === order.id?.toString()
                                 );
                                 
                                 if (currentOrder) {
                                   console.log('✅ Showing order from current list:', currentOrder);
                                   // Process order data to ensure pricing information is available
                                   const processedOrder = processOrderData(currentOrder);
                                   setSelectedOrder(processedOrder);
                                   console.log('🎉 Modal should now be visible');
                                 } else {
                                   // Fallback to API call
                                   console.log('🔄 Falling back to API call');
                                   fetchOrderDetails(order.id || order.orderNumber);
                                 }
                               }}
                               disabled={orderDetailsLoading}
                               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-primary transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110"
                             >
                               <Eye size={18} />
                               {isArabic ? 'عرض التفاصيل' : 'View Details'}
                             </button>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                  </div>
                )}

                {/* Enhanced Order Details Modal */}
                {selectedOrder && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div 
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                      onClick={() => setSelectedOrder(null)}
                    ></div>
                    <div 
                      className="relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border-2 border-primary/30"
                    >
                                              <div className="p-8">
                        {/* Enhanced Modal Header */}
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-primary rounded-full mb-4">
                            <Package className="text-white" size={32} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {isArabic ? `تفاصيل الطلب #${selectedOrder.id || selectedOrder.orderNumber}` : `Order #${selectedOrder.id || selectedOrder.orderNumber} Details`}
                          </h3>
                          <div className="flex items-center justify-center gap-2">
                            {getOrderStatusIcon(selectedOrder.status)}
                            <span className="text-gray-600 font-medium">
                              {getOrderStatusText(selectedOrder.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {isArabic ? 'اضغط ESC أو انقر خارج النافذة للإغلاق' : 'Press ESC or click outside to close'}
                          </p>
                        </div>
                        
                        {/* Enhanced Close Button */}
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 transition-all duration-300 p-2 hover:bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 border border-gray-200 hover:border-red-200"
                          title={isArabic ? 'إغلاق' : 'Close'}
                        >
                          <X size={24} />
                        </button>

                        {orderDetailsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <Package className="mx-auto text-gray-400 mb-4" size={48} />
                              <p className="text-gray-500">
                                {isArabic ? 'جاري تحميل التفاصيل...' : 'Loading details...'}
                              </p>
                            </div>
                          </div>
                                                ) : selectedOrder ? (
                          <div className="space-y-6">
                            
                            
                            {/* Order Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {isArabic ? 'معلومات الطلب' : 'Order Information'}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">{isArabic ? 'الحالة:' : 'Status:'}</span> {getOrderStatusText(selectedOrder.status)}</p>
                                  <p><span className="font-medium">{isArabic ? 'النوع:' : 'Type:'}</span> {selectedOrder.order_type === 'delivery' ? (isArabic ? 'توصيل' : 'Delivery') : (isArabic ? 'استلام' : 'Takeaway')}</p>
                                  <p><span className="font-medium">{isArabic ? 'طريقة الدفع:' : 'Payment:'}</span> {selectedOrder.payment_method || 'N/A'}</p>
                                  <p><span className="font-medium">{isArabic ? 'التاريخ:' : 'Date:'}</span> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US') : selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US') : 'N/A'}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {isArabic ? 'الإجمالي' : 'Total'}
                                </h4>
                                                                 <div className="space-y-2 text-sm">
                                   <p><span className="font-medium">{isArabic ? 'المبلغ الفرعي:' : 'Subtotal:'}</span> {selectedOrder.subtotal || selectedOrder.totals?.subtotal || '0.00'} EGP</p>
                                   <p><span className="font-medium">{isArabic ? 'رسوم التوصيل:' : 'Delivery Fee:'}</span> {selectedOrder.delivery_fee || selectedOrder.totals?.deliveryFee || '0.00'} EGP</p>
                                   <p><span className="font-medium">{isArabic ? 'الخصم:' : 'Discount:'}</span> {selectedOrder.discount_amount || selectedOrder.totals?.discount || '0.00'} EGP</p>
                                   <p className="font-bold text-lg"><span className="font-medium">{isArabic ? 'الإجمالي:' : 'Total:'}</span> {selectedOrder.total_amount || selectedOrder.totals?.total || '0.00'} EGP</p>
                                 </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  {isArabic ? 'عناصر الطلب' : 'Order Items'}
                                </h4>
                                <div className="space-y-3">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-amber-50 border border-primary p-3 rounded-lg">
                                      <div>
                                        <p className="font-medium">{item.product_name || item.name || `${isArabic ? 'منتج' : 'Product'} ${index + 1}`}</p>
                                        {item.notes && (
                                          <p className="text-sm text-gray-500">{isArabic ? 'ملاحظات:' : 'Notes:'} {item.notes}</p>
                                        )}
                                      </div>
                                                                             <div className="text-right">
                                         <p className="font-medium">{item.price || '0.00'} EGP × {item.quantity || 1}</p>
                                         <p className="text-sm text-gray-500">{((item.price || 0) * (item.quantity || 1)).toFixed(2)} EGP</p>
                                       </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  {isArabic ? 'عناصر الطلب' : 'Order Items'}
                                </h4>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                                  <p className="text-gray-500">
                                    {isArabic ? 'لا توجد تفاصيل العناصر متاحة' : 'No item details available'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {selectedOrder.customer_notes && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {isArabic ? 'ملاحظات العميل' : 'Customer Notes'}
                                </h4>
                                <p className="text-sm text-gray-600 bg-amber-50 border border-primary p-3 rounded-lg">
                                  {selectedOrder.customer_notes}
                                </p>
                              </div>
                            )}

                            {/* Cancel Order Button - Only show for pending/confirmed orders */}
                            {selectedOrder.status && ['pending', 'confirmed'].includes(selectedOrder.status.toLowerCase()) && (
                              <div className="pt-6 border-t border-gray-200">
                                <button
                                  onClick={() => handleCancelOrder(selectedOrder.id || selectedOrder.orderNumber)}
                                  className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                  {isArabic ? 'إلغاء الطلب' : 'Cancel Order'}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <Package className="mx-auto text-gray-400 mb-4" size={48} />
                              <p className="text-gray-500">
                                {isArabic ? 'لا توجد تفاصيل متاحة للطلب' : 'No order details available'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    </div>
                )}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Logout Section */}
        <div 
          className="rounded-xl shadow-xl p-6 mt-8 border-2 border-primary bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}
        >
          {/* Component overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
          <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-white mb-4">
              {isArabic ? 'إجراءات الحساب' : 'Account Actions'}
            </h3>
          <button
            onClick={() => {
              logout();
              toast.info(isArabic ? 'تم تسجيل الخروج' : 'You have been logged out');
            }}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors"
          >
            {isArabic ? 'تسجيل الخروج' : 'Logout'}
          </button>
          </div>
        </div>
        </div>
      </div>
    );
  };

export default Profile; 







// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { useAuth } from "../contexts/AuthContext"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { User, Mail, Phone, Camera, Edit, Save, X, Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react'
// import { toast } from "react-toastify"
// import {
//   updateUserProfile,
//   changePassword,
//   getUserOrders,
//   getOrderDetails,
//   getLocalOrders,
//   getLocalOrderById,
//   cancelOrder,
//   saveOrderLocally,
// } from "../services/api"
// import { useRTL } from "../App"

// const createProfileSchema = (isArabic) =>
//   z.object({
//     name: z.string().min(2, isArabic ? "الاسم يجب أن يكون على الأقل حرفين" : "Name must be at least 2 characters"),
//     email: z.string().email(isArabic ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email"),
//     mobile: z.string().optional(),
//     profile_image: z.string().optional(),
//   })

// const createPasswordSchema = (isArabic) =>
//   z
//     .object({
//       current_password: z.string().min(6, isArabic ? "كلمة المرور الحالية مطلوبة" : "Current password is required"),
//       password: z
//         .string()
//         .min(
//           6,
//           isArabic ? "كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف" : "New password must be at least 6 characters",
//         ),
//       password_confirmation: z
//         .string()
//         .min(6, isArabic ? "تأكيد كلمة المرور مطلوب" : "Password confirmation is required"),
//     })
//     .refine((data) => data.password === data.password_confirmation, {
//       message: isArabic ? "كلمات المرور غير متطابقة" : "Passwords don't match",
//       path: ["password_confirmation"],
//     })

// // مفاتيح التخزين المحلي
// const STORAGE_KEYS = {
//   USER_PROFILE: "user_profile_data",
//   USER_BACKUP: "user_profile_backup",
//   LAST_UPDATE: "profile_last_update",
//   UPDATE_LOCK: "profile_update_lock",
// }

// // دالة لحفظ البيانات في عدة أماكن
// const saveUserDataSecurely = (userData) => {
//   try {
//     const dataToSave = {
//       ...userData,
//       timestamp: Date.now(),
//       version: "1.0",
//     }

//     // حفظ في localStorage
//     localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(dataToSave))
//     localStorage.setItem(STORAGE_KEYS.USER_BACKUP, JSON.stringify(dataToSave))
//     localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString())

//     // حفظ في sessionStorage كنسخة إضافية
//     sessionStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(dataToSave))

//     console.log("💾 User data saved securely:", dataToSave)
//     return true
//   } catch (error) {
//     console.error("❌ Failed to save user data:", error)
//     return false
//   }
// }

// // دالة لاسترجاع البيانات المحفوظة
// const loadUserDataSecurely = () => {
//   try {
//     // محاولة الاسترجاع من localStorage أولاً
//     let userData = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)

//     // إذا لم توجد، جرب من sessionStorage
//     if (!userData) {
//       userData = sessionStorage.getItem(STORAGE_KEYS.USER_PROFILE)
//     }

//     // إذا لم توجد، جرب من النسخة الاحتياطية
//     if (!userData) {
//       userData = localStorage.getItem(STORAGE_KEYS.USER_BACKUP)
//     }

//     if (userData) {
//       const parsedData = JSON.parse(userData)
//       console.log("📦 Loaded user data securely:", parsedData)
//       return parsedData
//     }

//     return null
//   } catch (error) {
//     console.error("❌ Failed to load user data:", error)
//     return null
//   }
// }

// // دالة للتحقق من وجود قفل التحديث
// const isUpdateLocked = () => {
//   try {
//     const lockTime = localStorage.getItem(STORAGE_KEYS.UPDATE_LOCK)
//     if (lockTime) {
//       const timeDiff = Date.now() - Number.parseInt(lockTime)
//       return timeDiff < 3000 // قفل لمدة 3 ثوانٍ بدلاً من 10
//     }
//     return false
//   } catch {
//     return false
//   }
// }

// // دالة لتعيين قفل التحديث
// const setUpdateLock = () => {
//   try {
//     localStorage.setItem(STORAGE_KEYS.UPDATE_LOCK, Date.now().toString())
//   } catch (error) {
//     console.error("❌ Failed to set update lock:", error)
//   }
// }

// // دالة لإزالة قفل التحديث
// const removeUpdateLock = () => {
//   try {
//     localStorage.removeItem(STORAGE_KEYS.UPDATE_LOCK)
//   } catch (error) {
//     console.error("❌ Failed to remove update lock:", error)
//   }
// }

// const Profile = () => {
//   const { user, logout, updateUserData } = useAuth() // إزالة refreshUserData و updateUserData
//   const { isArabic } = useRTL()
//   const [isEditing, setIsEditing] = useState(false)
//   const [activeTab, setActiveTab] = useState("profile")
//   const [loading, setLoading] = useState(false)

//   // حالة المستخدم المحلية المعزولة تماماً
//   const [isolatedUser, setIsolatedUser] = useState(null)
//   const [isInitialized, setIsInitialized] = useState(false)

//   // مرجع لمنع التحديثات المتعددة
//   const updateInProgressRef = useRef(false)
//   const initializationRef = useRef(false)

//   // Orders state
//   const [orders, setOrders] = useState([])
//   const [ordersLoading, setOrdersLoading] = useState(false)
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [orderDetailsLoading, setOrderDetailsLoading] = useState(false)

//   const {
//     register: registerProfile,
//     handleSubmit: handleProfileSubmit,
//     formState: { errors: profileErrors },
//     reset: resetProfile,
//     setValue: setProfileValue,
//     watch: watchProfile,
//   } = useForm({
//     resolver: zodResolver(createProfileSchema(isArabic)),
//     defaultValues: {
//       name: "",
//       email: "",
//       mobile: "",
//       profile_image: "",
//     },
//   })

//   const {
//     register: registerPassword,
//     handleSubmit: handlePasswordSubmit,
//     formState: { errors: passwordErrors },
//     reset: resetPassword,
//   } = useForm({
//     resolver: zodResolver(createPasswordSchema(isArabic)),
//   })

//   // دالة لتحديث البيانات المحلية
//   const updateIsolatedUser = useCallback(
//     (newUserData) => {
//       console.log("🔄 Updating isolated user:", newUserData)

//       if (updateInProgressRef.current) {
//         console.log("⚠️ Update already in progress, skipping")
//         return
//       }

//       setIsolatedUser(newUserData)
//       saveUserDataSecurely(newUserData)
//       setUpdateLock()

//       // إزالة القفل بعد 3 ثوانٍ بدلاً من 10
//       setTimeout(() => {
//         removeUpdateLock()
//       }, 3000)

//       // تحديث الفورم
//       resetProfile({
//         name: newUserData?.name || "",
//         email: newUserData?.email || "",
//         mobile: newUserData?.mobile || "",
//         profile_image: newUserData?.profile_image || "",
//       })
//     },
//     [resetProfile],
//   )

//   // تهيئة البيانات عند التحميل الأول
//   useEffect(() => {
//     if (initializationRef.current) return
//     initializationRef.current = true

//     console.log("🚀 Initializing profile data...")

//     // محاولة تحميل البيانات المحفوظة أولاً
//     const savedData = loadUserDataSecurely()

//     if (savedData && !isUpdateLocked()) {
//       console.log("✅ Using saved data:", savedData)
//       updateIsolatedUser(savedData)
//       setIsInitialized(true)
//     } else if (user && !isUpdateLocked()) {
//       console.log("✅ Using context user data:", user)
//       updateIsolatedUser(user)
//       setIsInitialized(true)
//     } else {
//       console.log("⚠️ No data available or update locked")
//       setIsInitialized(true)
//     }
//   }, [user, updateIsolatedUser])

//   // مراقبة تغييرات المستخدم من الـ context (مع السماح بالتحديثات)
//   useEffect(() => {
//     if (!isInitialized) return

//     // السماح بالتحديث إذا كانت البيانات مختلفة وليس هناك قفل
//     if (user && !isUpdateLocked()) {
//       const userChanged = 
//         !isolatedUser || 
//         user.name !== isolatedUser.name || 
//         user.email !== isolatedUser.email || 
//         user.mobile !== isolatedUser.mobile || 
//         user.profile_image !== isolatedUser.profile_image

//       if (userChanged) {
//         console.log("🔄 Context user changed, updating isolated user:", user)
//         updateIsolatedUser(user)
//       }
//     }
//   }, [user, isInitialized, isolatedUser, updateIsolatedUser])

//   const onProfileSubmit = async (data) => {
//     if (updateInProgressRef.current) {
//       toast.warning(isArabic ? "التحديث قيد التنفيذ..." : "Update in progress...")
//       return
//     }

//     updateInProgressRef.current = true
//     setLoading(true)
//     console.log("🚀 Profile Update Started")
//     console.log("📝 Form Data:", data)
//     console.log("👤 Current Isolated User:", isolatedUser)

//     try {
//       const response = await updateUserProfile(data)
//       console.log("✅ Profile Update Response:", response)

//       if (response.status === 200 || response.status === 201) {
//         // إنشاء بيانات المستخدم المحدثة
//         const updatedUserData = {
//           ...isolatedUser,
//           ...data,
//           // إذا كانت الاستجابة تحتوي على بيانات محدثة، استخدمها
//           ...(response.data?.user || response.data || {}),
//           id: isolatedUser?.id || user?.id,
//           // التأكد من وجود معرف فريد
//           timestamp: Date.now(),
//         }

//         console.log("🔄 Updated user data:", updatedUserData)

//         // تحديث البيانات المحلية فوراً
//         updateIsolatedUser(updatedUserData)

//         // تحديث الـ AuthContext أيضاً لتزامن البيانات مع باقي التطبيق
//         try {
//           if (updateUserData) {
//             await updateUserData(updatedUserData)
//             console.log("✅ Context updated successfully")
//           }
//         } catch (contextError) {
//           console.warn("⚠️ Context update failed:", contextError)
//         }

//         toast.success(isArabic ? "تم تحديث الملف الشخصي بنجاح!" : "Profile updated successfully!")
//         setIsEditing(false)

//         console.log("✨ Profile update completed successfully")
//       } else {
//         console.warn("⚠️ Unexpected response status:", response.status)
//         toast.warning(isArabic ? "استجابة غير متوقعة من الخادم" : "Unexpected server response")
//       }
//     } catch (error) {
//       console.error("❌ Profile Update Error:", {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//         statusText: error.response?.statusText,
//       })

//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         (isArabic ? "فشل في تحديث الملف الشخصي" : "Failed to update profile")
//       toast.error(errorMessage)
//     } finally {
//       setLoading(false)
//       updateInProgressRef.current = false
//       console.log("🏁 Profile update process finished")
//     }
//   }

//   const onPasswordSubmit = async (data) => {
//     setLoading(true)
//     try {
//       const response = await changePassword(data)

//       if (response.status === 200) {
//         toast.success(isArabic ? "تم تغيير كلمة المرور بنجاح!" : "Password changed successfully!")
//         resetPassword()
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || (isArabic ? "فشل في تغيير كلمة المرور" : "Failed to change password"),
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   // إلغاء التعديل والعودة للقيم الأصلية
//   const handleCancelEdit = () => {
//     setIsEditing(false)
//     resetProfile({
//       name: isolatedUser?.name || "",
//       email: isolatedUser?.email || "",
//       mobile: isolatedUser?.mobile || "",
//       profile_image: isolatedUser?.profile_image || "",
//     })
//   }

//   // دالة لإعادة تحميل البيانات يدوياً
//   const handleRefreshProfile = () => {
//     const savedData = loadUserDataSecurely()
//     if (savedData) {
//       updateIsolatedUser(savedData)
//       toast.success(isArabic ? "تم تحديث البيانات" : "Data refreshed")
//     } else {
//       toast.info(isArabic ? "لا توجد بيانات محفوظة" : "No saved data found")
//     }
//   }

//   // =================== 🛒 ORDERS FUNCTIONALITY ===================

//   const fetchUserOrders = async () => {
//     setOrdersLoading(true)
//     try {
//       console.log("🛒 Fetching user orders...")
//       console.log("🔑 Auth token available:", !!localStorage.getItem("auth_token"))
//       console.log("👤 User authenticated:", !!isolatedUser)

//       // Try to get orders from API first
//       let ordersData = []
//       try {
//         const response = await getUserOrders()
//         console.log("🛒 Orders API Response Status:", response.status)
//         console.log("🛒 Orders API Response Data:", response.data)

//         // Handle different response structures
//         if (response.data) {
//           if (Array.isArray(response.data)) {
//             ordersData = response.data
//           } else if (response.data.orders && Array.isArray(response.data.orders)) {
//             ordersData = response.data.orders
//           } else if (response.data.data && Array.isArray(response.data.data)) {
//             ordersData = response.data.data
//           } else {
//             console.log("🛒 Unexpected response structure, treating as empty array")
//             ordersData = []
//           }
//         }

//         console.log("🛒 Processed API orders data:", ordersData)
//         console.log("🛒 Number of API orders found:", ordersData.length)

//         if (ordersData.length > 0) {
//           // Process all orders to ensure pricing information is available
//           const processedOrders = ordersData.map((order) => processOrderData(order))
//           console.log("✅ Processed orders with pricing:", processedOrders)
//           setOrders(processedOrders)
//           toast.success(
//             isArabic ? `تم العثور على ${processedOrders.length} طلب` : `Found ${processedOrders.length} orders`,
//           )
//           return
//         }
//       } catch (apiError) {
//         console.log("⚠️ API orders failed, using local orders:", apiError.message)
//       }

//       // Fallback to local orders
//       if (isolatedUser) {
//         const userId = isolatedUser.id || isolatedUser.email
//         const localOrders = getLocalOrders(userId)
//         console.log("📦 Local orders:", localOrders)

//         if (localOrders.length > 0) {
//           // Process all local orders to ensure pricing information is available
//           const processedLocalOrders = localOrders.map((order) => processOrderData(order))
//           console.log("✅ Processed local orders with pricing:", processedLocalOrders)
//           setOrders(processedLocalOrders)
//           toast.success(
//             isArabic
//               ? `تم العثور على ${processedLocalOrders.length} طلب محلي`
//               : `Found ${processedLocalOrders.length} local orders`,
//           )
//         } else {
//           setOrders([])
//           toast.info(isArabic ? "لا توجد طلبات حالياً" : "No orders found")
//         }
//       } else {
//         setOrders([])
//         toast.info(isArabic ? "لا توجد طلبات حالياً" : "No orders found")
//       }
//     } catch (error) {
//       console.error("❌ Error fetching orders details:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//       })

//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         (isArabic ? "فشل في جلب الطلبات" : "Failed to fetch orders")

//       toast.error(errorMessage)
//       setOrders([])
//     } finally {
//       setOrdersLoading(false)
//     }
//   }

//   const fetchOrderDetails = async (orderId) => {
//     setOrderDetailsLoading(true)
//     try {
//       console.log("🛒 Fetching order details for ID:", orderId)
//       console.log("🛒 Available orders:", orders)

//       // First, try to find the order in the current orders list
//       const currentOrder = orders.find(
//         (order) =>
//           order.id === orderId ||
//           order.orderNumber === orderId ||
//           order.id?.toString() === orderId?.toString() ||
//           order.orderNumber?.toString() === orderId?.toString(),
//       )

//       if (currentOrder) {
//         console.log("✅ Found order in current list:", currentOrder)
//         // Process order data to ensure pricing information is available
//         const processedOrder = processOrderData(currentOrder)
//         setSelectedOrder(processedOrder)
//         setOrderDetailsLoading(false)
//         return
//       }

//       // Try to get order details from API
//       try {
//         console.log("🌐 Attempting API call for order details...")
//         const response = await getOrderDetails(orderId)
//         console.log("🛒 Order details API response:", response.data)

//         const orderData = response.data.order || response.data
//         if (orderData) {
//           console.log("✅ Setting order data from API:", orderData)
//           // Process order data to ensure pricing information is available
//           const processedOrder = processOrderData(orderData)
//           setSelectedOrder(processedOrder)
//           setOrderDetailsLoading(false)
//           return
//         }
//       } catch (apiError) {
//         console.log("⚠️ API order details failed:", apiError.message)
//         console.log("⚠️ API error details:", apiError.response?.data)
//       }

//       // Fallback to local order details
//       if (isolatedUser) {
//         console.log("📦 Trying local order lookup...")
//         const userId = isolatedUser.id || isolatedUser.email
//         const localOrder = getLocalOrderById(orderId, userId)
//         console.log("📦 Local order details:", localOrder)

//         if (localOrder) {
//           console.log("✅ Setting order data from local storage:", localOrder)
//           // Process order data to ensure pricing information is available
//           const processedOrder = processOrderData(localOrder)
//           setSelectedOrder(processedOrder)
//           setOrderDetailsLoading(false)
//           return
//         }
//       }

//       // If we get here, we couldn't find the order
//       console.error("❌ Order not found in any source")
//       toast.error(isArabic ? "لم يتم العثور على الطلب" : "Order not found")
//       setSelectedOrder(null)
//     } catch (error) {
//       console.error("❌ Error fetching order details:", error)
//       console.error("❌ Error details:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       })
//       toast.error(isArabic ? "فشل في جلب تفاصيل الطلب" : "Failed to fetch order details")
//       setSelectedOrder(null)
//     } finally {
//       setOrderDetailsLoading(false)
//     }
//   }

//   // Helper function to process order data and ensure pricing information is available
//   const processOrderData = (order) => {
//     console.log("🔧 Processing order data:", order)
//     console.log("🔧 Order items:", order.items)

//     // Calculate totals if not present
//     let subtotal = 0
//     let total = 0

//     if (order.items && order.items.length > 0) {
//       // Calculate subtotal from items
//       subtotal = order.items.reduce((sum, item) => {
//         const itemPrice = Number.parseFloat(item.price || item.unit_price || item.product?.price || 0)
//         const itemQuantity = Number.parseInt(item.quantity || 1)
//         const itemTotal = itemPrice * itemQuantity
//         console.log(
//           `📦 Item: ${item.product_name || item.name}, Price: ${itemPrice}, Qty: ${itemQuantity}, Total: ${itemTotal}`,
//         )
//         return sum + itemTotal
//       }, 0)

//       console.log("💰 Calculated subtotal:", subtotal)

//       // Calculate total with tax and delivery fee
//       const tax = subtotal * 0.15 // 15% tax
//       const deliveryFee = Number.parseFloat(order.delivery_fee || order.totals?.deliveryFee || 0)
//       const discount = Number.parseFloat(order.discount_amount || order.totals?.discount || 0)
//       total = subtotal + tax + deliveryFee - discount

//       console.log("💰 Tax:", tax, "Delivery Fee:", deliveryFee, "Discount:", discount, "Total:", total)
//     }

//     // Ensure items have proper pricing information
//     const processedItems =
//       order.items?.map((item, index) => {
//         const processedItem = {
//           ...item,
//           price: Number.parseFloat(item.price || item.unit_price || item.product?.price || 0),
//           quantity: Number.parseInt(item.quantity || 1),
//           product_name:
//             item.product_name || item.name || item.product?.name || `${isArabic ? "منتج" : "Product"} ${index + 1}`,
//           notes: item.notes || "",
//         }
//         console.log(`📦 Processed item ${index + 1}:`, processedItem)
//         return processedItem
//       }) || []

//     // Create processed order with all necessary pricing information
//     const processedOrder = {
//       ...order,
//       items: processedItems,
//       subtotal: order.subtotal || order.totals?.subtotal || subtotal,
//       total_amount: order.total_amount || order.totals?.total || total,
//       delivery_fee: order.delivery_fee || order.totals?.deliveryFee || 0,
//       discount_amount: order.discount_amount || order.totals?.discount || 0,
//       totals: {
//         subtotal: order.subtotal || order.totals?.subtotal || subtotal,
//         total: order.total_amount || order.totals?.total || total,
//         deliveryFee: order.delivery_fee || order.totals?.deliveryFee || 0,
//         discount: order.discount_amount || order.totals?.discount || 0,
//         tax: (order.subtotal || order.totals?.subtotal || subtotal) * 0.15,
//       },
//     }

//     console.log("✅ Processed order data:", processedOrder)
//     console.log("✅ Final totals:", {
//       subtotal: processedOrder.subtotal,
//       total: processedOrder.total_amount,
//       deliveryFee: processedOrder.delivery_fee,
//       discount: processedOrder.discount_amount,
//     })
//     return processedOrder
//   }

//   const handleCancelOrder = async (orderId) => {
//     try {
//       console.log("❌ Cancelling order ID:", orderId)

//       const response = await cancelOrder(orderId, "Cancelled by user")
//       console.log("✅ Order cancellation response:", response.data)

//       toast.success(isArabic ? "تم إلغاء الطلب بنجاح" : "Order cancelled successfully")

//       // Refresh orders list
//       await fetchUserOrders()

//       // Close modal if open
//       setSelectedOrder(null)
//     } catch (error) {
//       console.error("❌ Error cancelling order:", error)
//       toast.error(error.message || (isArabic ? "فشل في إلغاء الطلب" : "Failed to cancel order"))
//     }
//   }

//   const getOrderStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return <Clock className="text-yellow-500" size={20} />
//       case "confirmed":
//         return <CheckCircle className="text-blue-500" size={20} />
//       case "preparing":
//         return <Package className="text-orange-500" size={20} />
//       case "out_for_delivery":
//         return <Truck className="text-purple-500" size={20} />
//       case "completed":
//         return <CheckCircle className="text-green-500" size={20} />
//       case "cancelled":
//         return <XCircle className="text-red-500" size={20} />
//       default:
//         return <Clock className="text-white" size={20} />
//     }
//   }

//   const getOrderStatusText = (status) => {
//     if (!isArabic) {
//       switch (status?.toLowerCase()) {
//         case "pending":
//           return "Pending"
//         case "confirmed":
//           return "Confirmed"
//         case "preparing":
//           return "Preparing"
//         case "out_for_delivery":
//           return "Out for Delivery"
//         case "completed":
//           return "Completed"
//         case "cancelled":
//           return "Cancelled"
//         default:
//           return "Unknown"
//       }
//     } else {
//       switch (status?.toLowerCase()) {
//         case "pending":
//           return "في الانتظار"
//         case "confirmed":
//           return "مؤكد"
//         case "preparing":
//           return "قيد التحضير"
//         case "out_for_delivery":
//           return "في الطريق"
//         case "completed":
//           return "مكتمل"
//         case "cancelled":
//           return "ملغي"
//         default:
//           return "غير معروف"
//       }
//     }
//   }

//   // Load orders when orders tab is active
//   useEffect(() => {
//     if (activeTab === "orders" && isolatedUser && orders.length === 0) {
//       fetchUserOrders()

//       // Add sample order data for testing if no orders exist
//       if (isolatedUser && orders.length === 0) {
//         const sampleOrder = {
//           id: "13232",
//           orderNumber: "13232",
//           status: "pending",
//           order_type: "takeaway",
//           payment_method: "cash_on_delivery",
//           created_at: new Date().toISOString(),
//           items: [
//             {
//               product_name: "Espresso",
//               price: 15.5,
//               quantity: 2,
//               notes: "Extra hot",
//             },
//             {
//               product_name: "Cappuccino",
//               price: 18.0,
//               quantity: 1,
//               notes: "No sugar",
//             },
//           ],
//           subtotal: 49.0,
//           delivery_fee: 0,
//           discount_amount: 0,
//           total_amount: 56.35, // Including 15% tax
//           customer_notes: "Please make it extra hot",
//           totals: {
//             subtotal: 49.0,
//             total: 56.35,
//             deliveryFee: 0,
//             discount: 0,
//             tax: 7.35,
//           },
//         }

//         // Create a second sample order for testing
//         const sampleOrder2 = {
//           id: "13231",
//           orderNumber: "13231",
//           status: "completed",
//           order_type: "delivery",
//           payment_method: "cash_on_delivery",
//           created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
//           items: [
//             {
//               product_name: "Latte",
//               price: 20.0,
//               quantity: 1,
//               notes: "Extra milk",
//             },
//             {
//               product_name: "Americano",
//               price: 12.5,
//               quantity: 2,
//               notes: "No cream",
//             },
//           ],
//           subtotal: 45.0,
//           delivery_fee: 5.0,
//           discount_amount: 2.0,
//           total_amount: 54.75, // Including 15% tax
//           customer_notes: "Please deliver to the main entrance",
//           totals: {
//             subtotal: 45.0,
//             total: 54.75,
//             deliveryFee: 5.0,
//             discount: 2.0,
//             tax: 6.75,
//           },
//         }

//         // Save sample orders locally for testing
//         try {
//           const userId = isolatedUser.id || isolatedUser.email
//           saveOrderLocally(sampleOrder, userId)
//           saveOrderLocally(sampleOrder2, userId)
//           console.log("📝 Sample orders saved for testing")
//         } catch (error) {
//           console.error("Error saving sample orders:", error)
//         }
//       }
//     }
//   }, [activeTab, isolatedUser])

//   // Handle Escape key to close order details modal
//   useEffect(() => {
//     const handleEscapeKey = (event) => {
//       if (event.key === "Escape" && selectedOrder) {
//         setSelectedOrder(null)
//       }
//     }
//     if (selectedOrder) {
//       document.addEventListener("keydown", handleEscapeKey)
//     }
//     return () => {
//       document.removeEventListener("keydown", handleEscapeKey)
//     }
//   }, [selectedOrder])

//   // Debug selectedOrder changes
//   useEffect(() => {
//     console.log("🔍 selectedOrder state changed:", selectedOrder)
//   }, [selectedOrder])

//   // Reset loading state when modal is closed
//   useEffect(() => {
//     if (!selectedOrder) {
//       setOrderDetailsLoading(false)
//     }
//   }, [selectedOrder])

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         // In a real app, you'd upload to a server
//         // For now, we'll just show a placeholder
//         toast.info(isArabic ? "ميزة رفع الصور قريباً!" : "Image upload feature coming soon!")
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   if (!isInitialized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <h2 className="text-2xl font-bold text-white mb-4">
//             {isArabic ? "جاري تحميل الملف الشخصي..." : "Loading Profile..."}
//           </h2>
//         </div>
//       </div>
//     )
//   }

//   if (!isolatedUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-white mb-4">
//             {isArabic ? "يرجى تسجيل الدخول لعرض ملفك الشخصي" : "Please log in to view your profile"}
//           </h2>
//           <button
//             onClick={handleRefreshProfile}
//             className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//           >
//             {isArabic ? "إعادة تحميل البيانات" : "Reload Data"}
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div
//       className="min-h-screen py-8 bg-cover bg-center bg-no-repeat relative"
//       dir={isArabic ? "rtl" : "ltr"}
//       style={{
//         backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=coffee shop background)",
//       }}
//     >
//       {/* Background overlay for better readability */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Debug Info - يمكن إزالتها في الإنتاج */}
//         <div className="mb-4 p-4 bg-black bg-opacity-70 rounded-lg text-white text-sm">
//           <div className="flex justify-between items-center mb-2">
//             <p>
//               <strong>Debug Info:</strong>
//             </p>
//             <button
//               onClick={handleRefreshProfile}
//               className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700"
//             >
//               {isArabic ? "تحديث" : "Refresh"}
//             </button>
//           </div>
//           <p>
//             Context User: {user?.name || "None"} ({user?.email || "No email"})
//           </p>
//           <p>
//             Isolated User: {isolatedUser?.name || "None"} ({isolatedUser?.email || "No email"})
//           </p>
//           <p>Update Locked: {isUpdateLocked() ? "Yes" : "No"}</p>
//           <p>Update in Progress: {updateInProgressRef.current ? "Yes" : "No"}</p>
//           <p>Initialized: {isInitialized ? "Yes" : "No"}</p>
//         </div>

//         {/* Profile Header */}
//         <div
//           className="rounded-xl shadow-xl overflow-hidden mb-8 border-2 border-amber-600 bg-cover bg-center relative"
//           style={{ backgroundImage: "url(/placeholder.svg?height=400&width=800&query=coffee beans pattern)" }}
//         >
//           {/* Component overlay */}
//           <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           <div className="relative z-10">
//             <div className="bg-gradient-to-r from-amber-600 to-amber-800 h-32 sm:h-40"></div>
//             <div className="relative px-6 pb-6">
//               {/* Profile Image */}
//               <div className="flex items-end -mt-16 mb-4">
//                 <div className="relative">
//                   <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
//                     {isolatedUser?.profile_image ? (
//                       <img
//                         src={isolatedUser.profile_image || "/placeholder.svg"}
//                         alt={isolatedUser.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <User size={40} className="text-gray-600" />
//                     )}
//                   </div>
//                   <label className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-2 cursor-pointer hover:bg-amber-700 transition-colors">
//                     <Camera size={16} className="text-white" />
//                     <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                   </label>
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <h1 className="text-2xl sm:text-3xl font-bold text-white">
//                     {isolatedUser?.name || (isArabic ? "مستخدم" : "User")}
//                   </h1>
//                   <p className="text-white">{isolatedUser?.email}</p>
//                   {isolatedUser?.mobile && <p className="text-white/80 text-sm">{isolatedUser.mobile}</p>}
//                 </div>
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className={`${isArabic ? "mr-4" : "ml-4"} flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors`}
//                 >
//                   {isEditing ? <X size={16} /> : <Edit size={16} />}
//                   {isEditing ? (isArabic ? "إلغاء" : "Cancel") : isArabic ? "تعديل" : "Edit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div
//           className="rounded-xl shadow-xl overflow-hidden border-2 border-amber-600 bg-cover bg-center relative"
//           style={{ backgroundImage: "url(/placeholder.svg?height=600&width=800&query=coffee shop interior)" }}
//         >
//           {/* Component overlay */}
//           <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           <div className="relative z-10">
//             <div className="border-b border-gray-200">
//               <nav className="flex">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`flex-1 py-4 px-6 text-center font-medium ${
//                     activeTab === "profile"
//                       ? "border-b-2 border-amber-600 text-amber-400"
//                       : "text-white hover:text-amber-400"
//                   }`}
//                 >
//                   {isArabic ? "معلومات الملف الشخصي" : "Profile Info"}
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("password")}
//                   className={`flex-1 py-4 px-6 text-center font-medium ${
//                     activeTab === "password"
//                       ? "border-b-2 border-amber-600 text-amber-400"
//                       : "text-white hover:text-amber-400"
//                   }`}
//                 >
//                   {isArabic ? "تغيير كلمة المرور" : "Change Password"}
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`flex-1 py-4 px-6 text-center font-medium ${
//                     activeTab === "orders"
//                       ? "border-b-2 border-amber-600 text-amber-400"
//                       : "text-white hover:text-amber-400"
//                   }`}
//                 >
//                   {isArabic ? "طلباتي" : "My Orders"}
//                 </button>
//               </nav>
//             </div>
//             <div className="p-6">
//               {activeTab === "profile" && (
//                 <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
//                   <div className="grid md:grid-cols-2 gap-6">
//                     {/* Name Field */}
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2">
//                         {isArabic ? "الاسم الكامل" : "Full Name"}
//                       </label>
//                       <div className="relative">
//                         <User
//                           className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400`}
//                           size={20}
//                         />
//                         <input
//                           {...registerProfile("name")}
//                           type="text"
//                           disabled={!isEditing}
//                           className={`w-full ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm ${
//                             !isEditing ? "opacity-75" : ""
//                           }`}
//                           placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
//                         />
//                       </div>
//                       {profileErrors.name && <p className="text-red-400 text-sm mt-1">{profileErrors.name.message}</p>}
//                     </div>

//                     {/* Email Field */}
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2">
//                         {isArabic ? "عنوان البريد الإلكتروني" : "Email Address"}
//                       </label>
//                       <div className="relative">
//                         <Mail
//                           className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400`}
//                           size={20}
//                         />
//                         <input
//                           {...registerProfile("email")}
//                           type="email"
//                           disabled={!isEditing}
//                           className={`w-full ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm ${
//                             !isEditing ? "opacity-75" : ""
//                           }`}
//                           placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
//                         />
//                       </div>
//                       {profileErrors.email && (
//                         <p className="text-red-400 text-sm mt-1">{profileErrors.email.message}</p>
//                       )}
//                     </div>

//                     {/* Mobile Field */}
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2">
//                         {isArabic ? "رقم الهاتف المحمول" : "Mobile Number"}
//                       </label>
//                       <div className="relative">
//                         <Phone
//                           className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400`}
//                           size={20}
//                         />
//                         <input
//                           {...registerProfile("mobile")}
//                           type="tel"
//                           disabled={!isEditing}
//                           className={`w-full ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm ${
//                             !isEditing ? "opacity-75" : ""
//                           }`}
//                           placeholder={isArabic ? "أدخل رقم هاتفك المحمول" : "Enter your mobile number"}
//                         />
//                       </div>
//                       {profileErrors.mobile && (
//                         <p className="text-red-400 text-sm mt-1">{profileErrors.mobile.message}</p>
//                       )}
//                     </div>

//                     {/* Profile Image URL Field */}
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2">
//                         {isArabic ? "رابط صورة الملف الشخصي" : "Profile Image URL"}
//                       </label>
//                       <input
//                         {...registerProfile("profile_image")}
//                         type="url"
//                         disabled={!isEditing}
//                         className={`w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm ${
//                           !isEditing ? "opacity-75" : ""
//                         }`}
//                         placeholder={isArabic ? "أدخل رابط الصورة" : "Enter image URL"}
//                       />
//                       {profileErrors.profile_image && (
//                         <p className="text-red-400 text-sm mt-1">{profileErrors.profile_image.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   {isEditing && (
//                     <div className={`flex ${isArabic ? "justify-start space-x-reverse" : "justify-end"} space-x-4`}>
//                       <button
//                         type="button"
//                         onClick={handleCancelEdit}
//                         className="px-6 py-3 border border-amber-600 rounded-lg text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
//                       >
//                         {isArabic ? "إلغاء" : "Cancel"}
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading || updateInProgressRef.current}
//                         className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
//                       >
//                         <Save size={16} />
//                         {loading
//                           ? isArabic
//                             ? "جاري الحفظ..."
//                             : "Saving..."
//                           : isArabic
//                             ? "حفظ التغييرات"
//                             : "Save Changes"}
//                       </button>
//                     </div>
//                   )}
//                 </form>
//               )}

//               {activeTab === "password" && (
//                 <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="max-w-md space-y-6">
//                   {/* Current Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">
//                       {isArabic ? "كلمة المرور الحالية" : "Current Password"}
//                     </label>
//                     <input
//                       {...registerPassword("current_password")}
//                       type="password"
//                       className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm"
//                       placeholder={isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password"}
//                     />
//                     {passwordErrors.current_password && (
//                       <p className="text-red-400 text-sm mt-1">{passwordErrors.current_password.message}</p>
//                     )}
//                   </div>

//                   {/* New Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">
//                       {isArabic ? "كلمة المرور الجديدة" : "New Password"}
//                     </label>
//                     <input
//                       {...registerPassword("password")}
//                       type="password"
//                       className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm"
//                       placeholder={isArabic ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
//                     />
//                     {passwordErrors.password && (
//                       <p className="text-red-400 text-sm mt-1">{passwordErrors.password.message}</p>
//                     )}
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">
//                       {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
//                     </label>
//                     <input
//                       {...registerPassword("password_confirmation")}
//                       type="password"
//                       className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-white bg-black bg-opacity-30 backdrop-blur-sm"
//                       placeholder={isArabic ? "أكد كلمة المرور الجديدة" : "Confirm new password"}
//                     />
//                     {passwordErrors.password_confirmation && (
//                       <p className="text-red-400 text-sm mt-1">{passwordErrors.password_confirmation.message}</p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
//                   >
//                     {loading
//                       ? isArabic
//                         ? "جاري تغيير كلمة المرور..."
//                         : "Changing Password..."
//                       : isArabic
//                         ? "تغيير كلمة المرور"
//                         : "Change Password"}
//                   </button>
//                 </form>
//               )}

//               {activeTab === "orders" && (
//                 <div className="space-y-8">
//                   {/* Enhanced Orders Header */}
//                   <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-4">
//                       <Package className="text-white" size={32} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-2">{isArabic ? "طلباتي" : "My Orders"}</h3>
//                     <p className="text-white/80 text-sm">
//                       {isArabic ? "تتبع جميع طلباتك السابقة والحالية" : "Track all your previous and current orders"}
//                     </p>
//                   </div>

//                   {/* Enhanced Refresh Button */}
//                   <div className="flex justify-center mb-6">
//                     <button
//                       onClick={fetchUserOrders}
//                       disabled={ordersLoading}
//                       className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full hover:from-amber-700 hover:to-amber-900 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
//                     >
//                       {ordersLoading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           {isArabic ? "جاري التحديث..." : "Refreshing..."}
//                         </>
//                       ) : (
//                         <>
//                           <Package size={18} />
//                           {isArabic ? "تحديث الطلبات" : "Refresh Orders"}
//                         </>
//                       )}
//                     </button>
//                   </div>

//                   {/* Enhanced Orders List */}
//                   {ordersLoading ? (
//                     <div className="flex items-center justify-center py-16">
//                       <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-6 animate-pulse">
//                           <Package className="text-white" size={40} />
//                         </div>
//                         <h4 className="text-xl font-semibold text-white mb-2">
//                           {isArabic ? "جاري تحميل الطلبات..." : "Loading Orders..."}
//                         </h4>
//                         <p className="text-white/70">{isArabic ? "يرجى الانتظار قليلاً" : "Please wait a moment"}</p>
//                       </div>
//                     </div>
//                   ) : orders.length === 0 ? (
//                     <div className="flex items-center justify-center py-16">
//                       <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6">
//                           <Package className="text-white" size={48} />
//                         </div>
//                         <h4 className="text-xl font-semibold text-white mb-2">
//                           {isArabic ? "لا توجد طلبات حتى الآن" : "No Orders Yet"}
//                         </h4>
//                         <p className="text-white/70 mb-6">
//                           {isArabic
//                             ? "ابدأ بالتسوق وستظهر طلباتك هنا"
//                             : "Start shopping and your orders will appear here"}
//                         </p>
//                         <button
//                           onClick={() => (window.location.href = "/shop")}
//                           className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full hover:from-amber-700 hover:to-amber-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//                         >
//                           {isArabic ? "تسوق الآن" : "Shop Now"}
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {orders.map((order) => {
//                         console.log("📋 Rendering order:", order)
//                         return (
//                           <div
//                             key={order.id}
//                             className="group relative overflow-hidden rounded-2xl border-2 border-amber-600/30 hover:border-amber-600 transition-all duration-500 bg-cover bg-center shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
//                             style={{
//                               backgroundImage: "url(/placeholder.svg?height=200&width=400&query=coffee cup pattern)",
//                             }}
//                           >
//                             {/* Background overlay */}
//                             <div className="absolute inset-0 bg-black bg-opacity-60"></div>

//                             <div className="relative z-10 p-6">
//                               {/* Order Header */}
//                               <div className="flex items-start justify-between mb-4">
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-3 mb-2">
//                                     <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
//                                       {getOrderStatusIcon(order.status)}
//                                     </div>
//                                     <div>
//                                       <h4 className="text-lg font-bold text-white">
//                                         {isArabic
//                                           ? `طلب رقم #${order.id || order.orderNumber}`
//                                           : `Order #${order.id || order.orderNumber}`}
//                                       </h4>
//                                       <p className="text-white/80 text-sm">
//                                         {order.created_at
//                                           ? new Date(order.created_at).toLocaleDateString(
//                                               isArabic ? "ar-SA" : "en-US",
//                                               {
//                                                 year: "numeric",
//                                                 month: "long",
//                                                 day: "numeric",
//                                                 hour: "2-digit",
//                                                 minute: "2-digit",
//                                               },
//                                             )
//                                           : ""}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Total Amount */}
//                                 <div className="text-right">
//                                   <div className="bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 rounded-full">
//                                     <p className="text-white font-bold text-lg">
//                                       {order.total_amount
//                                         ? Number.parseFloat(order.total_amount).toFixed(2)
//                                         : order.totals?.total
//                                           ? Number.parseFloat(order.totals.total).toFixed(2)
//                                           : "0.00"}{" "}
//                                       EGP
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Order Details */}
//                               <div className="grid md:grid-cols-2 gap-4 mb-4">
//                                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
//                                   <p className="text-white/80 text-xs mb-1">{isArabic ? "نوع الطلب" : "Order Type"}</p>
//                                   <p className="text-white font-medium">
//                                     {isArabic
//                                       ? order.order_type === "delivery"
//                                         ? "🚚 توصيل"
//                                         : "🏪 استلام"
//                                       : order.order_type === "delivery"
//                                         ? "🚚 Delivery"
//                                         : "🏪 Takeaway"}
//                                   </p>
//                                 </div>

//                                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
//                                   <p className="text-white/80 text-xs mb-1">
//                                     {isArabic ? "عدد العناصر" : "Items Count"}
//                                   </p>
//                                   <p className="text-white font-medium">
//                                     {order.items ? order.items.length : 0} {isArabic ? "عنصر" : "items"}
//                                   </p>
//                                 </div>
//                               </div>

//                               {/* Action Button */}
//                               <div className="flex justify-center">
//                                 <button
//                                   onClick={() => {
//                                     console.log("🔍 View Details clicked for order:", order)
//                                     setOrderDetailsLoading(false) // Ensure loading is false when showing from current list
//                                     // First try to show directly from current orders list
//                                     const currentOrder = orders.find(
//                                       (o) =>
//                                         o.id === order.id ||
//                                         o.orderNumber === order.orderNumber ||
//                                         o.id?.toString() === order.id?.toString(),
//                                     )

//                                     if (currentOrder) {
//                                       console.log("✅ Showing order from current list:", currentOrder)
//                                       // Process order data to ensure pricing information is available
//                                       const processedOrder = processOrderData(currentOrder)
//                                       setSelectedOrder(processedOrder)
//                                       console.log("🎉 Modal should now be visible")
//                                     } else {
//                                       // Fallback to API call
//                                       console.log("🔄 Falling back to API call")
//                                       fetchOrderDetails(order.id || order.orderNumber)
//                                     }
//                                   }}
//                                   disabled={orderDetailsLoading}
//                                   className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full hover:from-amber-700 hover:to-amber-900 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110"
//                                 >
//                                   <Eye size={18} />
//                                   {isArabic ? "عرض التفاصيل" : "View Details"}
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   )}

//                   {/* Enhanced Order Details Modal */}
//                   {selectedOrder && (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//                       <div
//                         className="fixed inset-0 bg-black/60 backdrop-blur-sm"
//                         onClick={() => setSelectedOrder(null)}
//                       ></div>
//                       <div className="relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border-2 border-amber-600/30">
//                         <div className="p-8">
//                           {/* Enhanced Modal Header */}
//                           <div className="text-center mb-8">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-4">
//                               <Package className="text-white" size={32} />
//                             </div>
//                             <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                               {isArabic
//                                 ? `تفاصيل الطلب #${selectedOrder.id || selectedOrder.orderNumber}`
//                                 : `Order #${selectedOrder.id || selectedOrder.orderNumber} Details`}
//                             </h3>
//                             <div className="flex items-center justify-center gap-2">
//                               {getOrderStatusIcon(selectedOrder.status)}
//                               <span className="text-gray-600 font-medium">
//                                 {getOrderStatusText(selectedOrder.status)}
//                               </span>
//                             </div>
//                             <p className="text-xs text-gray-500 mt-2">
//                               {isArabic
//                                 ? "اضغط ESC أو انقر خارج النافذة للإغلاق"
//                                 : "Press ESC or click outside to close"}
//                             </p>
//                           </div>

//                           {/* Enhanced Close Button */}
//                           <button
//                             onClick={() => setSelectedOrder(null)}
//                             className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 transition-all duration-300 p-2 hover:bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 border border-gray-200 hover:border-red-200"
//                             title={isArabic ? "إغلاق" : "Close"}
//                           >
//                             <X size={24} />
//                           </button>

//                           {orderDetailsLoading ? (
//                             <div className="flex items-center justify-center py-8">
//                               <div className="text-center">
//                                 <Package className="mx-auto text-gray-400 mb-4" size={48} />
//                                 <p className="text-gray-500">
//                                   {isArabic ? "جاري تحميل التفاصيل..." : "Loading details..."}
//                                 </p>
//                               </div>
//                             </div>
//                           ) : selectedOrder ? (
//                             <div className="space-y-6">
//                               {/* Order Info */}
//                               <div className="grid md:grid-cols-2 gap-4">
//                                 <div>
//                                   <h4 className="font-medium text-gray-900 mb-2">
//                                     {isArabic ? "معلومات الطلب" : "Order Information"}
//                                   </h4>
//                                   <div className="space-y-2 text-sm">
//                                     <p>
//                                       <span className="font-medium">{isArabic ? "الحالة:" : "Status:"}</span>{" "}
//                                       {getOrderStatusText(selectedOrder.status)}
//                                     </p>
//                                     <p>
//                                       <span className="font-medium">{isArabic ? "النوع:" : "Type:"}</span>{" "}
//                                       {selectedOrder.order_type === "delivery"
//                                         ? isArabic
//                                           ? "توصيل"
//                                           : "Delivery"
//                                         : isArabic
//                                           ? "استلام"
//                                           : "Takeaway"}
//                                     </p>
//                                     <p>
//                                       <span className="font-medium">{isArabic ? "طريقة الدفع:" : "Payment:"}</span>{" "}
//                                       {selectedOrder.payment_method || "N/A"}
//                                     </p>
//                                     <p>
//                                       <span className="font-medium">{isArabic ? "التاريخ:" : "Date:"}</span>{" "}
//                                       {selectedOrder.created_at
//                                         ? new Date(selectedOrder.created_at).toLocaleDateString(
//                                             isArabic ? "ar-SA" : "en-US",
//                                           )
//                                         : selectedOrder.orderDate
//                                           ? new Date(selectedOrder.orderDate).toLocaleDateString(
//                                               isArabic ? "ar-SA" : "en-US",
//                                             )
//                                           : "N/A"}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-medium text-gray-900 mb-2">{isArabic ? "الإجمالي" : "Total"}</h4>

//                                   <div className="space-y-2 text-sm">
//                                     <p>
//                                       <span className="font-medium">{isArabic ? "المبلغ الفرعي:" : "Subtotal:"}</span>{" "}
//                                       {selectedOrder.subtotal || selectedOrder.totals?.subtotal || "0.00"} EGP
//                                     </p>
//                                     <p>
//                                       <span className="font-medium">
//                                         {isArabic ? "رسوم التوصيل:" : "Delivery Fee:"}
//                                       </span>{" "}
//                                       {selectedOrder.delivery_fee || selectedOrder.totals?.deliveryFee || "0.00"} EGP
//                                     </p>
//                                     <p>
//                                       <span className="font-medium">{isArabic ? "الخصم:" : "Discount:"}</span>{" "}
//                                       {selectedOrder.discount_amount || selectedOrder.totals?.discount || "0.00"} EGP
//                                     </p>
//                                     <p className="font-bold text-lg">
//                                       <span className="font-medium">{isArabic ? "الإجمالي:" : "Total:"}</span>{" "}
//                                       {selectedOrder.total_amount || selectedOrder.totals?.total || "0.00"} EGP
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Order Items */}
//                               {selectedOrder.items && selectedOrder.items.length > 0 ? (
//                                 <div>
//                                   <h4 className="font-medium text-gray-900 mb-3">
//                                     {isArabic ? "عناصر الطلب" : "Order Items"}
//                                   </h4>
//                                   <div className="space-y-3">
//                                     {selectedOrder.items.map((item, index) => (
//                                       <div
//                                         key={index}
//                                         className="flex items-center justify-between bg-amber-50 border border-amber-600 p-3 rounded-lg"
//                                       >
//                                         <div>
//                                           <p className="font-medium">
//                                             {item.product_name ||
//                                               item.name ||
//                                               `${isArabic ? "منتج" : "Product"} ${index + 1}`}
//                                           </p>
//                                           {item.notes && (
//                                             <p className="text-sm text-gray-500">
//                                               {isArabic ? "ملاحظات:" : "Notes:"} {item.notes}
//                                             </p>
//                                           )}
//                                         </div>

//                                         <div className="text-right">
//                                           <p className="font-medium">
//                                             {item.price || "0.00"} EGP × {item.quantity || 1}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             {((item.price || 0) * (item.quantity || 1)).toFixed(2)} EGP
//                                           </p>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div>
//                                   <h4 className="font-medium text-gray-900 mb-3">
//                                     {isArabic ? "عناصر الطلب" : "Order Items"}
//                                   </h4>
//                                   <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
//                                     <p className="text-gray-500">
//                                       {isArabic ? "لا توجد تفاصيل العناصر متاحة" : "No item details available"}
//                                     </p>
//                                   </div>
//                                 </div>
//                               )}

//                               {/* Notes */}
//                               {selectedOrder.customer_notes && (
//                                 <div>
//                                   <h4 className="font-medium text-gray-900 mb-2">
//                                     {isArabic ? "ملاحظات العميل" : "Customer Notes"}
//                                   </h4>
//                                   <p className="text-sm text-gray-600 bg-amber-50 border border-amber-600 p-3 rounded-lg">
//                                     {selectedOrder.customer_notes}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Cancel Order Button - Only show for pending/confirmed orders */}
//                               {selectedOrder.status &&
//                                 ["pending", "confirmed"].includes(selectedOrder.status.toLowerCase()) && (
//                                   <div className="pt-6 border-t border-gray-200">
//                                     <button
//                                       onClick={() => handleCancelOrder(selectedOrder.id || selectedOrder.orderNumber)}
//                                       className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
//                                     >
//                                       {isArabic ? "إلغاء الطلب" : "Cancel Order"}
//                                     </button>
//                                   </div>
//                                 )}
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center py-8">
//                               <div className="text-center">
//                                 <Package className="mx-auto text-gray-400 mb-4" size={48} />
//                                 <p className="text-gray-500">
//                                   {isArabic ? "لا توجد تفاصيل متاحة للطلب" : "No order details available"}
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Logout Section */}
//         <div
//           className="rounded-xl shadow-xl p-6 mt-8 border-2 border-amber-600 bg-cover bg-center relative"
//           style={{ backgroundImage: "url(/placeholder.svg?height=200&width=800&query=coffee shop counter)" }}
//         >
//           {/* Component overlay */}
//           <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
//           <div className="relative z-10">
//             <h3 className="text-lg font-semibold text-white mb-4">{isArabic ? "إجراءات الحساب" : "Account Actions"}</h3>
//             <button
//               onClick={() => {
//                 logout()
//                 toast.info(isArabic ? "تم تسجيل الخروج" : "You have been logged out")
//               }}
//               className="px-6 py-3 border border-red-300 text-red-400 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors"
//             >
//               {isArabic ? "تسجيل الخروج" : "Logout"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile
