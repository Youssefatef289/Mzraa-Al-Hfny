import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, RefreshCw, Layers, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { getQtyInCartForProduct } from '../cartUtils';
import { PRODUCTS, CATEGORIES_INFO } from '../data';
import ProductCard from './ProductCard';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity: number) => void;
  onInstantBuy: (product: Product, quantity: number) => void;
  cart: { [productId: string]: number };
  initialVisible?: number;
  /** الصفحة الرئيسية: صف واحد في البداية ثم توسّع لأسفل */
  singleRow?: boolean;
}

type CategoryFilter = 'all' | 'meat' | 'processed' | 'poultry' | 'dairy' | 'cheese';

const LOAD_STEP = 8;
const HOME_ROW_SIZE = 4;

const layoutSpring = { type: 'spring' as const, stiffness: 280, damping: 28 };
const expandSpring = { type: 'spring' as const, stiffness: 320, damping: 26 };

export default function ProductCatalog({
  onAddToCart,
  onInstantBuy,
  cart,
  initialVisible = 4,
  singleRow = false,
}: ProductCatalogProps) {
  const INITIAL_VISIBLE = initialVisible;
  const loadStep = singleRow ? HOME_ROW_SIZE : LOAD_STEP;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [animateFromIndex, setAnimateFromIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Find info about active category
  const activeCategoryInfo = useMemo(() => {
    if (activeCategory === 'all') return null;
    return CATEGORIES_INFO.find((c) => c.id === activeCategory);
  }, [activeCategory]);

  // Filter logic (no sorting)
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  // Reset visible cards whenever the filter changes (back to a single row).
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
    setAnimateFromIndex(0);
  }, [activeCategory, searchQuery, INITIAL_VISIBLE]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const isExpanded = visibleCount > INITIAL_VISIBLE;

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const handleShowMore = () => {
    const fromIndex = visibleCount;
    setAnimateFromIndex(fromIndex);
    setVisibleCount((prev) => prev + loadStep);

    window.setTimeout(() => {
      const firstNewCard = gridRef.current?.querySelector(`[data-product-index="${fromIndex}"]`);
      firstNewCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  };

  const handleShowLess = () => {
    setAnimateFromIndex(INITIAL_VISIBLE);
    setVisibleCount(INITIAL_VISIBLE);

    window.setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  };

  const categories = [
    { id: 'all', name: 'الكل', icon: <Layers className="w-4 h-4" /> },
    { id: 'meat', name: 'لحوم طازجة', icon: '🥩' },
    { id: 'processed', name: 'مصنعات لحوم', icon: '🌭' },
    { id: 'poultry', name: 'دواجن طازجة', icon: '🍗' },
    { id: 'dairy', name: 'ألبان وحلويات', icon: '🍮' },
    { id: 'cheese', name: 'الجبن', icon: '🧀' },
  ];

  return (
    <section id="products" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h4 className="text-brand-medium font-extrabold text-sm tracking-widest uppercase mb-3">دليل السلع الطازجة</h4>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">
            منتجاتنا ومصنفاتنا الطازجة
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed">
            تسوّق من خلال نظام تصنيف دقيق للسلع، نوفر لك اللحوم البلدية الفاخرة والمصنعات الآمنة والدواجن ومنتجات الألبان والحلويات الطبيعية بالكامل.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-7">
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">البحث عن المنتجات</label>
            <input
              id="search-input"
              type="text"
              placeholder="ابحث عن: لحم، سجق، بانيه، أرز باللبن..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 focus:border-brand-medium focus:ring-4 focus:ring-brand-light rounded-full outline-none text-sm transition-all text-right font-bold shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Category Tabs (animated pill indicator) */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex flex-wrap justify-center gap-1.5 bg-white p-1.5 rounded-2xl sm:rounded-full border border-slate-150 shadow-sm">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors duration-200 outline-none ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-brand-medium'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-brand-medium rounded-full shadow-md shadow-brand-medium/25"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {typeof cat.icon === 'string' ? (
                      <span className="text-base leading-none">{cat.icon}</span>
                    ) : (
                      cat.icon
                    )}
                    <span>{cat.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result counter + reset */}
        <div className="flex items-center justify-center gap-3 mb-8 text-xs font-bold">
          <span className="text-slate-500">وجدنا {filteredProducts.length} منتج</span>
          {(searchQuery !== '' || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 font-extrabold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/70 py-1.5 px-3 rounded-lg border border-red-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* Selected Department Insight Banner */}
        <AnimatePresence mode="wait">
          {activeCategoryInfo && (
            <motion.div
              key={activeCategoryInfo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5 mb-10 text-right max-w-3xl mx-auto"
            >
              <h3 className="font-extrabold text-brand-dark text-lg mb-1.5">
                تصفح قسم: {activeCategoryInfo.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeCategoryInfo.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid / Row */}
        {filteredProducts.length > 0 ? (
          <>
            <LayoutGroup>
              <motion.div
                ref={gridRef}
                layout
                transition={{ layout: layoutSpring }}
                className={
                  singleRow
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10'
                }
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleProducts.map((p, idx) => {
                    const isNewBatch = idx >= animateFromIndex;
                    const staggerIndex = isNewBatch ? idx - animateFromIndex : 0;

                    return (
                      <motion.div
                        key={p.id}
                        data-product-index={idx}
                        layout
                        initial={
                          isNewBatch
                            ? { opacity: 0, y: 56, scale: 0.9, filter: 'blur(6px)' }
                            : false
                        }
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -28, scale: 0.94, filter: 'blur(4px)' }}
                        transition={{
                          layout: layoutSpring,
                          opacity: { duration: 0.35 },
                          filter: { duration: 0.35 },
                          ...(isNewBatch
                            ? {
                                ...expandSpring,
                                delay: staggerIndex * 0.09,
                              }
                            : { duration: 0.3 }),
                        }}
                      >
                        <ProductCard
                          product={p}
                          onAddToCart={onAddToCart}
                          onInstantBuy={onInstantBuy}
                          quantityInCart={getQtyInCartForProduct(cart, p.id)}
                          disableEntrance
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {/* Show more / less controls */}
            {(hasMore || isExpanded) && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...layoutSpring, delay: 0.05 }}
                className="flex justify-center mt-12"
              >
                {hasMore ? (
                  <motion.button
                    type="button"
                    onClick={handleShowMore}
                    whileTap={{ scale: 0.96 }}
                    className="group flex items-center gap-2.5 bg-white hover:bg-brand-medium text-brand-medium hover:text-white font-extrabold text-sm py-3.5 px-8 rounded-full border-2 border-brand-medium shadow-sm hover:shadow-lg hover:shadow-brand-medium/20 transition-all duration-300 cursor-pointer"
                  >
                    <span>عرض المزيد من المنتجات</span>
                    <ChevronDown className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleShowLess}
                    whileTap={{ scale: 0.96 }}
                    className="group flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-sm py-3.5 px-8 rounded-full border border-slate-200 transition-all duration-300 cursor-pointer"
                  >
                    <span>عرض أقل</span>
                    <ChevronDown className="w-4.5 h-4.5 rotate-180 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-150 text-center max-w-lg mx-auto">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-bold text-slate-800 mb-1.5">عذراً، لم نجد المنتج المطلوب</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              يرجى التحقق من صياغة البحث أو تصفح الأقسام الأخرى للحصول على منتجات مزارعنا الطازجة المتوفرة.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-brand-medium hover:bg-brand-hover text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              عرض جميع السلع المتوفرة
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
