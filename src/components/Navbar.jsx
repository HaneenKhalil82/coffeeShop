import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaShoppingCart, FaLanguage } from 'react-icons/fa'
import { useCart, useRTL } from '../App'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showShopDropdown, setShowShopDropdown] = useState(false)
  const location = useLocation()
  const { cartItemsCount } = useCart()
  const { isArabic, toggleLanguage } = useRTL()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setShowShopDropdown(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = isArabic ? [
    { path: '/', label: 'الرئيسية' },
    { path: '/menu', label: 'قائمة الطعام' },
    { path: '/services', label: 'الخدمات' },
    { path: '/blog', label: 'المدونة' },
    { path: '/about', label: 'من نحن' },
    { path: '/contact', label: 'اتصل بنا' }
  ] : [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  const shopDropdownItems = isArabic ? [
    { path: '/shop', label: 'المتجر' },
    { path: '/product/1', label: 'صفحة المنتج' },
    { path: '/cart', label: 'السلة' },
    { path: '/checkout', label: 'الدفع' }
  ] : [
    { path: '/shop', label: 'Shop' },
    { path: '/product/1', label: 'Single Product' },
    { path: '/cart', label: 'Cart' },
    { path: '/checkout', label: 'Checkout' }
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black shadow-lg backdrop-blur-md'
        : 'bg-opacity-50'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className={`text-2xl font-bold transition-colors duration-300 arabic-heading-font ${
                isScrolled ? 'text-dark' : 'text-white'
              }`}>
                {isArabic ? 'مقهى' : 'Coffee'}
                <small className={`text-sm mr-2 ${
                  isScrolled ? 'text-primary' : 'text-white/80'
                }`}>
                  {isArabic ? 'المزيج' : 'Blend'}
                </small>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8 space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-primary ${
                    isActive(link.path)
                      ? isScrolled ? 'text-primary' : 'text-white'
                      : isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left animate-pulse" />
                  )}
                </Link>
              ))}
              
              {/* Shop Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowShopDropdown(true)}
                onMouseLeave={() => setShowShopDropdown(false)}
              >
                <button className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                }`}>
                  {isArabic ? 'المتجر' : 'Shop'}
                </button>
                {showShopDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                    {shopDropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 text-right"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-full transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              title={isArabic ? 'تبديل اللغة' : 'Toggle Language'}
            >
              <FaLanguage className="w-5 h-5" />
              <span className="sr-only">
                {isArabic ? 'تبديل إلى الإنجليزية' : 'Switch to Arabic'}
              </span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-2 rounded-full transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
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
              className={`lg:hidden p-2 rounded-md transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label={isArabic ? 'قائمة التنقل' : 'Navigation Menu'}
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 text-base font-medium transition-colors duration-300 text-right ${
                    isActive(link.path)
                      ? 'text-primary border-r-4 border-primary pr-4'
                      : 'text-gray-700 hover:text-primary hover:pr-4'
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Shop Menu */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-500 mb-2 text-right">
                  {isArabic ? 'المتجر' : 'Shop'}
                </p>
                {shopDropdownItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block py-2 pr-4 text-base text-gray-600 hover:text-primary transition-colors duration-300 text-right"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 