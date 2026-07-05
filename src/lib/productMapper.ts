import { Product } from '../types';

/** Row shape from Supabase `products` table (snake_case columns). */
export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  image: string;
  category: Product['category'];
  rating: number | null;
  is_available: boolean;
  tag: string | null;
  original_price: number | null;
  min_quantity: number | null;
  quantity_step: number | null;
  created_at?: string;
  updated_at?: string;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    unit: row.unit,
    image: row.image,
    category: row.category,
    rating: row.rating != null ? Number(row.rating) : 4.5,
    isAvailable: row.is_available,
    ...(row.tag ? { tag: row.tag } : {}),
    ...(row.original_price != null ? { originalPrice: Number(row.original_price) } : {}),
    ...(row.min_quantity != null ? { minQuantity: Number(row.min_quantity) } : {}),
    ...(row.quantity_step != null ? { quantityStep: Number(row.quantity_step) } : {}),
  };
}

export function productToRow(
  product: Partial<Product> & Pick<Product, 'id' | 'name' | 'price' | 'unit' | 'image' | 'category'>
): Omit<ProductRow, 'created_at' | 'updated_at'> {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    unit: product.unit,
    image: product.image,
    category: product.category,
    rating: product.rating ?? 4.5,
    is_available: product.isAvailable ?? true,
    tag: product.tag ?? null,
    original_price: product.originalPrice ?? null,
    min_quantity: product.minQuantity ?? null,
    quantity_step: product.quantityStep ?? null,
  };
}
