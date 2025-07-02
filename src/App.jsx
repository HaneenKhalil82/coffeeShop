import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Services from './pages/Services'
import Blog from './pages/Blog'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductSingle from './pages/ProductSingle'
import './App.css'

// RTL Context
const RTLContext = createContext()

export const useRTL = () => {
  const context = useContext(RTLContext)
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider')
  }
  return context
}

// Cart Context
const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

function App() {
  const [isRTL, setIsRTL] = useState(true) // Default to Arabic RTL
  const [isArabic, setIsArabic] = useState(true) // Default to Arabic
  const [cartItems, setCartItems] = useState([])

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

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <RTLContext.Provider value={{ isRTL, isArabic, toggleLanguage }}>
      <CartContext.Provider value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartTotal,
        cartItemsCount
      }}>
        <Router>
          <div className={`App arabic-text ${isRTL ? 'rtl' : 'ltr'}`}>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductSingle />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartContext.Provider>
    </RTLContext.Provider>
  )
}

export default App
