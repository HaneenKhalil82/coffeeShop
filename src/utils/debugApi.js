// Debug utility to test API responses
import { getProducts, getCategories } from '../services/api';

export const debugApiResponse = async () => {
  console.log('🔍 Debugging API Response...');
  
  try {
    // Test products API
    console.log('📦 Testing Products API...');
    const productsResponse = await getProducts();
    console.log('📦 Raw Products Response:', productsResponse);
    console.log('📦 Products Response Status:', productsResponse.status);
    console.log('📦 Products Response Data:', productsResponse.data);
    
    if (productsResponse.data) {
      const productsData = productsResponse.data?.data || productsResponse.data || [];
      console.log('📦 Extracted Products Data:', productsData);
      
      if (Array.isArray(productsData) && productsData.length > 0) {
        console.log('📦 First Product Sample:', productsData[0]);
        console.log('📦 Product Image Fields:', productsData.map(p => ({
          id: p.id,
          name: p.name,
          image: p.image,
          imageType: typeof p.image,
          hasImage: !!p.image
        })));
      }
    }
    
    // Test categories API
    console.log('\n📂 Testing Categories API...');
    const categoriesResponse = await getCategories();
    console.log('📂 Raw Categories Response:', categoriesResponse);
    console.log('📂 Categories Response Status:', categoriesResponse.status);
    console.log('📂 Categories Response Data:', categoriesResponse.data);
    
  } catch (error) {
    console.error('❌ API Debug Error:', error);
    console.error('❌ Error Response:', error.response);
    console.error('❌ Error Status:', error.response?.status);
    console.error('❌ Error Data:', error.response?.data);
  }
};

export const testImageProcessing = (sampleProducts) => {
  console.log('🖼️ Testing Image Processing with Sample Data...');
  
  const { getImageUrl } = require('../services/api');
  
  sampleProducts.forEach((product, index) => {
    console.log(`\n🖼️ Product ${index + 1}: ${product.name}`);
    console.log(`📸 Original image: ${product.image}`);
    console.log(`📸 Image type: ${typeof product.image}`);
    
    const processedImage = getImageUrl(product.image);
    console.log(`✅ Processed image: ${processedImage}`);
  });
};

export default {
  debugApiResponse,
  testImageProcessing
}; 