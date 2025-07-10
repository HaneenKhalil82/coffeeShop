// import React from 'react'
// import { useRTL } from '../App'
// import HeroSection from './../components/HeroSection'
// // import Menu from './../pages/Menu'


// const Shop = () => {

//   const { isArabic } = useRTL()



//   return (
  
//  <div >
//          <HeroSection 
//               backgroundImage="/images/cart1.jpg"
//              title={isArabic ? "المتجر " : "Shop"}
//          />


        
//  </div>
//   )
// }

// export default Shop 






import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaFilter, FaSort, FaStar, FaPlus, FaMinus, FaTimes, FaShoppingCart } from 'react-icons/fa'
import { useRTL, useCart } from '../App'
import HeroSection from './../components/HeroSection'

const Shop = () => {
  const { isArabic } = useRTL()
  const { addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const content = isArabic ? {
    title: 'قائمة الطعام',
    search: 'البحث في القائمة...',
    sortBy: 'ترتيب حسب',
    priceRange: 'نطاق السعر',
    categories: [
      { id: 'all', label: 'الكل' },
      { id: 'coffee', label: 'القهوة' },
      { id: 'drinks', label: 'المشروبات' },
      { id: 'desserts', label: 'الحلويات' },
      { id: 'breakfast', label: 'الإفطار' }
    ],
    sortOptions: [
      { value: 'name', label: 'الاسم' },
      { value: 'price-low', label: 'السعر: من الأقل إلى الأعلى' },
      { value: 'price-high', label: 'السعر: من الأعلى إلى الأقل' },
      { value: 'popular', label: 'الأكثر شعبية' }
    ],
    menuItems: [
      // Coffee Category
      {
        id: 1,
        name: 'إسبريسو',
        price: 15,
        category: 'coffee',
        description: 'قهوة مركزة مع طعم غني وكريمة ذهبية',
        image: '/images/menu-1.jpg',
        popular: true,
        rating: 4.8,
        ingredients: ['قهوة عربية', 'ماء'],
        calories: 5
      },
      {
        id: 2,
        name: 'كابتشينو',
        price: 20,
        category: 'coffee',
        description: 'إسبريسو مع حليب مبخر ورغوة كثيفة',
        image: '/images/menu-2.jpg',
        popular: true,
        rating: 4.9,
        ingredients: ['إسبريسو', 'حليب مبخر', 'رغوة الحليب'],
        calories: 120
      },
      {
        id: 3,
        name: 'لاتيه',
        price: 22,
        category: 'coffee',
        description: 'قهوة ناعمة مع حليب مبخر وطبقة رغوة خفيفة',
        image: '/images/menu-3.jpg',
        popular: false,
        rating: 4.7,
        ingredients: ['إسبريسو', 'حليب مبخر'],
        calories: 140
      },
      {
        id: 4,
        name: 'قهوة عربية',
        price: 18,
        category: 'coffee',
        description: 'قهوة عربية أصيلة بنكهة الهيل',
        image: '/images/arabic coffee.jpg',
        popular: true,
        rating: 4.6,
        ingredients: ['قهوة عربية', 'هيل', 'زعفران'],
        calories: 10
      },
      {
        id: 5,
        name: 'أمريكانو',
        price: 16,
        category: 'coffee',
        description: 'إسبريسو مخفف بالماء الساخن',
        image: '/images/menu-4.jpg',
        popular: false,
        rating: 4.5,
        ingredients: ['إسبريسو', 'ماء ساخن'],
        calories: 8
      },
      {
        id: 6,
        name: 'موكا',
        price: 25,
        category: 'coffee',
        description: 'قهوة مع الشوكولاتة والكريمة المخفوقة',
        image: '/images/menu1.jpg',
        popular: false,
        rating: 4.4,
        ingredients: ['إسبريسو', 'شوكولاتة', 'كريمة مخفوقة'],
        calories: 180
      },
      // Drinks Category
      {
        id: 7,
        name: 'شاي أخضر',
        price: 12,
        category: 'drinks',
        description: 'شاي أخضر طبيعي منعش',
        image: '/images/menu2.jpg',
        popular: false,
        rating: 4.3,
        ingredients: ['شاي أخضر', 'ماء'],
        calories: 2
      },
      {
        id: 8,
        name: 'عصير برتقال طازج',
        price: 18,
        category: 'drinks',
        description: 'عصير برتقال طبيعي 100%',
        image: '/images/menu3.jpg',
        popular: true,
        rating: 4.7,
        ingredients: ['برتقال طازج'],
        calories: 110
      },
      {
        id: 9,
        name: 'ليموناضة',
        price: 15,
        category: 'drinks',
        description: 'مشروب الليمون المنعش',
        image: '/images/menu4.jpg',
        popular: false,
        rating: 4.5,
        ingredients: ['ليمون', 'ماء', 'سكر'],
        calories: 50
      },
      {
        id: 10,
        name: 'عصير مانجو',
        price: 20,
        category: 'drinks',
        description: 'عصير مانجو طبيعي كريمي',
        image: '/images/menu5.jpg',
        popular: true,
        rating: 4.8,
        ingredients: ['مانجو طازج', 'حليب'],
        calories: 150
      },
      // Desserts Category
      {
        id: 11,
        name: 'تيراميسو',
        price: 35,
        category: 'desserts',
        description: 'حلوى إيطالية كلاسيكية بطعم القهوة',
        image: '/images/menu6.jpg',
        popular: true,
        rating: 4.9,
        ingredients: ['جبن ماسكاربوني', 'قهوة', 'كاكاو'],
        calories: 320
      },
      {
        id: 12,
        name: 'تشيز كيك',
        price: 30,
        category: 'desserts',
        description: 'كعكة الجبن الكريمية بطعم الفانيليا',
        image: '/images/bg_1.jpg',
        popular: false,
        rating: 4.6,
        ingredients: ['جبن كريمي', 'فانيليا', 'بسكويت'],
        calories: 280
      },
      {
        id: 13,
        name: 'براونيز',
        price: 28,
        category: 'desserts',
        description: 'كعكة الشوكولاتة الغنية والطرية',
        image: '/images/bg_2.jpg',
        popular: true,
        rating: 4.7,
        ingredients: ['شوكولاتة', 'زبدة', 'بيض'],
        calories: 250
      },
      {
        id: 14,
        name: 'كنافة',
        price: 32,
        category: 'desserts',
        description: 'حلوى شرقية تقليدية بالجبن والعسل',
        image: '/images/bg_3.jpg',
        popular: false,
        rating: 4.5,
        ingredients: ['كنافة', 'جبن', 'عسل'],
        calories: 300
      },
      // Breakfast Category
      {
        id: 15,
        name: 'فطار شامي',
        price: 45,
        category: 'breakfast',
        description: 'فول، حمص، زيتون، جبن، وخبز طازج',
        image: '/images/bg_4.jpg',
        popular: true,
        rating: 4.8,
        ingredients: ['فول', 'حمص', 'زيتون', 'جبن', 'خبز'],
        calories: 420
      },
      {
        id: 16,
        name: 'عجة بالخضار',
        price: 38,
        category: 'breakfast',
        description: 'بيض مخفوق مع خضار طازجة',
        image: '/images/about.jpg',
        popular: false,
        rating: 4.4,
        ingredients: ['بيض', 'خضار مشكلة', 'زيت زيتون'],
        calories: 180
      },
      {
        id: 17,
        name: 'فطائر',
        price: 25,
        category: 'breakfast',
        description: 'فطائر محشوة بالجبن أو الزعتر',
        image: '/images/about2.webp',
        popular: true,
        rating: 4.6,
        ingredients: ['دقيق', 'جبن', 'زعتر'],
        calories: 200
      }
    ],
    addToCart: 'أضف إلى السلة',
    quantity: 'الكمية',
    ingredients: 'المكونات',
    calories: 'سعرات حرارية',
    rating: 'التقييم',
    popular: 'شائع',
    noResults: 'لا توجد نتائج',
    itemDetails: 'تفاصيل المنتج',
    close: 'إغلاق',
    addedToCart: 'تمت الإضافة إلى السلة',
    clearFilters: 'مسح الفلاتر',
    contactUs: 'تواصل معنا',
    helpText: 'لم تجد ما تبحث عنه؟ تواصل معنا وسنساعدك!'
  } : {
    title: 'Our Menu',
    search: 'Search menu...',
    sortBy: 'Sort by',
    priceRange: 'Price Range',
    categories: [
      { id: 'all', label: 'All' },
      { id: 'coffee', label: 'Coffee' },
      { id: 'drinks', label: 'Drinks' },
      { id: 'desserts', label: 'Desserts' },
      { id: 'breakfast', label: 'Breakfast' }
    ],
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'popular', label: 'Most Popular' }
    ],
    menuItems: [
      // Coffee Category
      {
        id: 1,
        name: 'Espresso',
        price: 15,
        category: 'coffee',
        description: 'Rich concentrated coffee with golden crema',
        image: '/images/menu-1.jpg',
        popular: true,
        rating: 4.8,
        ingredients: ['Arabic Coffee', 'Water'],
        calories: 5
      },
      {
        id: 2,
        name: 'Cappuccino',
        price: 20,
        category: 'coffee',
        description: 'Espresso with steamed milk and thick foam',
        image: '/images/menu-2.jpg',
        popular: true,
        rating: 4.9,
        ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
        calories: 120
      },
      {
        id: 3,
        name: 'Latte',
        price: 22,
        category: 'coffee',
        description: 'Smooth coffee with steamed milk and light foam layer',
        image: '/images/menu-3.jpg',
        popular: false,
        rating: 4.7,
        ingredients: ['Espresso', 'Steamed Milk'],
        calories: 140
      },
      {
        id: 4,
        name: 'Arabic Coffee',
        price: 18,
        category: 'coffee',
        description: 'Traditional Arabic coffee with cardamom flavor',
        image: '/images/arabic coffee.jpg',
        popular: true,
        rating: 4.6,
        ingredients: ['Arabic Coffee', 'Cardamom', 'Saffron'],
        calories: 10
      },
      {
        id: 5,
        name: 'Americano',
        price: 16,
        category: 'coffee',
        description: 'Espresso diluted with hot water',
        image: '/images/menu-4.jpg',
        popular: false,
        rating: 4.5,
        ingredients: ['Espresso', 'Hot Water'],
        calories: 8
      },
      {
        id: 6,
        name: 'Mocha',
        price: 25,
        category: 'coffee',
        description: 'Coffee with chocolate and whipped cream',
        image: '/images/menu1.jpg',
        popular: false,
        rating: 4.4,
        ingredients: ['Espresso', 'Chocolate', 'Whipped Cream'],
        calories: 180
      },
      // Drinks Category
      {
        id: 7,
        name: 'Green Tea',
        price: 12,
        category: 'drinks',
        description: 'Refreshing natural green tea',
        image: '/images/menu2.jpg',
        popular: false,
        rating: 4.3,
        ingredients: ['Green Tea', 'Water'],
        calories: 2
      },
      {
        id: 8,
        name: 'Fresh Orange Juice',
        price: 18,
        category: 'drinks',
        description: '100% natural orange juice',
        image: '/images/menu3.jpg',
        popular: true,
        rating: 4.7,
        ingredients: ['Fresh Orange'],
        calories: 110
      },
      {
        id: 9,
        name: 'Lemonade',
        price: 15,
        category: 'drinks',
        description: 'Refreshing lemon drink',
        image: '/images/menu4.jpg',
        popular: false,
        rating: 4.5,
        ingredients: ['Lemon', 'Water', 'Sugar'],
        calories: 50
      },
      {
        id: 10,
        name: 'Mango Juice',
        price: 20,
        category: 'drinks',
        description: 'Natural creamy mango juice',
        image: '/images/menu5.jpg',
        popular: true,
        rating: 4.8,
        ingredients: ['Fresh Mango', 'Milk'],
        calories: 150
      },
      // Desserts Category
      {
        id: 11,
        name: 'Tiramisu',
        price: 35,
        category: 'desserts',
        description: 'Classic Italian dessert with coffee flavor',
        image: '/images/menu6.jpg',
        popular: true,
        rating: 4.9,
        ingredients: ['Mascarpone', 'Coffee', 'Cocoa'],
        calories: 320
      },
      {
        id: 12,
        name: 'Cheesecake',
        price: 30,
        category: 'desserts',
        description: 'Creamy vanilla cheesecake',
        image: '/images/bg_1.jpg',
        popular: false,
        rating: 4.6,
        ingredients: ['Cream Cheese', 'Vanilla', 'Biscuit'],
        calories: 280
      },
      {
        id: 13,
        name: 'Brownies',
        price: 28,
        category: 'desserts',
        description: 'Rich and soft chocolate cake',
        image: '/images/bg_2.jpg',
        popular: true,
        rating: 4.7,
        ingredients: ['Chocolate', 'Butter', 'Eggs'],
        calories: 250
      },
      {
        id: 14,
        name: 'Kunafa',
        price: 32,
        category: 'desserts',
        description: 'Traditional Middle Eastern dessert with cheese and honey',
        image: '/images/bg_3.jpg',
        popular: false,
        rating: 4.5,
        ingredients: ['Kunafa', 'Cheese', 'Honey'],
        calories: 300
      },
      // Breakfast Category
      {
        id: 15,
        name: 'Levantine Breakfast',
        price: 45,
        category: 'breakfast',
        description: 'Foul, hummus, olives, cheese, and fresh bread',
        image: '/images/bg_4.jpg',
        popular: true,
        rating: 4.8,
        ingredients: ['Foul', 'Hummus', 'Olives', 'Cheese', 'Bread'],
        calories: 420
      },
      {
        id: 16,
        name: 'Vegetable Omelette',
        price: 38,
        category: 'breakfast',
        description: 'Scrambled eggs with fresh vegetables',
        image: '/images/about.jpg',
        popular: false,
        rating: 4.4,
        ingredients: ['Eggs', 'Mixed Vegetables', 'Olive Oil'],
        calories: 180
      },
      {
        id: 17,
        name: 'Pastries',
        price: 25,
        category: 'breakfast',
        description: 'Pastries filled with cheese or za\'atar',
        image: '/images/about2.webp',
        popular: true,
        rating: 4.6,
        ingredients: ['Flour', 'Cheese', 'Za\'atar'],
        calories: 200
      }
    ],
    addToCart: 'Add to Cart',
    quantity: 'Quantity',
    ingredients: 'Ingredients',
    calories: 'Calories',
    rating: 'Rating',
    popular: 'Popular',
    noResults: 'No results found',
    itemDetails: 'Item Details',
    close: 'Close',
    addedToCart: 'Added to Cart',
    clearFilters: 'Clear Filters',
    contactUs: 'Contact Us',
    helpText: 'Can\'t find what you\'re looking for? Contact us and we\'ll help you!'
  }

  // Filter and sort menu items
  const filteredItems = content.menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]
    return matchesCategory && matchesSearch && matchesPrice
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'popular':
        return b.popular - a.popular || b.rating - a.rating
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const handleAddToCart = (item, quantity = 1) => {
    setLoading(true)
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addToCart(item)
      }
      setToastMessage(isArabic ? `تم إضافة ${item.name} إلى السلة` : `${item.name} added to cart`)
      setShowToast(true)
      setLoading(false)
      setShowItemModal(false)
      setItemQuantity(1)
    }, 500)
  }

  const openItemModal = (item) => {
    setSelectedItem(item)
    setShowItemModal(true)
    setItemQuantity(1)
  }

  const closeItemModal = () => {
    setShowItemModal(false)
    setSelectedItem(null)
    setItemQuantity(1)
  }

  const clearFilters = () => {
    setActiveCategory('all')
    setSearchTerm('')
    setSortBy('name')
    setPriceRange([0, 100])
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <div className="pt-20 md:pt-24">
      <HeroSection
        backgroundImage="/images/bg13.jpeg"
        title={content.title}
      />
      
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
        <div className="absolute inset-0 "></div>
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Search and Filter Section */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className=" backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={content.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg  focus:ring-2 focus:ring-primary focus:border-transparent bg-[#3B3737] text-gray-400"
                  />
                </div>

                {/* Sort */}
                <div className="relative">
                  <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg  focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-[#3B3737] text-gray-400"
                  >
                    {content.sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-300 mt-1">
                      <span>$0</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="text-center">
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  {content.clearFilters}
                </button>
              </div>
            </div>
          </div>
        </section>

       
        {/* Category Tabs */}
        <section className="py-4 relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {content.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 font-medium border-2 ${
                    activeCategory === category.id
                      ? 'bg-primary text-white shadow-lg border-primary'
                      : 'border-primary text-white hover:bg-primary hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* Menu Items Grid */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {sortedItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="border-2 border-primary backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-white mb-4">{content.noResults}</h3>
                  <p className="text-gray-300 mb-6">{content.helpText}</p>
                  <Link
                    to="/contact"
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 inline-block"
                  >
                    {content.contactUs}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-primary backdrop-blur-sm rounded-xl overflow-hidden hover:border-primary/80 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/menu1.jpg'
                        }}
                      />
                      {item.popular && (
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <FaStar className="w-3 h-3 mr-1" />
                          {content.popular}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300">
                          {item.name}
                        </h3>
                        <div className="flex items-center text-yellow-400">
                          <FaStar className="w-4 h-4 mr-1" />
                          <span className="text-sm text-gray-300">{item.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-primary">
                          ${item.price}
                        </span>
                        <span className="text-sm text-gray-400">
                          {item.calories} {content.calories}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={loading}
                          className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                        >
                          <FaShoppingCart className="w-4 h-4 mr-2" />
                          {content.addToCart}
                        </button>
                        <button
                          onClick={() => openItemModal(item)}
                          className="px-4 py-2 border-2 border-primary text-white rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Item Details Modal */}
        {showItemModal && selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/menu1.jpg'
                  }}
                />
                <button
                  onClick={closeItemModal}
                  className="absolute top-4 right-4  text-white p-2 rounded-full hover:bg-white/30 transition-colors duration-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                {selectedItem.popular && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <FaStar className="w-3 h-3 mr-1" />
                    {content.popular}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="w-5 h-5 mr-1" />
                    <span className="text-lg font-semibold">{selectedItem.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-lg">{selectedItem.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{content.ingredients}</h3>
                    <ul className="text-gray-600 space-y-1">
                      {selectedItem.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className=" p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">{content.calories}</span>
                        <span className="font-semibold">{selectedItem.calories}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{content.rating}</span>
                        <span className="font-semibold">{selectedItem.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-primary">
                    ${selectedItem.price}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium">{content.quantity}:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold">{itemQuantity}</span>
                      <button
                        onClick={() => setItemQuantity(itemQuantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(selectedItem, itemQuantity)}
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium text-lg disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaShoppingCart className="w-5 h-5 mr-2" />
                      {content.addToCart} (${(selectedItem.price * itemQuantity).toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop 