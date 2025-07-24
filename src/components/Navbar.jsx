import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaShoppingCart, FaLanguage, FaUser, FaChevronDown } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useCart, useRTL } from '../App'
import { useAuth } from '../contexts/AuthContext' 
import { useEffect, useRef } from 'react';

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const location = useLocation()
  const { cartItemsCount } = useCart()
  const { isArabic, toggleLanguage } = useRTL()
  const { isAuthenticated, logout, user } = useAuth() 
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const isActive = (path) => location.pathname === path


  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsShopOpen(false);
    }
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
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
        { path: '/contact', label: 'اتصل بنا' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/menu', label: 'Menu' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
      ]

  const handleLogout = async () => {
    try {
      await logout()
      toast.success(isArabic ? "تم تسجيل الخروج بنجاح" : "Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      })
      navigate('/')
    } catch (error) {
      toast.error(isArabic ? "خطأ في تسجيل الخروج" : "Error logging out", {
        position: "top-right",
        autoClose: 3000,
      })
    }
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

            {/* User Profile / Login */}
            <div className="flex items-center gap-2 ml-4" ref={userDropdownRef}>
              {isAuthenticated ? (
                <div className="relative">
                  {/* User Profile Button */}
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400">
                      {user?.profile_image ? (
                        <img 
                          src={user.profile_image} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-500 flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                    
                    {/* User Name */}
                    <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    
                    {/* Dropdown Arrow */}
                    <FaChevronDown className={`text-xs transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2">
                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        
                        {/* Profile Link */}
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <FaUser className="text-gray-400" />
                          {isArabic ? "الملف الشخصي" : "Profile"}
                        </Link>
                        
                        {/* Logout */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {isArabic ? "تسجيل الخروج" : "Logout"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 text-white hover:text-amber-400 transition-colors font-medium rounded-lg hover:bg-white/10"
                >
                  <FaUser />
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
              {/* User Info (Mobile) */}
              {isAuthenticated && (
                <div className="border-b border-gray-600 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400">
                      {user?.profile_image ? (
                        <img 
                          src={user.profile_image} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-500 flex items-center justify-center">
                          <FaUser className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name || 'User'}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2 mt-3 text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <FaUser className="text-sm" />
                    {isArabic ? "الملف الشخصي" : "View Profile"}
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
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

              {/* Auth Actions (Mobile) */}
              <div className="border-t border-gray-600 pt-4 mt-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-right w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {isArabic ? "تسجيل الخروج" : "Logout"}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-right"
                  >
                    <FaUser />
                    {isArabic ? "تسجيل الدخول" : "Login"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
