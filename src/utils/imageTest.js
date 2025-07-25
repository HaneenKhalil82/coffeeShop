// Test utility to demonstrate image URL processing
import { getImageUrl } from '../services/api';

// Test different image URL formats that might come from the API
export const testImageUrlProcessing = () => {
  console.log('🧪 Testing Image URL Processing...');
  
  const testCases = [
    // Full URL
    'https://api.coffee.test/images/espresso.jpg',
    
    // Relative path starting with /
    '/images/cappuccino.jpg',
    
    // Just filename
    'latte.jpg',
    
    // Null/undefined
    null,
    undefined,
    
    // Empty string
    '',
    
    // Different file extensions
    'coffee.png',
    'drink.webp',
    'dessert.jpeg'
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n🧪 Test Case ${index + 1}:`, testCase);
    const result = getImageUrl(testCase);
    console.log(`✅ Result:`, result);
  });
  
  console.log('\n🧪 Image URL Processing Test Complete!');
};

// Test with sample API response data
export const testWithSampleApiData = () => {
  console.log('🧪 Testing with Sample API Response Data...');
  
  const sampleApiResponse = {
    data: [
      {
        id: 1,
        name: 'Espresso Classic',
        price: 18,
        image: '/images/espresso.jpg',
        description: 'Rich and bold espresso'
      },
      {
        id: 2,
        name: 'Cappuccino Supreme',
        price: 25,
        image: 'https://api.coffee.test/images/cappuccino.jpg',
        description: 'Creamy cappuccino'
      },
      {
        id: 3,
        name: 'Latte Deluxe',
        price: 28,
        image: 'latte.jpg',
        description: 'Smooth latte'
      },
      {
        id: 4,
        name: 'Arabic Coffee',
        price: 22,
        image: null,
        description: 'Traditional Arabic coffee'
      }
    ]
  };
  
  console.log('📦 Sample API Response:', sampleApiResponse);
  
  sampleApiResponse.data.forEach(product => {
    console.log(`\n🖼️ Product: ${product.name}`);
    console.log(`📸 Original image: ${product.image}`);
    const processedImage = getImageUrl(product.image);
    console.log(`✅ Processed image: ${processedImage}`);
  });
  
  console.log('\n🧪 Sample API Data Test Complete!');
};

// Export for use in components
export default {
  testImageUrlProcessing,
  testWithSampleApiData
}; 