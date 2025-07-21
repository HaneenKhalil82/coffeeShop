# Coffee Shop API Environment Setup Guide

## Overview
This document provides a comprehensive guide for setting up environment variables and using the API endpoints based on the Coffee Shop API Postman Collection.

## Environment Variables Setup

### 1. Create Environment File
Create a `.env` file in your project root with the following variables:

```bash
# Coffee Shop API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Authentication Endpoints
VITE_API_REGISTER=/auth/register
VITE_API_LOGIN=/auth/login
VITE_API_LOGOUT=/auth/logout
VITE_API_PROFILE=/auth/profile
VITE_API_UPDATE_PROFILE=/auth/profile
VITE_API_CHANGE_PASSWORD=/auth/change-password
VITE_API_REFRESH_TOKEN=/auth/refresh

# Public Product Endpoints
VITE_API_PRODUCTS=/products
VITE_API_CATEGORIES=/categories
VITE_API_BRANCHES=/branches
VITE_API_PRODUCT_SEARCH=/products/search
VITE_API_PRODUCT_DETAILS=/products
VITE_API_CATEGORY_PRODUCTS=/categories
VITE_API_BRANCH_PRODUCTS=/branches

# User Management Endpoints
VITE_API_USER_ADDRESSES=/user/addresses
VITE_API_USER_FAVORITES=/user/favorites
VITE_API_USER_ORDERS=/user/orders

# Order Management Endpoints
VITE_API_PLACE_ORDER=/orders
VITE_API_DELIVERY_LOCATIONS=/delivery-locations
VITE_API_GET_DELIVERY_FEE=/get-delivery-fee
VITE_API_VALIDATE_PROMO_CODE=/validate-promo-code
```

### 2. Production Environment
For production, update the base URL:
```bash
VITE_API_BASE_URL=https://your-production-api.com/api
```

## API Endpoints from Postman Collection

### 🔐 Public User Authentication
- **Register User**: `POST /api/auth/register`
- **Login User**: `POST /api/auth/login`
- **Get Profile**: `GET /api/auth/profile`
- **Update Profile**: `PUT /api/auth/profile`
- **Change Password**: `POST /api/auth/change-password`
- **Refresh Token**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`

### 📍 Address Management
- **Get User Addresses**: `GET /api/user/addresses`
- **Add New Address**: `POST /api/user/addresses`
- **Update Address**: `PUT /api/user/addresses/{id}`
- **Delete Address**: `DELETE /api/user/addresses/{id}`

### ❤️ Favorites Management
- **Get User Favorites**: `GET /api/user/favorites`
- **Add to Favorites**: `POST /api/user/favorites`
- **Remove from Favorites**: `DELETE /api/user/favorites/{id}`

### 🛒 Order Management
- **Get User Orders**: `GET /api/user/orders`
- **Get Order Details**: `GET /api/user/orders/{id}`

### 🚚 Order Placement & Delivery
- **Get Delivery Locations**: `GET /api/delivery-locations`
- **Get Delivery Fee**: `POST /api/get-delivery-fee`
- **Validate Promo Code**: `POST /api/validate-promo-code`
- **Place Order (Delivery)**: `POST /api/orders`
- **Place Order (Takeaway)**: `POST /api/orders`

### 🛍️ Public Products
- **Get Active Products**: `GET /api/products`
- **Get Categories**: `GET /api/categories`
- **Get Active Branches**: `GET /api/branches`
- **Search Products**: `GET /api/products/search`
- **Get Product Details**: `GET /api/products/{id}`
- **Get Products by Category**: `GET /api/categories/{id}/products`
- **Get Products by Branch**: `GET /api/branches/{id}/products`

## Additional Suggested Endpoints (Not in Postman Collection)

These endpoints are commonly needed for a complete coffee shop application:

### User Management Extended
- **Cart Management**: `/user/cart`
- **Wishlist**: `/user/wishlist`
- **Order History**: `/user/order-history`
- **Loyalty Points**: `/user/loyalty`
- **Notifications**: `/user/notifications`

### Authentication Extended
- **Password Reset**: `/auth/password-reset`
- **Email Verification**: `/auth/verify-email`
- **Social Login**: `/auth/social`

### Product Extended
- **Reviews**: `/products/reviews`
- **Rating**: `/products/rating`
- **Inventory Check**: `/products/inventory`
- **Nutritional Info**: `/products/nutrition`
- **Allergen Info**: `/products/allergens`
- **Customizations**: `/products/customizations`
- **Recommendations**: `/menu/recommendations`

### Store Information
- **Store Locator**: `/stores/locations`
- **Store Hours**: `/stores/hours`

### Payment & Checkout
- **Payment Methods**: `/payment-methods`
- **Guest Checkout**: `/guest/checkout`

### Support & Communication
- **Contact**: `/contact`
- **Support Tickets**: `/support/tickets`

### Tracking & Analytics
- **Delivery Tracking**: `/orders/tracking`
- **User Analytics**: `/user/analytics`

## Request/Response Examples

### Registration Request
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "password": "password123",
    "password_confirmation": "password123"
}
```

### Login Request
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Place Order Request
```json
{
    "branch_id": 1,
    "order_type": "delivery",
    "payment_method": "cash_on_delivery",
    "user_address_id": 1,
    "promo_code": "WELCOME10",
    "scheduled_delivery_time": "2024-01-15 18:00:00",
    "delivery_notes": "Please call before delivery",
    "customer_notes": "Extra hot coffee",
    "loyalty_points_used": 50,
    "items": [
        {
            "product_id": 1,
            "quantity": 2,
            "notes": "Extra hot"
        },
        {
            "product_id": 2,
            "quantity": 1,
            "notes": "No sugar"
        }
    ]
}
```

## Authentication Token Handling

The application uses Bearer token authentication:

1. **Login**: Receive `access_token` from login response
2. **Storage**: Store token in `localStorage` as `auth_token`
3. **Headers**: Include `Authorization: Bearer {token}` in all authenticated requests
4. **Refresh**: Use refresh endpoint to get new token when needed
5. **Logout**: Clear token from storage and call logout endpoint

## Error Handling

The API service includes comprehensive error handling:

- **401 Unauthorized**: Automatically redirect to login
- **Network Errors**: Show connection error message
- **Validation Errors**: Display field-specific error messages
- **Server Errors**: Show generic error message with retry option

## Testing with Postman

Use the provided Postman collection variables:

```json
{
    "base_url": "http://localhost:8000",
    "public_token": "your_public_user_jwt_token_here",
    "admin_token": "your_admin_jwt_token_here"
}
```

## Development Tips

1. **Environment Switching**: Use different `.env` files for development/staging/production
2. **API Monitoring**: Log all API calls in development mode
3. **Token Refresh**: Implement automatic token refresh logic
4. **Offline Support**: Cache frequently used data for offline access
5. **Rate Limiting**: Handle API rate limits gracefully

## Security Considerations

1. **Token Storage**: Consider using secure storage for tokens
2. **HTTPS**: Always use HTTPS in production
3. **Input Validation**: Validate all user inputs before API calls
4. **Error Messages**: Don't expose sensitive information in error messages
5. **Logout**: Implement proper cleanup on logout

For more information, refer to the Postman collection documentation. 