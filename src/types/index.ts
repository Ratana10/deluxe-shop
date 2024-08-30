export interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string; 
}