
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

export interface ContactUs{
  label: string;
  href: string;
  icon: any;
  src: string;
}

export interface CartItem{
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
  totalQuantity: number;
};