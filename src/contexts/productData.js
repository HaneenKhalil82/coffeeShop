// src/data/productData.js

export const allProducts = [
  // Coffee Category
  {
    id: 1,
      name_ar: 'إسبريسو',
      name_en: 'Espresso',
    price: 15,
    category: 'coffee',
    description: 'Rich concentrated coffee with golden crema',
    image: '/images/menu-1.jpg',
    popular: true,
    rating: 4.8,
    ingredients: ['Arabic Coffee', 'Water'],
    calories: 5,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 2,
    name_ar: 'كابتشينو',
    name_en: 'Cappuccino',
    price: 20,
    category: 'coffee',
    description: 'Espresso with steamed milk and thick foam',
    image: '/images/menu-2.jpg',
    popular: true,
    rating: 4.9,
    ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
    calories: 120,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 3,
    name_ar: 'لاتيه',
    name_en: 'Latte',
    price: 22,
    category: 'coffee',
    description: 'Smooth coffee with steamed milk and light foam layer',
    image: '/images/menu-3.jpg',
    popular: false,
    rating: 4.7,
    ingredients: ['Espresso', 'Steamed Milk'],
    calories: 140,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 4,
    name_ar: 'قهوة عربية',
    name_en: 'Arabic Coffee',
    price: 18,
    category: 'coffee',
    description: 'Traditional Arabic coffee with cardamom flavor',
    image: '/images/arabic coffee.jpg',
    popular: true,
    rating: 4.6,
    ingredients: ['Arabic Coffee', 'Cardamom', 'Saffron'],
    calories: 10,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 5,
    name_ar: 'أمريكانو',
    name_en: 'Americano',
    price: 16,
    category: 'coffee',
    description: 'Espresso diluted with hot water',
    image: '/images/menu-4.jpg',
    popular: false,
    rating: 4.5,
    ingredients: ['Espresso', 'Hot Water'],
    calories: 8,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 6,
    name_ar: 'موكا',
    name_en: 'Moka',
    price: 25,
    category: 'coffee',
    description: 'Coffee with chocolate and whipped cream',
    image: '/images/menu1.jpg',
    popular: false,
    rating: 4.4,
    ingredients: ['Espresso', 'Chocolate', 'Whipped Cream'],
    calories: 180,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  // Drinks Category
  {
    id: 7,
    name_ar: 'شاي أخضر',
   name_en: 'Green Tea',
    price: 12,
    category: 'drinks',
    description: 'Refreshing natural green tea',
    image: '/images/menu2.jpg',
    popular: false,
    rating: 4.3,
    ingredients: ['Green Tea', 'Water'],
    calories: 2,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 8,
    name_ar: 'عصير برتقال طازج',
   name_en: 'Fresh Orange Juice',
    price: 18,
    category: 'drinks',
    description: '100% natural orange juice',
    image: '/images/menu3.jpg',
    popular: true,
    rating: 4.7,
    ingredients: ['Fresh Orange'],
    calories: 110,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 9,
    name_ar: 'عصير ليمونادة',
    name_en: 'Lemonade',
    price: 15,
    category: 'drinks',
    description: 'Refreshing lemon drink',
    image: '/images/menu4.jpg',
    popular: false,
    rating: 4.5,
    ingredients: ['Lemon', 'Water', 'Sugar'],
    calories: 50,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 10,
    name_ar: 'عصير مانجو',
   name_en: 'Mango Juice',
    price: 20,
    category: 'drinks',
    description: 'Natural creamy mango juice',
    image: '/images/menu5.jpg',
    popular: true,
    rating: 4.8,
    ingredients: ['Fresh Mango', 'Milk'],
    calories: 150,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  // Desserts Category
  {
    id: 11,
    name_ar: 'تيراميسو',
    name_en:  'Tiramisu',
    price: 35,
    category: 'desserts',
    description: 'Classic Italian dessert with coffee flavor',
    image: '/images/menu6.jpg',
    popular: true,
    rating: 4.9,
    ingredients: ['Mascarpone', 'Coffee', 'Cocoa'],
    calories: 320,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 12,
    name_ar: 'تشيز كيك',
    name_en: 'Cheesecake',
    price: 30,
    category: 'desserts',
    description: 'Creamy vanilla cheesecake',
    image: '/images/bg_1.jpg',
    popular: false,
    rating: 4.6,
    ingredients: ['Cream Cheese', 'Vanilla', 'Biscuit'],
    calories: 280,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 13,
    name_ar: 'براونيز',
    name_en: 'Brownies',
    price: 28,
    category: 'desserts',
    description: 'Rich and soft chocolate cake',
    image: '/images/bg_2.jpg',
    popular: true,
    rating: 4.7,
    ingredients: ['Chocolate', 'Butter', 'Eggs'],
    calories: 250,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 14,
    name_ar: 'كنافة',
    name_en: 'Kunafa',
    price: 32,
    originalPrice: 18,
    category: 'desserts',
    description: 'Traditional Middle Eastern dessert with cheese and honey',
    image: '/images/bg_3.jpg',
    popular: false,
    rating: 4.5,
    ingredients: ['Kunafa', 'Cheese', 'Honey'],
    calories: 300,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  // Breakfast Category
  {
    id: 15,
    name_ar: 'فطور الشام',
    name_en: 'Sham Breakfast',
    price: 45,
    category: 'breakfast',
    description: 'Foul, hummus, olives, cheese, and fresh bread',
    image: '/images/bg_4.jpg',
    popular: true,
    rating: 4.8,
    ingredients: ['Foul', 'Hummus', 'Olives', 'Cheese', 'Bread'],
    calories: 420,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 16,
    name_ar: 'عجة الخضار',
    name_en: 'Vegetable Omelette',  
    price: 38,
    category: 'breakfast',
    description: 'Scrambled eggs with fresh vegetables',
    image: '/images/about.jpg',
    popular: false,
    rating: 4.4,
    ingredients: ['Eggs', 'Mixed Vegetables', 'Olive Oil'],
    calories: 180,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  },
  {
    id: 17,
    name_ar: 'فطائر',
    name_en: 'Pastries',
    price: 25,
    originalPrice: 18,
    category: 'breakfast',
    description: 'Pastries filled with cheese or za\'atar',
    image: '/images/about2.webp',
    popular: true,
    rating: 4.6,
    ingredients: ['Flour', 'Cheese', "Za'atar"],
    calories: 200,
    inStock: true,
    sizes: [
      { name: 'small', price: 12, arabicName: 'صغير' },
      { name: 'medium', price: 15, arabicName: 'متوسط' },
      { name: 'large', price: 18, arabicName: 'كبير' }
    ]
  }
];
