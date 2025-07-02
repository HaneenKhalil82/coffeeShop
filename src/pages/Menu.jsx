import React, { useState } from 'react'
import { useRTL, useCart } from '../App'

const Menu = () => {
  const { isArabic } = useRTL()
  const { addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('coffee')

  const content = isArabic ? {
    
    categories: [
      { id: 'coffee', label: 'القهوة' },
      { id: 'drinks', label: 'المشروبات' },
      { id: 'desserts', label: 'الحلويات' },
      { id: 'breakfast', label: 'الإفطار' }
    ],
    menuItems: {
      coffee: [
        {
          id: 1,
          name: 'إسبريسو',
          price: 15,
          description: 'قهوة مركزة مع طعم غني وكريمة ذهبية',
          image: '/images/drink-1.jpg'
        },
        {
          id: 2,
          name: 'كابتشينو',
          price: 20,
          description: 'إسبريسو مع حليب مبخر ورغوة كثيفة',
          image: '/images/drink-2.jpg'
        },
        {
          id: 3,
          name: 'لاتيه',
          price: 22,
          description: 'قهوة ناعمة مع حليب مبخر وطبقة رغوة خفيفة',
          image: '/images/drink-3.jpg'
        },
        {
          id: 4,
          name: 'قهوة عربية',
          price: 18,
          description: 'قهوة عربية أصيلة بنكهة الهيل',
          image: '/images/drink-4.jpg'
        },
        {
          id: 5,
          name: 'أمريكانو',
          price: 16,
          description: 'إسبريسو مخفف بالماء الساخن',
          image: '/images/drink-5.jpg'
        },
        {
          id: 6,
          name: 'موكا',
          price: 25,
          description: 'قهوة مع الشوكولاتة والكريمة المخفوقة',
          image: '/images/drink-6.jpg'
        }
      ],
      drinks: [
        {
          id: 7,
          name: 'شاي أخضر',
          price: 12,
          description: 'شاي أخضر طبيعي منعش',
          image: '/images/drink-7.jpg'
        },
        {
          id: 8,
          name: 'عصير برتقال طازج',
          price: 18,
          description: 'عصير برتقال طبيعي 100%',
          image: '/images/drink-8.jpg'
        },
        {
          id: 9,
          name: 'ليموناضة',
          price: 15,
          description: 'مشروب الليمون المنعش',
          image: '/images/drink-9.jpg'
        }
      ],
      desserts: [
        {
          id: 10,
          name: 'تيراميسو',
          price: 35,
          description: 'حلوى إيطالية كلاسيكية بطعم القهوة',
          image: '/images/dessert-1.jpg'
        },
        {
          id: 11,
          name: 'تشيز كيك',
          price: 30,
          description: 'كعكة الجبن الكريمية بطعم الفانيليا',
          image: '/images/dessert-2.jpg'
        },
        {
          id: 12,
          name: 'براونيز',
          price: 28,
          description: 'كعكة الشوكولاتة الغنية والطرية',
          image: '/images/dessert-3.jpg'
        },
        {
          id: 13,
          name: 'كنافة',
          price: 32,
          description: 'حلوى شرقية تقليدية بالجبن والعسل',
          image: '/images/dessert-4.jpg'
        }
      ],
      breakfast: [
        {
          id: 14,
          name: 'فطار شامي',
          price: 45,
          description: 'فول، حمص، زيتون، جبن، وخبز طازج',
          image: '/images/dish-1.jpg'
        },
        {
          id: 15,
          name: 'عجة بالخضار',
          price: 38,
          description: 'بيض مخفوق مع خضار طازجة',
          image: '/images/dish-2.jpg'
        },
        {
          id: 16,
          name: 'فطائر',
          price: 25,
          description: 'فطائر محشوة بالجبن أو الزعتر',
          image: '/images/dish-3.jpg'
        }
      ]
    },
    addedToCart: 'تم إضافة المنتج إلى السلة!',
    addToCartButton: 'أضف إلى السلة'
  } : {
   
    categories: [
      { id: 'coffee', label: 'Coffee' },
      { id: 'drinks', label: 'Drinks' },
      { id: 'desserts', label: 'Desserts' },
      { id: 'breakfast', label: 'Breakfast' }
    ],
    menuItems: {
      coffee: [
        {
          id: 1,
          name: 'Espresso',
          price: 15,
          description: 'Rich concentrated coffee with golden crema',
          image: '/images/drink-1.jpg'
        },
        {
          id: 2,
          name: 'Cappuccino',
          price: 20,
          description: 'Espresso with steamed milk and thick foam',
          image: '/images/drink-2.jpg'
        },
        {
          id: 3,
          name: 'Latte',
          price: 22,
          description: 'Smooth coffee with steamed milk and light foam layer',
          image: '/images/drink-3.jpg'
        },
        {
          id: 4,
          name: 'Arabic Coffee',
          price: 18,
          description: 'Traditional Arabic coffee with cardamom flavor',
          image: '/images/drink-4.jpg'
        },
        {
          id: 5,
          name: 'Americano',
          price: 16,
          description: 'Espresso diluted with hot water',
          image: '/images/drink-5.jpg'
        },
        {
          id: 6,
          name: 'Mocha',
          price: 25,
          description: 'Coffee with chocolate and whipped cream',
          image: '/images/drink-6.jpg'
        }
      ],
      drinks: [
        {
          id: 7,
          name: 'Green Tea',
          price: 12,
          description: 'Refreshing natural green tea',
          image: '/images/drink-7.jpg'
        },
        {
          id: 8,
          name: 'Fresh Orange Juice',
          price: 18,
          description: '100% natural orange juice',
          image: '/images/drink-8.jpg'
        },
        {
          id: 9,
          name: 'Lemonade',
          price: 15,
          description: 'Refreshing lemon drink',
          image: '/images/drink-9.jpg'
        }
      ],
      desserts: [
        {
          id: 10,
          name: 'Tiramisu',
          price: 35,
          description: 'Classic Italian dessert with coffee flavor',
          image: '/images/dessert-1.jpg'
        },
        {
          id: 11,
          name: 'Cheesecake',
          price: 30,
          description: 'Creamy vanilla cheesecake',
          image: '/images/dessert-2.jpg'
        },
        {
          id: 12,
          name: 'Brownies',
          price: 28,
          description: 'Rich and soft chocolate cake',
          image: '/images/dessert-3.jpg'
        },
        {
          id: 13,
          name: 'Kunafa',
          price: 32,
          description: 'Traditional Middle Eastern dessert with cheese and honey',
          image: '/images/dessert-4.jpg'
        }
      ],
      breakfast: [
        {
          id: 14,
          name: 'Levantine Breakfast',
          price: 45,
          description: 'Foul, hummus, olives, cheese, and fresh bread',
          image: '/images/dish-1.jpg'
        },
        {
          id: 15,
          name: 'Vegetable Omelette',
          price: 38,
          description: 'Scrambled eggs with fresh vegetables',
          image: '/images/dish-2.jpg'
        },
        {
          id: 16,
          name: 'Pastries',
          price: 25,
          description: 'Pastries filled with cheese or za\'atar',
          image: '/images/dish-3.jpg'
        }
      ]
    },
    addedToCart: 'Added to cart!',
    addToCartButton: 'Add to Cart'
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
    <div className="pt-16 md:pt-20 relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/hhh.jpg)' }}>
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Menu Categories */}
      <section className="py-8 bg-black/40 backdrop-blur-sm border-b border-gray-700/50 relative">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {content.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 arabic-body backdrop-blur-sm ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="section-padding relative">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.menuItems[activeCategory]?.map((item, index) => (
              <div key={index} className="text-center group">
                {/* Image */}
                <div className="relative mb-12 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="space-y-10 pb-6">
                  {/* Product Name */}
                  <h3 className="text-white text-3xl font-semibold uppercase tracking-wide arabic-heading-font">
                    {item.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-xl leading-relaxed arabic-body px-8">
                    {item.description}
                  </p>
                  
                  {/* Price */}
                  <div className="text-white text-4xl font-bold py-6">
                    ${item.price}.00
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="border-2 border-primary text-primary px-12 py-5 text-lg font-medium uppercase tracking-wide hover:bg-primary hover:text-white transition-all duration-300 rounded-sm backdrop-blur-sm"
                  >
                    {content.addToCartButton}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-black/40 backdrop-blur-sm relative">
        <div className="w-full px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 arabic-heading-font text-white">
            {isArabic ? 'لم تجدوا ما تبحثون عنه؟' : 'Can\'t find what you\'re looking for?'}
          </h2>
          <p className="text-gray-300 mb-8 arabic-body">
            {isArabic 
              ? 'تواصلوا معنا وسنكون سعداء لمساعدتكم في العثور على الخيار المثالي'
              : 'Contact us and we\'ll be happy to help you find the perfect option'
            }
          </p>
          <button className="border-2 border-primary text-primary px-8 py-3 font-medium uppercase tracking-wide hover:bg-primary hover:text-white transition-all duration-300 rounded-sm backdrop-blur-sm">
            {isArabic ? 'اتصل بنا' : 'Contact Us'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default Menu 