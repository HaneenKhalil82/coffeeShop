import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa'
import { useRTL, useCart } from '../App'
import HeroSection from './../components/HeroSection'
import { getProductById, getImageUrl } from '../services/api'

const ProductSingle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isArabic } = useRTL()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('medium')
  const [isFavorite, setIsFavorite] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const content = isArabic ? {
    backToShop: 'العودة إلى المتجر',
    quantity: 'الكمية',
    addToCart: 'أضف إلى السلة',
    addToFavorites: 'أضف إلى المفضلة',
    removeFromFavorites: 'إزالة من المفضلة',
    size: 'الحجم',
    description: 'الوصف',
    features: 'المميزات',
    reviews: 'تقييم',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    loading: 'جاري التحميل...',
    error: 'خطأ في تحميل البيانات',
    productNotFound: 'المنتج غير موجود',
    retry: 'إعادة المحاولة',
    addedToCart: 'تم إضافة المنتج إلى السلة',
    category: 'الفئة',
    ingredients: 'المكونات',
    calories: 'سعرات حرارية',
    price: 'السعر'
  } : {
    backToShop: 'Back to Shop',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    size: 'Size',
    description: 'Description',
    features: 'Features',
    reviews: 'Reviews',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    loading: 'Loading...',
    error: 'Error loading data',
    productNotFound: 'Product not found',
    retry: 'Retry',
    addedToCart: 'Product added to cart',
    category: 'Category',
    ingredients: 'Ingredients',
    calories: 'Calories',
    price: 'Price'
  }

  // Fallback product data when API is unavailable
  const getFallbackProduct = (productId) => {
    const fallbackProducts = [
      {
        id: 1,
        name: 'Espresso Classic',
        price: 18,
        originalPrice: null,
        image: '/images/menu-1.jpg',
        images: ['/images/menu-1.jpg', '/images/menu-2.jpg'],
        description: 'Rich and bold espresso with a perfect golden crema layer. Made from premium Arabica beans.',
        category: 'Coffee',
        rating: 4.8,
        reviews: 124,
        ingredients: ['Espresso beans', 'Water'],
        calories: 5,
        inStock: true,
        stock: 50,
        sizes: [
          { name: 'small', price: 15, arabicName: 'صغير' },
          { name: 'medium', price: 18, arabicName: 'متوسط' },
          { name: 'large', price: 22, arabicName: 'كبير' }
        ]
      },
      {
        id: 2,
        name: 'Cappuccino Supreme',
        price: 25,
        originalPrice: null,
        image: '/images/menu-2.jpg',
        images: ['/images/menu-2.jpg', '/images/menu-3.jpg'],
        description: 'Creamy cappuccino with steamed milk and thick foam. Perfect balance of coffee and milk.',
        category: 'Coffee',
        rating: 4.9,
        reviews: 89,
        ingredients: ['Espresso', 'Steamed milk', 'Milk foam'],
        calories: 120,
        inStock: true,
        stock: 45,
        sizes: [
          { name: 'small', price: 20, arabicName: 'صغير' },
          { name: 'medium', price: 25, arabicName: 'متوسط' },
          { name: 'large', price: 30, arabicName: 'كبير' }
        ]
      },
      {
        id: 3,
        name: 'Latte Deluxe',
        price: 28,
        originalPrice: null,
        image: '/images/menu-3.jpg',
        images: ['/images/menu-3.jpg', '/images/menu-4.jpg'],
        description: 'Smooth latte with perfectly steamed milk and artistic foam design.',
        category: 'Coffee',
        rating: 4.7,
        reviews: 156,
        ingredients: ['Espresso', 'Steamed milk'],
        calories: 140,
        inStock: true,
        stock: 40,
        sizes: [
          { name: 'small', price: 22, arabicName: 'صغير' },
          { name: 'medium', price: 28, arabicName: 'متوسط' },
          { name: 'large', price: 35, arabicName: 'كبير' }
        ]
      },
      {
        id: 4,
        name: 'Arabic Coffee',
        price: 22,
        originalPrice: null,
        image: '/images/arabic coffee.jpg',
        images: ['/images/arabic coffee.jpg'],
        description: 'Traditional Arabic coffee with cardamom and spices. Authentic Middle Eastern experience.',
        category: 'Coffee',
        rating: 4.6,
        reviews: 98,
        ingredients: ['Arabic beans', 'Cardamom', 'Saffron'],
        calories: 10,
        inStock: true,
        stock: 35,
        sizes: [
          { name: 'small', price: 18, arabicName: 'صغير' },
          { name: 'medium', price: 22, arabicName: 'متوسط' },
          { name: 'large', price: 28, arabicName: 'كبير' }
        ]
      }
    ];

    const product = fallbackProducts.find(p => p.id === parseInt(productId));
    return product || fallbackProducts[0]; // Return first product as default
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await getProductById(id)
        
        if (response.data) {
          console.log('🖼️ ProductSingle: Raw API response data:', response.data);
          console.log('🖼️ ProductSingle: Processing image:', response.data.image);
          
          // Transform API data to component format
          const transformedProduct = {
            id: response.data.id,
            name: response.data.name,
            price: response.data.price,
            originalPrice: response.data.original_price || null,
            image: getImageUrl(response.data.image) || '/images/menu-1.jpg',
            images: response.data.images ? response.data.images.map(img => getImageUrl(img)) : [getImageUrl(response.data.image) || '/images/menu-1.jpg'],
            description: response.data.description,
            category: response.data.category?.name || 'Unknown',
            rating: response.data.rating || 4.0,
            reviews: response.data.reviews_count || 0,
            ingredients: response.data.ingredients || [],
            calories: response.data.calories || 0,
            inStock: response.data.stock > 0,
            stock: response.data.stock || 0,
            // Default sizes if not provided by API
            sizes: response.data.sizes || [
              { name: 'small', price: response.data.price * 0.8, arabicName: 'صغير' },
              { name: 'medium', price: response.data.price, arabicName: 'متوسط' },
              { name: 'large', price: response.data.price * 1.3, arabicName: 'كبير' }
            ]
          }
          
          console.log('🖼️ ProductSingle: Transformed product with image:', transformedProduct.image);
          setProduct(transformedProduct)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        console.log('Using fallback product data while API is unavailable...')
        
        // Use fallback product data when API fails
        const fallbackProduct = getFallbackProduct(id)
        if (fallbackProduct) {
          setProduct(fallbackProduct)
          setError(null)
        } else {
          setError(err.message || 'Failed to load product')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    
    setAddingToCart(true)
    
    // Simulate adding to cart
    setTimeout(() => {
      const selectedSizeData = product.sizes?.find(size => size.name === selectedSize)
      const cartItem = {
        ...product,
        quantity,
        selectedSize,
        price: selectedSizeData?.price || product.price
      }
      
      let allSuccess = true
      for (let i = 0; i < quantity; i++) {
        const result = addToCart(cartItem)
        if (!result.success) {
          allSuccess = false
          break
        }
      }
      
      if (allSuccess) {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
      
      setAddingToCart(false)
    }, 500)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const getCurrentPrice = () => {
    if (!product) return 0
    const selectedSizeData = product.sizes?.find(size => size.name === selectedSize)
    return selectedSizeData?.price || product.price
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
        <HeroSection 
          title={content.loading}
          backgroundImage="/images/bg13.jpeg"
        />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">{content.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
        <HeroSection 
          title={content.error}
          backgroundImage="/images/bg13.jpeg"
        />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error || content.productNotFound}</p>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {content.retry}
                </button>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  {content.backToShop}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <HeroSection 
        title={product.name}
        backgroundImage="/images/bg13.jpeg"
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <FaArrowLeft className={`w-4 h-4 ${isArabic ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {content.backToShop}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/menu-1.jpg'
                }}
              />
            </div>
            
            {/* Thumbnail images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/menu-1.jpg'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <FaHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} {content.reviews})
                  </span>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? content.inStock : content.outOfStock}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${getCurrentPrice().toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > getCurrentPrice() && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{content.size}:</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedSize === size.name
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">
                          {isArabic ? size.arabicName : size.name}
                        </div>
                        <div className="text-sm">
                          ${size.price.toFixed(2)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{content.quantity}:</h3>
              <div className="flex items-center border-2 border-gray-200 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FaMinus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {addingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaShoppingCart className="w-5 h-5 mr-3" />
                    {content.addToCart} - ${(getCurrentPrice() * quantity).toFixed(2)}
                  </>
                )}
              </button>
              
              <div className="text-center text-gray-600">
                <span className="text-sm">
                  {content.price}: ${getCurrentPrice().toFixed(2)} × {quantity} = ${(getCurrentPrice() * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{content.description}:</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{content.ingredients}:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{product.calories}</div>
                <div className="text-sm text-gray-600">{content.calories}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{product.rating}</div>
                <div className="text-sm text-gray-600">{content.reviews}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <FaShoppingCart className="w-5 h-5 mr-2" />
            {content.addedToCart}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSingle