export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: 'meat' | 'processed' | 'poultry' | 'dairy' | 'cheese';
  rating: number;
  isAvailable: boolean;
  tag?: string; // e.g. "بلدي طازج", "مميز"
  originalPrice?: number; // السعر قبل العرض
  minQuantity?: number; // minimum weight/count (e.g. whole chicken from 1 kg)
  quantityStep?: number; // increment step for weight products
}

export interface CartItem {
  product: Product;
  quantity: number;
  cartKey: string;
  portionKg?: number;
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
