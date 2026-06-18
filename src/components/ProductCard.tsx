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
    'rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 group';

  const cardContent = (
    <>
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100/40 shrink-0">
        <img
          src={imageSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-sm py-1.5 px-4 rounded-full">
              غير متوفر حالياً
            </span>
          </div>
        )}
        {product.tag && product.isAvailable && (
          <span className="absolute top-3 right-3 bg-brand-medium text-white text-[11px] font-extrabold py-1 px-2.5 rounded-full shadow-sm">
            {product.tag}
          </span>
        )}
        {product.isAvailable && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
            <span className="text-slate-800 font-extrabold text-[11px] leading-none mt-0.5">{product.rating}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {isCheese ? 'سعر الكيلو' : `سعر الـ ${product.unit}`}
          </span>
          <h3 className="font-extrabold text-base text-brand-dark mb-2 group-hover:text-brand-medium transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-2xl font-black text-brand-medium">
              {isCheese ? lineTotal : product.price}{' '}
              <span className="text-xs font-bold text-slate-500">ج.م</span>
            </span>
            {isCheese && (
              <span className="text-[10px] font-bold text-slate-400">
                {product.price} ج.م / كجم
              </span>
            )}
            {quantityInCart > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                في السلة: {formatQty(quantityInCart)} {unitShort}
              </span>
            )}
          </div>

          {product.isAvailable && (
            <div className="space-y-3">
              {isCheese ? (
                <div className="grid grid-cols-4 gap-1.5">
                  {CHEESE_PORTIONS.map((portion) => {
                    const selected = selectedPortion === portion.value;
                    const portionPrice = Math.round(product.price * portion.value * 100) / 100;
                    return (
                      <button
                        key={portion.label}
                        type="button"
                        onClick={() => setSelectedPortion(portion.value)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                          selected
                            ? 'bg-brand-medium text-white border-brand-medium shadow-md shadow-brand-medium/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-light hover:bg-sky-50'
                        }`}
                      >
                        <span className="text-[11px] font-black leading-tight">{portion.label}</span>
                        <span className={`text-[10px] font-bold mt-0.5 ${selected ? 'text-white/90' : 'text-slate-400'}`}>
                          {portion.value}
                        </span>
                        <span className={`text-[9px] font-extrabold mt-1 ${selected ? 'text-sky-100' : 'text-brand-medium'}`}>
                          {portionPrice} ج
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={localQty <= minQty}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={isWeight ? 'تقليل الوزن نصف كيلو' : 'تقليل الكمية'}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex items-baseline gap-1 font-extrabold text-slate-800 text-sm">
                    <span>{formatQty(localQty)}</span>
                    <span className="text-[10px] font-medium text-slate-500">{unitShort}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
                    aria-label={isWeight ? 'زيادة الوزن نصف كيلو' : 'زيادة الكمية'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-bold px-1">
                {isCheese ? (
                  <span className="text-slate-400">
                    {CHEESE_PORTIONS.find((p) => p.value === selectedPortion)?.label} ({selectedPortion} كجم)
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

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddClick}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-brand-light text-slate-700 hover:text-brand-medium border border-transparent hover:border-sky-100'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>سلة</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onInstantBuy(product, activeQty)}
                  className="py-2 px-3 bg-brand-medium hover:bg-brand-hover text-white rounded-xl font-bold text-xs transition-colors duration-200 text-center cursor-pointer shadow-sm shadow-brand-medium/10"
                >
                  اطلب الآن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (disableEntrance) {
    return (
      <div className={cardClassName}>
        {cardContent}
      </div>
    );
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
