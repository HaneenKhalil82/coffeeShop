import React from 'react'
import { Link } from 'react-router-dom'
import { useRTL, useCart } from '../App'

const ProductsSection = () => {
  const { isArabic } = useRTL()
  const { addToCart } = useCart()

  const content = isArabic ? {
    title: 'منتجاتنا المميزة',
    subtitle: 'اكتشفوا تشكيلتنا',
    viewAll: 'عرض جميع المنتجات',
    addToCart: 'أضف للسلة',
    products: [
      {
        id: 1,
        name: 'قهوة عربية فاخرة',
        price: 50,
        originalPrice: 60,
        image: '/images/arabic coffee.jpg',
        description: 'قهوة عربية أصيلة محمصة بعناية'
      },
      {
        id: 2,
        name: 'كابتشينو إيطالي',
        price: 75,
        originalPrice: null,
        image: '/images/italian.webp',
        description: 'كابتشينو كريمي بالطريقة الإيطالية الأصيلة'
      },
      {
        id: 3,
        name: 'لاتيه بالفانيليا',
        price: 60,
        originalPrice: 80,
        image: '/images/double.jpg',
        description: 'لاتيه طازج مع نكهة الفانيليا الطبيعية'
      },
      {
        id: 4,
        name: 'إسبريسو مركز',
        price: 50,
        originalPrice: null,
        image: '/images/vanilla.webp',
        description: 'إسبريسو إيطالي قوي ومركز'
      }
    ]
  } : {
    title: 'Featured Products',
    subtitle: 'Discover Our Selection',
    viewAll: 'View All Products',
    addToCart: 'Add to Cart',
    products: [
      {
        id: 1,
        name: 'Premium Arabic Coffee',
        price: 12,
        originalPrice: 16,
        image: '/images/arabic coffee.jpg',
        description: 'Authentic Arabic coffee carefully roasted'
      },
      {
        id: 2,
        name: 'Italian Cappuccino',
        price: 7,
        originalPrice: null,
        image: '/images/italian.webp',
        description: 'Creamy cappuccino in authentic Italian style'
      },
      {
        id: 3,
        name: 'Vanilla Latte',
        price: 8,
        originalPrice: 9,
        image: '/images/double.jpg',
        description: 'Fresh latte with natural vanilla flavor'
      },
      {
        id: 4,
        name: 'Concentrated Espresso',
        price: 5,
        originalPrice: null,
        image: '/images/vanilla.webp',
        description: 'Strong and concentrated Italian espresso'
      }
    ]
  }

  const handleAddToCart = (item) => {
    addToCart(item)
    // Show success message
    const message = isArabic ? `تم إضافة ${item.name} إلى السلة!` : `${item.name} added to cart!`
    
    // Create a temporary toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
    toast.textContent = message
    toast.style.direction = isArabic ? 'rtl' : 'ltr'
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 3000)
  }

  return (
    <section className="section-padding bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
      <div className="absolute inset-0"></div>
      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-4xl arabic-heading-font">
            {content.title}
          </span>
          <h2 className="text-3xl font-bold text-white mt-2 arabic-heading-font">
            {content.subtitle}
          </h2>
        </div>

{/* Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
  {content.products.map((product) => (
    <div
      key={product.id}
      className="bg-black/20 backdrop-blur-sm border border-primary/30 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl"
    >
      {/* Clickable Card */}
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.originalPrice && (
            <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {isArabic ? 'خصم' : 'SALE'}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className=" text-center space-y-2">
          {/* Name */}
          <h3 className="text-2xl font-semibold text-white group-hover:text-primary transition-colors duration-300 arabic-heading-font uppercase">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-base leading-relaxed arabic-body min-h-[40px]">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex justify-center items-center gap-2 rtl:flex-row-reverse">
            <span className="text-3xl  text-primary">
              ${product.price}.00
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice}.00
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-6 pb-6">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddToCart(product)
          }}
          className="w-full bg-transparent border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
        >
          {content.addToCart}
        </button>
      </div>
    </div>
  ))}
</div>


        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/shop" 
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded transition-all duration-300 arabic-body text-lg font-medium uppercase tracking-wide backdrop-blur-sm"
          >
            {content.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductsSection 