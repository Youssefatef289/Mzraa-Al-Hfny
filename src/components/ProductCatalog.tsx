import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, RefreshCw, Layers, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { getQtyInCartForProduct } from '../cartUtils';
import { CATEGORIES_INFO } from '../data';
import { useProductsContext } from '../context/ProductsProvider';
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

type CategoryFilter = 'all' | 'offers' | 'meat' | 'processed' | 'poultry' | 'dairy' | 'cheese';

const LOAD_STEP = 8;
const HOME_ROW_SIZE = 4;

/** Order used when "الكل" is selected — meat first. */
const CATEGORY_ORDER: Product['category'][] = [
  'meat',
  'processed',
  'poultry',
  'dairy',
  'cheese',
];

function sortByCategoryOrder(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    if (ai !== bi) return ai - bi;
    return a.id.localeCompare(b.id);
  });
}

function ProductSkeleton({ singleRow }: { singleRow: boolean }) {
  const count = singleRow ? HOME_ROW_SIZE : 6;
  return (
    <div
      className={
        singleRow
          ? 'grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-8'
          : 'grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-8'
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-slate-200" />
          <div className="p-2.5 sm:p-4 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-3/4 mr-auto" />
            <div className="h-3 bg-slate-100 rounded w-1/2 mr-auto" />
            <div className="h-7 bg-slate-200 rounded-lg w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

const layoutSpring = { type: 'spring' as const, stiffness: 280, damping: 28 };
const expandSpring = { type: 'spring' as const, stiffness: 320, damping: 26 };

export default function ProductCatalog({
  onAddToCart,
  onInstantBuy,
  cart,
  initialVisible = 4,
  singleRow = false,
}: ProductCatalogProps) {
  const { products, loading } = useProductsContext();
  const INITIAL_VISIBLE = initialVisible;
  const loadStep = singleRow ? HOME_ROW_SIZE : LOAD_STEP;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [animateFromIndex, setAnimateFromIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<Partial<Record<CategoryFilter, HTMLButtonElement | null>>>({});

  // Keep the active tab visible/centered when navigating forward or back
  useEffect(() => {
    const container = tabsScrollRef.current;
    const activeBtn = tabBtnRefs.current[activeCategory];
    if (!container || !activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offset =
      btnRect.left -
      containerRect.left -
      containerRect.width / 2 +
      btnRect.width / 2 +
      container.scrollLeft;

    container.scrollTo({ left: offset, behavior: 'smooth' });
  }, [activeCategory]);

  const selectCategory = (id: CategoryFilter) => {
    setActiveCategory(id);
  };

  const isOfferProduct = (product: Product) =>
    product.tag?.toLowerCase().includes('عرض') ||
    (!!product.originalPrice && product.originalPrice > product.price);

  // Find info about active category
  const activeCategoryInfo = useMemo(() => {
    if (activeCategory === 'all') return null;
    return CATEGORIES_INFO.find((c) => c.id === activeCategory);
  }, [activeCategory]);

  // Filter + sort (meat first when viewing all)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory === 'offers') {
      result = result.filter(isOfferProduct);
    } else if (activeCategory !== 'all') {
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

    return sortByCategoryOrder(result);
  }, [searchQuery, activeCategory, products]);

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
    selectCategory('all');
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
    { id: 'all' as const, name: 'الكل', short: 'الكل', icon: <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
    { id: 'offers' as const, name: 'العروض الخاصة', short: 'عروض', icon: '🔥' },
    { id: 'meat' as const, name: 'لحوم طازجة', short: 'لحوم', icon: '🥩' },
    { id: 'processed' as const, name: 'مصنعات لحوم', short: 'مصنعات', icon: '🌭' },
    { id: 'poultry' as const, name: 'دواجن طازجة', short: 'دواجن', icon: '🍗' },
    { id: 'dairy' as const, name: 'ألبان وحلويات', short: 'ألبان', icon: '🍮' },
    { id: 'cheese' as const, name: 'الجبن', short: 'جبن', icon: '🧀' },
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
        <div className="max-w-xl mx-auto mb-5 sm:mb-7">
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

        {/* Category Tabs — scrollable chips on mobile, centered on desktop */}
        <div className="mb-4 flex justify-center">
          <div
            ref={tabsScrollRef}
            className="w-full max-w-3xl -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none scroll-smooth"
          >
            <div className="flex justify-start sm:justify-center gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap bg-white p-1.5 rounded-2xl border border-slate-150 shadow-sm mx-auto w-max max-w-none sm:max-w-full">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    ref={(el) => {
                      tabBtnRefs.current[cat.id] = el;
                    }}
                    onClick={() => selectCategory(cat.id)}
                    className={`relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors duration-200 outline-none whitespace-nowrap ${
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
                    <span className="relative z-10 flex items-center gap-1.5">
                      {typeof cat.icon === 'string' ? (
                        <span className="text-sm sm:text-base leading-none">{cat.icon}</span>
                      ) : (
                        cat.icon
                      )}
                      <span className="sm:hidden">{cat.short}</span>
                      <span className="hidden sm:inline">{cat.name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
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
        {loading ? (
          <ProductSkeleton singleRow={singleRow} />
        ) : filteredProducts.length > 0 ? (
          <>
            <LayoutGroup>
              <motion.div
                ref={gridRef}
                layout
                transition={{ layout: layoutSpring }}
                className={
                  singleRow
                    ? 'grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-8'
                    : 'grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-8'
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
