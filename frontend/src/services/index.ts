// Export các client API
export {
  setToken,
  getToken,
  testConnection
} from './api-client';

// Thêm hàm logout để xóa token
export const logout = () => {
  // Import và gọi hàm setToken với chuỗi rỗng để xóa token
  const { setToken } = require('./api-client');
  setToken('');
};

// Export các services
export { default as authService } from './auth-service';
export { default as productService } from './product-service';
export { default as categoryService } from './category-service';
export { default as orderService } from './order-service';

// Export các kiểu dữ liệu
export type { AuthData } from './auth-service';
export type { Product, ProductListResponse } from './product-service';
export type { Category } from './category-service';
export type { Order, OrderItem, ShippingAddress } from './order-service';
