import React from 'react'
import { Link } from 'react-router-dom'
import { useRTL } from '../App'

const ProductsSection = () => {
  const { isArabic } = useRTL()

  const content = isArabic ? {
    title: 'منتجاتنا المميزة',
    subtitle: 'اكتشفوا تشكيلتنا',
    viewAll: 'عرض جميع المنتجات',
    addToCart: 'أضف للسلة',
    products: [
      {
        id: 1,
        name: 'قهوة عربية فاخرة',
        price: ' 50',
        originalPrice: ' 60',
        image: '/images/arabic coffee.jpg',
        description: 'قهوة عربية أصيلة محمصة بعناية'
      },
      {
        id: 2,
        name: 'كابتشينو إيطالي',
        price: ' 75',
        originalPrice: null,
        image: '/images/italian.webp',
        description: 'كابتشينو كريمي بالطريقة الإيطالية الأصيلة'
      },
      {
        id: 3,
        name: 'لاتيه بالفانيليا',
        price: '60',
        originalPrice: ' 80',
        image: '/images/vanilla.webp',
        description: 'لاتيه طازج مع نكهة الفانيليا الطبيعية'
      },
      {
        id: 4,
        name: 'إسبريسو مركز',
        price: '50',
        originalPrice: null,
        image: '/images/double.jpg',
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
        price: '$12',
        originalPrice: '$16',
        image: '/images/drink-1.jpg',
        description: 'Authentic Arabic coffee carefully roasted'
      },
      {
        id: 2,
        name: 'Italian Cappuccino',
        price: '$7',
        originalPrice: null,
        image: '/images/drink-2.jpg',
        description: 'Creamy cappuccino in authentic Italian style'
      },
      {
        id: 3,
        name: 'Vanilla Latte',
        price: '$8',
        originalPrice: '$9',
        image: '/images/drink-3.jpg',
        description: 'Fresh latte with natural vanilla flavor'
      },
      {
        id: 4,
        name: 'Concentrated Espresso',
        price: '$5',
        originalPrice: null,
        image: '/images/drink-4.jpg',
        description: 'Strong and concentrated Italian espresso'
      }
    ]
  }

  return (
    <section className="section-padding bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/images/hhh.jpg)' }}>
      <div className="absolute inset-0 bg-gray-900/70"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {content.products.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group block"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-2 py-1 rounded text-sm font-semibold">
                    {isArabic ? 'خصم' : 'Sale'}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 arabic-heading-font text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 arabic-body">
                  {product.description}
                </p>
                
                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-2xl font-bold text-primary arabic-heading-font">
                      {product.price} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through arabic-heading-font">
                        {product.originalPrice} {isArabic ? 'ريال' : 'SAR'}
                      </span>
                    )}
                  </div>
                </div>

                {/* View Details Button */}
                <button className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded transition-colors duration-300 arabic-body">
                  {isArabic ? 'عرض التفاصيل' : 'View Details'}
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/shop" 
            className="inline-block bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded transition-all duration-300 arabic-body text-lg"
          >
            {content.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductsSection 