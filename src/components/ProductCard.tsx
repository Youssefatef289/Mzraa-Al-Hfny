import React, { useState } from 'react';
import { Star, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onInstantBuy: (product: Product) => void;
  quantityInCart: number;
  key?: any;
}

export default function ProductCard({
  product,
  onAddToCart,
  onInstantBuy,
  quantityInCart,
}: ProductCardProps) {
  // Products sold by weight (لحوم/دواجن/مصنعات) start from نصف كيلو with 0.5 kg steps.
  const isWeight = product.unit === 'كيلو جرام';
  const step = isWeight ? 0.5 : 1;
  const minQty = step;
  const unitShort = isWeight ? 'كجم' : 'قطعة';
  const formatQty = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

  const [localQty, setLocalQty] = useState(step);
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = () => {
    setLocalQty((prev) => Math.round((prev + step) * 100) / 100);
  };

  const handleDecrement = () => {
    setLocalQty((prev) => (prev > minQty ? Math.round((prev - step) * 100) / 100 : prev));
  };

  const handleAddClick = () => {
    onAddToCart(product, localQty);
    setIsAdded(true);
    setLocalQty(step);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Live total based on the selected weight/quantity.
  const lineTotal = Math.round(product.price * localQty * 100) / 100;

  // Encode local image paths (Arabic names + spaces) so the browser can fetch them.
  const imageSrc = product.image.startsWith('/') ? encodeURI(product.image) : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)' }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 shadow-sm group hover:border-sky-100"
    >
      {/* Product Image & Tag (full image, no cropping) */}
      <div className="relative h-80  overflow-hidden bg-white shrink-0 flex items-center justify-center p-2">
        <img
          src={imageSrc}
          alt={product.name}
          className="max-w-300 max-h-full w-auto h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Availability Badge */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-sm py-1.5 px-4 rounded-full">
              غير متوفر حالياً
            </span>
          </div>
        )}

        {/* Custom organic tag if available */}
        {product.tag && product.isAvailable && (
          <span className="absolute top-3 right-3 bg-brand-medium text-white text-[11px] font-extrabold py-1 px-2.5 rounded-full shadow-sm">
            {product.tag}
          </span>
        )}

        {/* Floating Rating Badge */}
        {product.isAvailable && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
            <span className="text-slate-800 font-extrabold text-[11px] leading-none mt-0.5">{product.rating}</span>
          </div>
        )}
      </div>

      {/* Card Content info */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Unit helper (light text) */}
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            سعر الـ {product.unit}
          </span>

          <h3 className="font-extrabold text-base text-brand-dark mb-2 group-hover:text-brand-medium transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price Tag Line */}
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-2xl font-black text-brand-medium">
              {product.price} <span className="text-xs font-bold text-slate-500">ج.م</span>
            </span>
            {quantityInCart > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                في السلة: {formatQty(quantityInCart)} {unitShort}
              </span>
            )}
          </div>

          {/* Quantity selector and checkout actions */}
          {product.isAvailable && (
            <div className="space-y-3">
              {/* Selector */}
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

              {/* Live computed total + weight hint */}
              <div className="flex items-center justify-between text-[11px] font-bold px-1">
                {isWeight ? (
                  <span className="text-slate-400">الطلب من نصف كيلو</span>
                ) : (
                  <span className="text-slate-400">السعر للقطعة</span>
                )}
                <span className="text-brand-medium font-black">
                  الإجمالي: {lineTotal} ج.م
                </span>
              </div>

              {/* Action item buttons */}
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
                  onClick={() => onInstantBuy(product)}
                  className="py-2 px-3 bg-brand-medium hover:bg-brand-hover text-white rounded-xl font-bold text-xs transition-colors duration-200 text-center cursor-pointer shadow-sm shadow-brand-medium/10"
                >
                  اطلب الآن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
