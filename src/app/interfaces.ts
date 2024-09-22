export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  ratingCount: number;
  description: string;
  features: string[];
  images: string[];
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
