import { authRequest } from './api-client';
import { Product } from './product-service';

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  city?: string;
  note?: string;
}

export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO';
export type OrderStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao hàng' | 'Đã giao hàng' | 'Đã hủy';
export type PaymentStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Hoàn tiền';

export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingFee?: number;
  discount?: number;
  coupon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
    variant?: {
      size?: string;
      color?: string;
    };
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

const orderService = {
  getOrders: () => {
    return authRequest<Order[]>('orders');
  },
  
  getOrderDetail: (orderId: string) => {
    return authRequest<Order>(`orders/${orderId}`);
  },
  
  createOrder: (orderData: CreateOrderRequest) => {
    return authRequest<Order>('orders', 'POST', orderData);
  },
  
  cancelOrder: (orderId: string) => {
    return authRequest<Order>(`orders/${orderId}/cancel`, 'PUT');
  }
};

export default orderService; 