import React, { useState, useMemo, useEffect } from 'react';
import { Search, RefreshCw, Layers, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES_INFO } from '../data';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity: number) => void;
  onInstantBuy: (product: Product) => void;
  cart: { [productId: string]: number };
  initialVisible?: number;
}

type CategoryFilter = 'all' | 'meat' | 'processed' | 'poultry' | 'dairy';

const LOAD_STEP = 8;

export default function ProductCatalog({
  onAddToCart,
  onInstantBuy,
  cart,
  initialVisible = 4,
}: ProductCatalogProps) {
  const INITIAL_VISIBLE = initialVisible; // صف واحد على الشاشات الكبيرة (افتراضياً)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

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
  }, [activeCategory, searchQuery]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const isExpanded = visibleCount > INITIAL_VISIBLE;

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + LOAD_STEP);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE);
  };

  const categories = [
    { id: 'all', name: 'الكل', icon: <Layers className="w-4 h-4" /> },
    { id: 'meat', name: 'لحوم طازجة', icon: '🥩' },
    { id: 'processed', name: 'مصنعات لحوم', icon: '🌭' },
    { id: 'poultry', name: 'دواجن طازجة', icon: '🍗' },
    { id: 'dairy', name: 'ألبان وحلويات', icon: '🍮' },
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.3, delay: (idx % LOAD_STEP) * 0.04 }}
                  >
                    <ProductCard
                      product={p}
                      onAddToCart={onAddToCart}
                      onInstantBuy={onInstantBuy}
                      quantityInCart={cart[p.id] || 0}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Show more / less controls */}
            {(hasMore || isExpanded) && (
              <div className="flex justify-center mt-12">
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
              </div>
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
