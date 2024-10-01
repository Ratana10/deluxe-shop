import { Context } from "telegraf";

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
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  total: number;
}

// Bot type

export interface SessionData {
  orderId?: string;
}

export interface CustomContext extends Context {
  session: SessionData;
  match?: RegExpExecArray;
}
