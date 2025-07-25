# Coffee API Integration Setup

## Environment Configuration

Create a `.env` file in the `coffee-react` directory with the following variables:

```env
# Coffee API Configuration
VITE_API_BASE_URL=https://api.coffee.test/api
VITE_API_TIMEOUT=10000

# Alternative environments
# VITE_API_BASE_URL=http://localhost:8000/api  # Local development
# VITE_API_BASE_URL=https://staging-api.coffee.test/api  # Staging
```

## Quick Domain Change

To easily change the API domain:

1. **Option 1: Environment File**
   - Update `VITE_API_BASE_URL` in your `.env` file
   - Restart the development server: `npm run dev`

2. **Option 2: Config File**
   - Edit `src/config/api.config.js`
   - Uncomment/modify the `API_BASE_URL` line for your environment

## API Endpoints Implemented

### Public Endpoints (from Postman Collection)

✅ **Products**
- `GET /products` - Get all active products
- `GET /products/{id}` - Get product details
- `GET /products/search` - Search products with filters

✅ **Categories**
- `GET /categories` - Get all categories
- `GET /categories/{id}/products` - Get products by category

✅ **Branches**
- `GET /branches` - Get all active branches
- `GET /branches/{id}/products` - Get products by branch

### Authentication Endpoints

✅ **Auth**
- `POST /admin/auth/login` - Admin login
- `POST /admin/auth/logout` - Admin logout
- `GET /admin/auth/profile` - Get user profile
- `POST /admin/auth/refresh` - Refresh token

## Usage Examples

### Fetching Products
```javascript
import { getProducts, searchProducts } from '../services/api';

// Get all products
const products = await getProducts();

// Search products
const searchResults = await searchProducts({
  q: 'coffee',
  category_id: 1,
  min_price: 10,
  max_price: 50
});
```

### Using the Menu Hook
```javascript
import { useMenuData } from '../hooks/useMenuData';

const MyComponent = () => {
  const { 
    products, 
    categories, 
    loading, 
    error,
    searchMenuItems 
  } = useMenuData();

  // Products and categories are automatically fetched and transformed
  // Use filterAndSortProducts for local filtering
};
```

## API Response Format

The API is expected to return data in this format:

### Products Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Espresso",
      "description": "Strong Italian coffee",
      "price": 15.00,
      "image": "/images/espresso.jpg",
      "category": {
        "id": 1,
        "name": "Coffee",
        "name_ar": "قهوة"
      },
      "is_popular": true,
      "rating": 4.8,
      "ingredients": ["Coffee beans", "Water"],
      "calories": 5,
      "stock": 100
    }
  ]
}
```

### Categories Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Coffee",
      "name_ar": "قهوة"
    }
  ]
}
```

## Components Updated

- ✅ `Menu.jsx` - Now uses API data with fallback to hardcoded data
- ✅ Created `useMenuData` hook for data management
- ✅ API service with proper error handling and interceptors
- ✅ **Image handling updated** - Now properly processes `response.data.image` from API

## Image URL Processing

The application now properly handles different image URL formats from the API:

### Supported Image Formats
- **Full URLs**: `https://api.coffee.test/images/espresso.jpg`
- **Relative paths**: `/images/cappuccino.jpg`
- **Filenames**: `latte.jpg` (assumes `/images/` folder)
- **Null/undefined**: Falls back to default image

### Image Processing Flow
1. API returns product data with `image` field
2. `getImageUrl()` utility function processes the image path
3. If image is a full URL, it's used directly
4. If image is relative, it's combined with API base URL
5. If image is just a filename, it's prefixed with `/images/`
6. If no image is provided, falls back to `/images/menu-1.jpg`

### Updated Components
- `useMenuData.js` - Now uses `getImageUrl()` for proper image processing
- `ProductSingle.jsx` - Handles both single images and image arrays
- Added console logging for debugging image processing

## Error Handling

The API service includes:
- Request/response interceptors
- Automatic token management
- Comprehensive error logging
- Fallback mechanisms in components
- Image fallback handling 