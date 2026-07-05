import { useCallback, useEffect, useState } from 'react';
import { Product } from '../types';
import { rowToProduct, ProductRow } from '../lib/productMapper';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProducts(FALLBACK_PRODUCTS);
      setError(null);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('id');

    if (fetchError) {
      console.error('Failed to load products:', fetchError);
      setProducts(FALLBACK_PRODUCTS);
      setError(fetchError.message);
    } else {
      setProducts((data as ProductRow[]).map(rowToProduct));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      await fetchProducts();
      if (cancelled) return;
    };

    load();

    if (!isSupabaseConfigured) {
      return () => {
        cancelled = true;
      };
    }

    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const product = rowToProduct(payload.new as ProductRow);
            setProducts((prev) => {
              if (prev.some((p) => p.id === product.id)) return prev;
              return [...prev, product].sort((a, b) => a.id.localeCompare(b.id));
            });
          } else if (payload.eventType === 'UPDATE') {
            const product = rowToProduct(payload.new as ProductRow);
            setProducts((prev) =>
              prev.map((p) => (p.id === product.id ? product : p))
            );
          } else if (payload.eventType === 'DELETE') {
            const id = (payload.old as ProductRow).id;
            setProducts((prev) => prev.filter((p) => p.id !== id));
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  return { products, loading, error, getProductById, refetch: fetchProducts };
}
