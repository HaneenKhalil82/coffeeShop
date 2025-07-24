import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
// import HeroSlider from './components/HeroSlider'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuth } from "./contexts/AuthContext";

import Shop from './pages/Shop'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductSingle from './pages/ProductSingle'
import ApiDemo from './components/ApiDemo'
import Profile from './pages/Profile'

// Chat Components
import { ChatProvider } from './contexts/ChatContext'
import ChatButton from './components/ChatButton'
import ChatWindow from './components/ChatWindow'

import './App.css'

// RTL Context
const RTLContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useRTL = () => {
  const context = useContext(RTLContext)
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider')
  }
  return context
}


// Cart Context
const CartContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

function App() {
  const { isAuthenticated, user } = useAuth()
  const [isRTL, setIsRTL] = useState(true) // Default to Arabic RTL
  const [isArabic, setIsArabic] = useState(true) // Default to Arabic
  const [cartItems, setCartItems] = useState([])

  // Get user-specific cart key
  const getCartKey = () => {
    if (!isAuthenticated || !user) return null
    return `coffee-cart-${user.id || user.email || 'guest'}`
  }

  // Load user-specific cart from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const cartKey = getCartKey()
      if (cartKey) {
        const savedCart = localStorage.getItem(cartKey)
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            setCartItems(parsedCart)
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error)
            localStorage.removeItem(cartKey)
          }
        }
      }
    } else {
      // Clear cart if user is not authenticated
      setCartItems([])
    }
  }, [isAuthenticated, user])

  // Save cart to user-specific localStorage whenever cart changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const cartKey = getCartKey()
      if (cartKey) {
        if (cartItems.length > 0) {
          localStorage.setItem(cartKey, JSON.stringify(cartItems))
        } else {
          localStorage.removeItem(cartKey)
        }
      }
    }
  }, [cartItems, isAuthenticated, user])

  // Set RTL as default on app load
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl')
    document.documentElement.setAttribute('lang', 'ar')
  }, [])

  const toggleLanguage = () => {
    setIsRTL(!isRTL)
    setIsArabic(!isArabic)
    document.documentElement.setAttribute('dir', !isRTL ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', !isArabic ? 'ar' : 'en')
  }

  const addToCart = (product) => {
    if (!isAuthenticated) {
      toast.error(isArabic ? "يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة" : "Please login first to add items to cart", {
        position: "top-right",
        autoClose: 3000,
      })
      return { success: false, message: 'Not authenticated' }
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    
    return { success: true, message: 'Added to cart' }
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    const cartKey = getCartKey()
    if (cartKey) {
      localStorage.removeItem(cartKey)
    }
    // Also remove any legacy cart data
    localStorage.removeItem('coffee-cart')
  }

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <RTLContext.Provider value={{ isRTL, isArabic, toggleLanguage }}>
      <CartContext.Provider value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        cartItemsCount
      }}>
        <ChatProvider>
          <Router>
            <div className={`App arabic-text ${isRTL ? 'rtl' : 'ltr'}`}>
             
              <Navbar />
              

              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path= '/login' element= {<Login /> }/>
                  <Route path= "/SignUp" element={<SignUp /> }/>
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
        
          
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductSingle />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/api-demo" element={<ApiDemo />} />
                </Routes>
              </main>
              
              <Footer />
              
              {/* Chat Components - Only available for authenticated users */}
              {isAuthenticated && (
                <>
                  <ChatButton />
                  <ChatWindow />
                </>
              )}
              
              {/* Toast Container for global toast notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={isRTL}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </ChatProvider>
      </CartContext.Provider>
    </RTLContext.Provider>
  )
}

export default App
