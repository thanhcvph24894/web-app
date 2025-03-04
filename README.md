# ShopApp

A full-stack e-commerce application built with Node.js, MongoDB, and React Native.

## Project Structure

```
ShopApp
│── backend                 # Backend (Node.js + MongoDB)
│   │── node_modules/       # Node.js libraries
│   │── config/            # Database and environment configurations
│   │── models/            # MongoDB data models
│   │── routes/            # API routes
│   │── controllers/       # API logic controllers
│   │── middleware/        # Middleware (auth, error handling)
│   │── .env              # Environment variables
│   │── package.json      # NPM configuration
│   │── server.js         # Main backend file
│
│── frontend              # Frontend (React Native)
│   │── android/         # Android specific code
│   │── ios/            # iOS specific code
│   │── src/            # Main source code
│   │   │── components/ # Reusable components
│   │   │── screens/    # App screens
│   │   │── api/        # API calls to backend
│   │   │── App.js      # Main React Native file
│   │── package.json    # NPM configuration
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (macOS only):
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on Android:
   ```bash
   npm run android
   ```

6. Run on iOS:
   ```bash
   npm run ios
   ```

## Features

- User authentication and authorization
- Product listing and details
- Shopping cart functionality
- Order management
- User profile management

## API Documentation

The backend API provides the following endpoints:

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product details
- POST /api/products - Create new product (Admin only)
- PUT /api/products/:id - Update product (Admin only)
- DELETE /api/products/:id - Delete product (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.