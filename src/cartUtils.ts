import { Product } from './types';

export const CHEESE_PORTIONS = [
  { label: 'ثمن', value: 0.125 },
  { label: 'ربع', value: 0.25 },
  { label: 'نص', value: 0.5 },
  { label: 'كيلو', value: 1 },
] as const;

export type ProductCategory = Product['category'];

export function isCheeseProduct(product: Product): boolean {
  return product.category === 'cheese';
}

export function makeCartKey(productId: string, category: ProductCategory, quantityKg: number): string {
  if (category === 'cheese') {
    return `${productId}@${quantityKg}`;
  }
  return productId;
}

export function parseCartKey(key: string): { productId: string; portionKg?: number } {
  const at = key.lastIndexOf('@');
  if (at === -1) return { productId: key };
  return {
    productId: key.slice(0, at),
    portionKg: parseFloat(key.slice(at + 1)),
  };
}

export function getQtyInCartForProduct(cart: Record<string, number>, productId: string): number {
  return Object.entries(cart).reduce((sum, [key, qty]) => {
    if (parseCartKey(key).productId === productId) return sum + qty;
    return sum;
  }, 0);
}

export function formatCheesePortionLabel(portionKg: number | undefined, totalKg: number): string {
  const portion = CHEESE_PORTIONS.find((p) => p.value === portionKg);
  const qtyText = Number.isInteger(totalKg) ? `${totalKg}` : totalKg.toFixed(3).replace(/\.?0+$/, '');
  if (portion) {
    const count = Math.round(totalKg / portion.value);
    if (count > 1) return `${portion.label} (${portion.value}) × ${count} = ${qtyText} كجم`;
    return `${portion.label} (${portion.value} كجم)`;
  }
  return `${qtyText} كجم`;
}

export function getWeightQuantityConfig(product: Product): { step: number; min: number } {
  if (isCheeseProduct(product)) {
    return { step: CHEESE_PORTIONS[0].value, min: CHEESE_PORTIONS[0].value };
  }
  if (product.unit === 'كيلو جرام') {
    return {
      step: product.quantityStep ?? 0.5,
      min: product.minQuantity ?? 0.5,
    };
  }
  return { step: 1, min: 1 };
}

export function getCartItemStep(product: Product, portionKg?: number): number {
  if (isCheeseProduct(product) && portionKg) return portionKg;
  return getWeightQuantityConfig(product).step;
}

export function formatQty(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(n % 0.25 === 0 ? 2 : 1);
}
