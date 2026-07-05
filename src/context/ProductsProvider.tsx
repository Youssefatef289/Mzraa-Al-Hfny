import { createContext, useContext, type ReactNode } from 'react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const value = useProducts();
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProductsContext() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProductsContext must be used within ProductsProvider');
  }
  return ctx;
}
