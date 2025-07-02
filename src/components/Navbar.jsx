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
    { path: '/contact', label: 'اتصل بنا' }
  ] : [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
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
    </nav>
  )
}

export default Navbar 