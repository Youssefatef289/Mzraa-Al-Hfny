import React, { useState } from 'react';
import { Star, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { CHEESE_PORTIONS, formatQty, getWeightQuantityConfig, isCheeseProduct } from '../cartUtils';
import { getProductImageUrl } from '../imageUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onInstantBuy: (product: Product, quantity: number) => void;
  quantityInCart: number;
  disableEntrance?: boolean;
  key?: any;
}

export default function ProductCard({
  product,
  onAddToCart,
  onInstantBuy,
  quantityInCart,
  disableEntrance = false,
}: ProductCardProps) {
  const isCheese = isCheeseProduct(product);
  const isWeight = product.unit === 'كيلو جرام' && !isCheese;
  const { step, min: minQty } = getWeightQuantityConfig(product);
  const unitShort = product.unit === 'كيلو جرام' ? 'كجم' : 'قطعة';

  const [selectedPortion, setSelectedPortion] = useState(CHEESE_PORTIONS[1].value);
  const [localQty, setLocalQty] = useState(isCheese ? CHEESE_PORTIONS[1].value : minQty);
  const [isAdded, setIsAdded] = useState(false);

  const activeQty = isCheese ? selectedPortion : localQty;

  const handleIncrement = () => {
    setLocalQty((prev) => Math.round((prev + step) * 100) / 100);
  };

  const handleDecrement = () => {
    setLocalQty((prev) => (prev > minQty ? Math.round((prev - step) * 100) / 100 : prev));
  };

  const handleAddClick = () => {
    onAddToCart(product, activeQty);
    setIsAdded(true);
    if (!isCheese) setLocalQty(minQty);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const lineTotal = Math.round(product.price * activeQty * 100) / 100;
  const imageSrc = getProductImageUrl(product.image);

  const cardClassName =
    'bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-slate-100 shadow-sm transition-all duration-300 group';

  const cardContent = (
    <>
      <div className="relative w-full aspect-square overflow-hidden bg-slate-50 shrink-0">
        <img
          src={imageSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-[10px] sm:text-sm py-1 px-2.5 sm:px-4 rounded-full">
              غير متوفر
            </span>
          </div>
        )}
        {/* Render standard tag only if it's NOT an offer tag */}
        {product.tag && product.tag !== 'عرض' && product.isAvailable && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-white text-[9px] sm:text-[11px] font-black py-1 px-2.5 sm:px-3.5 rounded-lg shadow-sm bg-brand-medium border border-brand-hover/30">
            {product.tag}
          </span>
        )}

        {/* Offer corner ribbon */}
        {product.isAvailable && (product.tag === 'عرض' || (product.originalPrice && product.originalPrice > product.price)) && (
          <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 sm:w-20 sm:h-20 z-10 pointer-events-none">
            <div className="absolute transform rotate-45 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[8px] sm:text-[10px] font-black text-center py-1 w-24 sm:w-28 -right-6 sm:-right-7 top-2.5 sm:top-3.5 shadow-md border-b border-white/10 select-none">
              {product.originalPrice && product.originalPrice > product.price ? (
                `خصم ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
              ) : (
                'عرض خاص'
              )}
            </div>
          </div>
        )}
        {product.isAvailable && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-0.5 shadow-sm">
            <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-brand-gold text-brand-gold" />
            <span className="text-slate-800 font-extrabold text-[9px] sm:text-[11px] leading-none">
              {product.rating}
            </span>
          </div>
        )}
      </div>

      <div className="p-2 sm:p-5 flex-grow flex flex-col justify-between gap-2 sm:gap-0">
        <div>
          <h3 className="font-extrabold text-[12px] sm:text-base text-brand-dark leading-snug line-clamp-2 mb-1 sm:mb-2 group-hover:text-brand-medium transition-colors">
            {product.name}
          </h3>
          <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2 sm:mb-4 gap-1">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-base sm:text-2xl font-black text-brand-medium leading-none">
                {isCheese ? lineTotal : product.price}{' '}
                <span className="text-[9px] sm:text-xs font-bold text-slate-500">ج.م</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] sm:text-sm font-bold text-slate-400 line-through">
                    {isCheese
                      ? Math.round(product.originalPrice * activeQty * 100) / 100
                      : product.originalPrice}{' '}
                    ج.م
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/70">
                    وفر {Math.round((isCheese ? product.originalPrice * activeQty - product.price * activeQty : product.originalPrice - product.price) * 100) / 100} ج.م
                  </span>
                </div>
              )}
            </div>
            {quantityInCart > 0 && (
              <span className="hidden sm:inline text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                في السلة: {formatQty(quantityInCart)} {unitShort}
              </span>
            )}
          </div>

          {product.isAvailable && (
            <div className="space-y-1.5 sm:space-y-3">
              {isCheese ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                  {CHEESE_PORTIONS.map((portion) => {
                    const selected = selectedPortion === portion.value;
                    const portionPrice = Math.round(product.price * portion.value * 100) / 100;
                    return (
                      <button
                        key={portion.label}
                        type="button"
                        onClick={() => setSelectedPortion(portion.value)}
                        className={`flex flex-col items-center justify-center py-1 sm:py-2 px-0.5 sm:px-1 rounded-lg sm:rounded-xl border text-center transition-all cursor-pointer ${
                          selected
                            ? 'bg-brand-medium text-white border-brand-medium shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span className="text-[9px] sm:text-[11px] font-black leading-tight">
                          {portion.label}
                        </span>
                        <span
                          className={`text-[8px] sm:text-[10px] font-extrabold mt-0.5 ${
                            selected ? 'text-sky-100' : 'text-brand-medium'
                          }`}
                        >
                          {portionPrice} ج
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 rounded-lg sm:rounded-xl p-1 sm:p-1.5 border border-slate-100">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={localQty <= minQty}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200 cursor-pointer disabled:opacity-40"
                    aria-label={isWeight ? 'تقليل الوزن' : 'تقليل الكمية'}
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <div className="flex items-baseline gap-0.5 font-extrabold text-slate-800 text-[11px] sm:text-sm">
                    <span>{formatQty(localQty)}</span>
                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">
                      {unitShort}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200 cursor-pointer"
                    aria-label={isWeight ? 'زيادة الوزن' : 'زيادة الكمية'}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              <div className="hidden sm:flex items-center justify-between text-[11px] font-bold px-1">
                {isCheese ? (
                  <span className="text-slate-400">
                    {CHEESE_PORTIONS.find((p) => p.value === selectedPortion)?.label} (
                    {selectedPortion} كجم)
                  </span>
                ) : isWeight ? (
                  <span className="text-slate-400">
                    {minQty >= 1 ? 'الطلب من كيلو واحد' : 'الطلب من نصف كيلو'}
                  </span>
                ) : (
                  <span className="text-slate-400">السعر للقطعة</span>
                )}
                <span className="text-brand-medium font-black">الإجمالي: {lineTotal} ج.م</span>
              </div>

              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={handleAddClick}
                  className={`py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-100'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>تم</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>سلة</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onInstantBuy(product, activeQty)}
                  className="py-1.5 sm:py-2 px-1 sm:px-3 bg-brand-medium hover:bg-brand-hover text-white rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-colors cursor-pointer"
                >
                  اطلب
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (disableEntrance) {
    return <div className={cardClassName}>{cardContent}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -4 }}
      className={cardClassName}
    >
      {cardContent}
    </motion.div>
  );
}
