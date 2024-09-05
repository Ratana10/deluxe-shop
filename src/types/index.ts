
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