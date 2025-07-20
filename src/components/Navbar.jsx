import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaShoppingCart, FaLanguage } from 'react-icons/fa'
import { useCart, useRTL } from '../App'
import { useAuth } from '../contexts/AuthContext' 
import { useEffect, useRef } from 'react';

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { cartItemsCount } = useCart()
  const { isArabic, toggleLanguage } = useRTL()
  const { isAuthenticated, logout } = useAuth() 
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const isActive = (path) => location.pathname === path


  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsShopOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
  }, []);




  const navLinks = isArabic
    ? [
        { path: '/', label: 'الرئيسية' },
        { path: '/menu', label: 'المنتجات' },
        { path: '/about', label: 'من نحن' },
        { path: '/shop', label: ' المتجر' },
        { path: '/contact', label: 'اتصل بنا' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/menu', label: 'Menu' },
        { path: '/about', label: 'About' },
        { path: '/shop', label: 'Shop' },
        { path: '/contact', label: 'Contact' },
      ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed w-full  z-[9999] bg-[#120f0f] backdrop-blur-md shadow-lg transition-all duration-300">
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
              {/* {navLinks.map((link) => (
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
              ) */}


{navLinks.map((link) => {
  const isShopLabel = (isArabic && link.label === ' المتجر') || (!isArabic && link.label === 'Shop')

  if (isShopLabel) {
    return (
      <div
        key={link.path}
        className="relative"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsShopOpen((prev) => !prev)}
          className={`flex items-center relative px-3 py-2 text-lg font-medium transition-colors duration-300 ${
            isActive(link.path) ? 'text-primary' : 'text-white/90 hover:text-primary'
          }`}
        >
          {isArabic ? (
            <>
              {link.label}
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {link.label}
            </>
          )}
        </button>

        {isShopOpen && (
          <div className={`absolute top-full ${isArabic ? 'right-0 text-left' : 'left-0 text-right'} mt-2 bg-[#120f0f] text-white shadow-lg rounded-lg py-2 w-48 transition-all duration-300 z-50`}>
            <Link to="/shop" className="block px-4 py-2 text-gray-400 hover:text-light">
              {isArabic ? 'المتجر' : 'Shop'}
            </Link>
           
            <Link to="/checkout" className="block px-4 py-2 text-gray-400 hover:text-light">
              {isArabic ? 'الدفع' : 'Checkout'}
            </Link>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <Link
        key={link.path}
        to={link.path}
        className={`relative px-3 py-2 text-lg font-medium transition-colors duration-300 ${
          isActive(link.path) ? 'text-primary' : 'text-white/90 hover:text-primary'
        }`}
      >
        {link.label}
        {isActive(link.path) && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left animate-pulse" />
        )}
      </Link>
    )
  }
})}


              {/* )} */}
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
              <span className="sr-only">{isArabic ? 'تبديل إلى الإنجليزية' : 'Switch to Arabic'}</span>
            </button>

            {/* Login/Logout */}
            <div className="flex items-center gap-2 ml-4">
              <svg
                stroke="currentColor"
                fill="white"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
              </svg>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-red-400 transition-colors font-medium"
                >
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </button>
              ) : (
                <Link to="/login" className="text-white hover:text-amber-400 transition-colors font-medium">
                  {isArabic ? "تسجيل الدخول" : "Login"}
                </Link>
              )}
            </div>

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
