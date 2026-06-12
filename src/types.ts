export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: 'meat' | 'processed' | 'poultry' | 'dairy';
  rating: number;
  isAvailable: boolean;
  tag?: string; // e.g. "بلدي طازج", "مميز"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
  avatar: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  orderType: 'delivery' | 'pickup' | 'dinein';
  address: string;
  deliveryTime: string;
  paymentMethod: 'cash' | 'vodafone' | 'instapay';
  notes: string;
}
