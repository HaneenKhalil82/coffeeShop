import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaShoppingCart, FaLanguage } from 'react-icons/fa'
import { useCart, useRTL } from '../App'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { cartItemsCount } = useCart()
  const { isArabic, toggleLanguage } = useRTL()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = isArabic ? [
    { path: '/', label: 'الرئيسية' },
    { path: '/menu', label: ' المنتجات' },
    { path: '/about', label: 'من نحن' },
    { path: '/contact', label: 'اتصل بنا' },
    
  ] : [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    
  ]

  return (
    <nav className="fixed w-full z-[9999] bg-black backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img 
                src="/images/01-removebg-preview.png" 
                alt={isArabic ? 'بلال - مذاق الين الطبيعي' : 'Blatl - Natural Fresh Taste Of Coffee'} 
                className="h-20 w-auto transition-opacity duration-300 hover:opacity-80 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8 space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 text-lg font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-white/90 hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left animate-pulse" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full transition-colors duration-300 text-white hover:bg-white/10"
              title={isArabic ? 'تبديل اللغة' : 'Toggle Language'}
            >
              <FaLanguage className="w-8 h-8" />
              <span className="sr-only">
                {isArabic ? 'تبديل إلى الإنجليزية' : 'Switch to Arabic'}
              </span>
            </button>

            {/* Cart */}

       <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2 ml-4">
                <svg stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                {/* <Link to="/login" className="text-white hover:text-amber-400 transition-colors font-medium"> تسجيل الدخول</Link> */}
                  
                  <Link to="/login" className="text-white hover:text-amber-400 transition-colors font-medium">
                  {isArabic ? "تسجيل الدخول" : "Login"}
                   </Link>
              
               </div>
               
            <Link
              to="/cart"
              className="relative p-2 rounded-full transition-colors duration-300 text-white hover:bg-white/10"
              title={isArabic ? 'السلة' : 'Shopping Cart'}
            >
              <FaShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md transition-colors duration-300 text-white hover:bg-white/10"
              aria-label={isArabic ? 'قائمة التنقل' : 'Navigation Menu'}
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-primary/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 text-xl font-medium transition-colors duration-300 text-right ${
                    isActive(link.path)
                      ? 'text-primary border-r-4 border-primary pr-4'
                      : 'text-white/90 hover:text-primary hover:pr-4'
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 