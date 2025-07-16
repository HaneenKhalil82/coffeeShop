import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaStar, FaHeart, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa'
import { useRTL, useCart } from '../App'
import HeroSection from './../components/HeroSection'
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { allProducts } from '../contexts/productData';

const ProductSingle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
   const { id } = useParams()
  const { isArabic } = useRTL()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('medium')
  const product = allProducts.find((item) => item.id === parseInt(id)) || allProducts[0];
  // const [isFavorite, setIsFavorite] = useState(false)

  // Sample product data - in a real app, this would come from an API
  // const productData = isArabic ? {
  //   1: {
  //     id: 1,
  //     name: 'قهوة عربية فاخرة',
  //     price: 50,
  //     originalPrice: 60,
  //     image: '/images/arabic coffee.jpg',
  //     images: ['/images/arabic coffee.jpg', '/images/drink-1.jpg', '/images/drink-2.jpg'],
  //     description: 'قهوة عربية أصيلة محمصة بعناية فائقة من أجود أنواع البن المستورد من أفضل مزارع القهوة في العالم. تتميز بطعمها الغني ونكهتها العريقة التي تجمع بين الأصالة والحداثة.',
  //     category: 'قهوة ساخنة',
  //     rating: 4.8,
  //     reviews: 124,
  //     sizes: [
  //       { name: 'small', price: 40, arabicName: 'صغير' },
  //       { name: 'medium', price: 50, arabicName: 'متوسط' },
  //       { name: 'large', price: 65, arabicName: 'كبير' }
  //     ],
  //     features: [
  //       'حبوب قهوة عربية 100%',
  //       'محمصة طازجة يومياً',
  //       'نكهة غنية ومتوازنة',
  //       'خالية من المواد الحافظة'
  //     ],
  //     inStock: true
  //   },
  //   2: {
  //     id: 2,
  //     name: 'كابتشينو إيطالي',
  //     price: 75,
  //     originalPrice: null,
  //     image: '/images/italian.webp',
  //     images: ['/images/italian.webp', '/images/drink-2.jpg', '/images/drink-3.jpg'],
  //     description: 'كابتشينو كريمي بالطريقة الإيطالية الأصيلة، محضر من أجود أنواع الإسبريسو مع الحليب المبخر والرغوة الكريمية. تجربة إيطالية حقيقية في كل رشفة.',
  //     category: 'قهوة ساخنة',
  //     rating: 4.7,
  //     reviews: 89,
  //     sizes: [
  //       { name: 'small', price: 65, arabicName: 'صغير' },
  //       { name: 'medium', price: 75, arabicName: 'متوسط' },
  //       { name: 'large', price: 85, arabicName: 'كبير' }
  //     ],
  //     features: [
  //       'إسبريسو إيطالي أصيل',
  //       'حليب مبخر بعناية',
  //       'رغوة كريمية مثالية',
  //       'نكهة متوازنة وغنية'
  //     ],
  //     inStock: true
  //   },
  //   3: {
  //     id: 3,
  //     name: 'لاتيه بالفانيليا',
  //     price: 60,
  //     originalPrice: 80,
  //     image: '/images/vanilla.webp',
  //     images: ['/images/vanilla.webp', '/images/drink-3.jpg', '/images/drink-4.jpg'],
  //     description: 'لاتيه طازج مع نكهة الفانيليا الطبيعية، محضر من قهوة الإسبريسو الفاخر والحليب المبخر مع لمسة من الفانيليا الطبيعية التي تضفي طعماً رائعاً ومميزاً.',
  //     category: 'قهوة ساخنة',
  //     rating: 4.6,
  //     reviews: 156,
  //     sizes: [
  //       { name: 'small', price: 50, arabicName: 'صغير' },
  //       { name: 'medium', price: 60, arabicName: 'متوسط' },
  //       { name: 'large', price: 70, arabicName: 'كبير' }
  //     ],
  //     features: [
  //       'فانيليا طبيعية 100%',
  //       'إسبريسو فاخر',
  //       'حليب مبخر بعناية',
  //       'طعم حلو ومتوازن'
  //     ],
  //     inStock: true
  //   },
  //   4: {
  //     id: 4,
  //     name: 'إسبريسو مركز',
  //     price: 50,
  //     originalPrice: null,
  //     image: '/images/double.jpg',
  //     images: ['/images/double.jpg', '/images/drink-4.jpg', '/images/drink-1.jpg'],
  //     description: 'إسبريسو إيطالي قوي ومركز، محضر من أجود أنواع حبوب القهوة المحمصة بعناية. يقدم نكهة قوية ومكثفة لعشاق القهوة الحقيقيين.',
  //     category: 'قهوة ساخنة',
  //     rating: 4.9,
  //     reviews: 203,
  //     sizes: [
  //       { name: 'small', price: 40, arabicName: 'صغير' },
  //       { name: 'medium', price: 50, arabicName: 'متوسط' },
  //       { name: 'large', price: 60, arabicName: 'كبير' }
  //     ],
  //     features: [
  //       'قهوة مركزة 100%',
  //       'محمصة بعناية فائقة',
  //       'نكهة قوية ومكثفة',
  //       'لعشاق القهوة الحقيقيين'
  //     ],
  //     inStock: true
  //   }
  // } : {
  //   1: {
  //     id: 1,
  //     name: 'Premium Arabic Coffee',
  //     price: 50,
  //     originalPrice: 60,


// image: '/images/arabic coffee.jpg',
//       images: ['/images/arabic coffee.jpg', '/images/drink-1.jpg', '/images/drink-2.jpg'],
//       description: 'Authentic Arabic coffee carefully roasted from the finest imported coffee beans from the best coffee farms in the world. Features rich taste and authentic flavor that combines tradition with modernity.',
//       category: 'Hot Coffee',
//       rating: 4.8,
//       reviews: 124,
//       sizes: [
//         { name: 'small', price: 40, arabicName: 'صغير' },
//         { name: 'medium', price: 50, arabicName: 'متوسط' },
//         { name: 'large', price: 65, arabicName: 'كبير' }
//       ],
//       features: [
//         '100% Arabic Coffee Beans',
//         'Freshly Roasted Daily',
//         'Rich and Balanced Flavor',
//         'No Preservatives'
//       ],
//       inStock: true
//     },
//     2: {
//       id: 2,
//       name: 'Italian Cappuccino',
//       price: 75,
//       originalPrice: null,
//       image: '/images/italian.webp',
//       images: ['/images/italian.webp', '/images/drink-2.jpg', '/images/drink-3.jpg'],
//       description: 'Creamy cappuccino in authentic Italian style, prepared from the finest espresso with steamed milk and creamy foam. A true Italian experience in every sip.',
//       category: 'Hot Coffee',
//       rating: 4.7,
//       reviews: 89,
//       sizes: [
//         { name: 'small', price: 65, arabicName: 'صغير' },
//         { name: 'medium', price: 75, arabicName: 'متوسط' },
//         { name: 'large', price: 85, arabicName: 'كبير' }
//       ],
//       features: [
//         'Authentic Italian Espresso',
//         'Carefully Steamed Milk',
//         'Perfect Creamy Foam',
//         'Balanced and Rich Flavor'
//       ],
//       inStock: true
//     },
//     3: {
//       id: 3,
//       name: 'Vanilla Latte',
//       price: 60,
//       originalPrice: 80,
//       image: '/images/vanilla.webp',
//       images: ['/images/vanilla.webp', '/images/drink-3.jpg', '/images/drink-4.jpg'],
//       description: 'Fresh latte with natural vanilla flavor, prepared from premium espresso and steamed milk with a touch of natural vanilla that adds a wonderful and distinctive taste.',
//       category: 'Hot Coffee',
//       rating: 4.6,
//       reviews: 156,
//       sizes: [
//         { name: 'small', price: 50, arabicName: 'صغير' },
//         { name: 'medium', price: 60, arabicName: 'متوسط' },
//         { name: 'large', price: 70, arabicName: 'كبير' }
//       ],
//       features: [
//         '100% Natural Vanilla',
//         'Premium Espresso',
//         'Carefully Steamed Milk',
//         'Sweet and Balanced Taste'
//       ],
//       inStock: true
//     },
//     4: {
//       id: 4,
//       name: 'Concentrated Espresso',
//       price: 50,
//       originalPrice: null,
//       image: '/images/double.jpg',
//       images: ['/images/double.jpg', '/images/drink-4.jpg', '/images/drink-1.jpg'],
//       description: 'Strong and concentrated Italian espresso, prepared from the finest carefully roasted coffee beans. Offers a strong and intense flavor for true coffee lovers.',
//       category: 'Hot Coffee',
//       rating: 4.9,
//       reviews: 203,
//       sizes: [
//         { name: 'small', price: 40, arabicName: 'صغير' },
//         { name: 'medium', price: 50, arabicName: 'متوسط' },
//         { name: 'large', price: 60, arabicName: 'كبير' }
//       ],
//       features: [
//         '100% Concentrated Coffee',
//         'Carefully Roasted',
//         'Strong and Intense Flavor',
//         'For True Coffee Lovers'
//       ],
//       inStock: true
//     }
//   }

  // const product = productData[id] || productData[1]

const content = isArabic ? {
    breadcrumb: {
      home: 'الرئيسية',
      shop: 'المتجر',
      product: 'تفاصيل المنتج'
    },
    category: 'التصنيف:',
    rating: 'التقييم:',
    reviews: 'مراجعة',
    price: 'السعر:',
    size: 'الحجم:',
    quantity: 'الكمية:',
    addToCart: 'أضف إلى السلة',
    addToFavorites: 'أضف إلى المفضلة',
    description: 'الوصف',
    features: 'المميزات',
    relatedProducts: 'منتجات ذات صلة',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    currency: 'ريال'
  } : {
    breadcrumb: {
      home: 'Home',
      shop: 'Shop',
      product: 'Product Details'
    },
    category: 'Category:',
    rating: 'Rating:',
    reviews: 'reviews',
    price: 'Price:',
    size: 'Size:',
    quantity: 'Quantity:',
    addToCart: 'Add to Cart',
    addToFavorites: 'Add to Favorites',
    description: 'Description',
    features: 'Features',
    relatedProducts: 'Related Products',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    currency: 'SAR'
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

 

  const handleAddToCart = () => {
  if (!user) {
    navigate("/login");
    return;
  }

  const selectedSizeData = product.sizes.find(size =>
    size.name === selectedSize
  );

  addToCart({
    ...product,
    quantity,
    selectedSize,
    price: selectedSizeData ? selectedSizeData.price : product.price
  });
};


  const getCurrentPrice = () => {
    const selectedSizeData = product.sizes.find(size => 
      size.name === selectedSize
    )
    return selectedSizeData ? selectedSizeData.price : product.price
  }

  return (
  <div className="pt-20 md:pt-24">
     <HeroSection
        backgroundImage="/images/bg13.jpeg"
        title={isArabic ? "تفاصيل المنتج" : "Product Details"}
      />
    <div className="pt-1  min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
      <div className="absolute inset-0  "></div>
      <div className="w-md px-4 md:px-6 lg:px-8 section-padding relative z-10 mt-0">
        
        {/* Breadcrumb */}
        {/* <nav className="mb-8">
          <div className="flex items-center space-x-2 space-x-reverse text-white">
            <Link to="/" className="hover:text-primary transition-colors arabic-body">
              {content.breadcrumb.home}
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors arabic-body">
              {content.breadcrumb.shop}
            </Link>
            <span>/</span>
            <span className="text-primary arabic-body">{content.breadcrumb.product}</span>
          </div>
        </nav> */}

        {/* Product Details - All in One Block */}
        <div className="rounded-lg shadow-lg overflow-hidden max-w-7xl mx-auto bg-cover bg-center bg-no-repeat relative" >
          <div className="absolute inset-0 "></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-7 relative z-10">
            
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square  rounded-sm overflow-hidden ">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-90 object-cover"
                />
              </div>
            </div>


{/* Product Info */}
            <div >
              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-2 arabic-body">
                  {content.category} {product.category}
                </p>
                <h1 className="text-4xl font-bold text-gray-300 mb-4 arabic-heading-font">
                  {isArabic ? product.name_ar : product.name_en}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center mb-4 space-x-2 space-x-reverse">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-700' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300 arabic-body">
                    {product.rating} ({product.reviews} {content.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-6 space-x-4 space-x-reverse">
                  <span className="text-3xl font-bold text-primary arabic-heading-font">
                    {getCurrentPrice()} {content.currency}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-300 line-through arabic-heading-font">
                      {product.originalPrice} {content.currency}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? content.inStock : content.outOfStock}
                  </span>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 arabic-body">
                    {content.size}
                  </label>
                  <div className="flex space-x-3 space-x-reverse">
                    {product.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`px-4 py-2 rounded border-2 border-primary/70  text-gray-300 transition-colors arabic-body ${
                          selectedSize === size.name
                            ? 'border-primary bg-primary/70 text-white'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {isArabic ? size.arabicName : size.name} ({size.price} {content.currency})
                      </button>
                    ))}
                  </div>
                </div>

             {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 arabic-body">
                    {content.quantity}
                  </label>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="w-14 h-10 border-2 border-primary/70 hover:bg-primary/70 text-primary flex items-center justify-center  transition-colors"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="w-16 h-10 text-center border-2 text-primary border-primary/70 font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="w-14 h-10 border-2 border-primary/70 hover:bg-primary/70 text-primary flex items-center justify-center  transition-colors"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 space-x-reverse mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-primary/70 hover:bg-primary/90 text-gray-300 px-6 py-3 rounded-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse arabic-body"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span>{content.addToCart}</span>
                  </button>
                 
                </div>
              </div>
            </div>


          </div>

          {/* Description and Features - Inside the same block */}
           {/* <div className="border-t border-white/30 p-7 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Description */}
               {/* <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 arabic-heading-font">
                  {content.description}
                </h3>
                <p className="text-gray-800 leading-relaxed arabic-body text-lg">
                  {product.description}
                </p>
              </div>   */}

              {/* Features */}
              {/* <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 arabic-heading-font">
                  {content.features}
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-800 arabic-body text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>  */}
        </div>
      </div>
    </div>
  </div>
  )
}

export default ProductSingle


