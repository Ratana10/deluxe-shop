import { Context } from "telegraf";
import { IOrderStatus, IPaymentStatus, PaymentMethod } from "./enums";

export interface IOrderDetail {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}
export interface IOrder {
  queryId: string | null;
  chatId: number | null;
  orderNumber?: string;
  orderStatus?: IOrderStatus;
  paymentStatus?: IPaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryFee: number;
  subtotal: number;
  total: number;
  phoneNumber: string;
  location: string;
  address: string;
  orderDetails: IOrderDetail[];
}

export interface Customer {
  chatId: number;
  username: string;
  firstName: string;
  lastName: string;
  botUsed?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  chatId: string;
  orderStatus: string;
  cusMsgId: number;
  orderDetails: OrderDetail[];
}
export interface ContactUs {
  label: string;
  href: string;
  icon: any;
  src: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartContextType {
  totalQuantity: number;
  totalAmount: number;
  subtotalAmount: number;
  DELIVERY_FEE: number;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

// Bot type

export interface SessionData {
  orderId?: string;
}

export interface CustomContext extends Context {
  session: SessionData;
  match?: RegExpExecArray;
}
