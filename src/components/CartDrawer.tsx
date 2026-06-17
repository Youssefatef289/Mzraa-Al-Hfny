import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { FARM_INFO } from '../data';
import { formatCheesePortionLabel, formatQty, getCartItemStep, getWeightQuantityConfig, isCheeseProduct } from '../cartUtils';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartKey: string, quantity: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Cart, 2: Checkout Form, 3: Completed Receipt
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    phone: '',
    orderType: 'delivery',
    address: '',
    deliveryTime: '',
    paymentMethod: 'cash',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Total price (no delivery fee)
  const totalAmount = Math.round(
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100
  ) / 100;

  const orderTypeLabels: Record<OrderDetails['orderType'], string> = {
    delivery: 'توصيل للمنزل (Delivery)',
    pickup: 'استلام من الفرع (Pickup)',
    dinein: 'تناول داخل الفرع (Dine in)',
  };

  const paymentLabels: Record<OrderDetails['paymentMethod'], string> = {
    cash: 'الدفع عند الاستلام',
    vodafone: 'فودافون كاش',
    instapay: 'انستا باي / InstaPay',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    setStep(2);
  };

  // Build the WhatsApp order message text
  const buildWhatsAppMessage = (invoiceId: string) => {
    let messageText = `*طلب جديد من مزارع الحفني*\n`;
    messageText += `------------------------------------\n`;
    messageText += `*رقم الفاتورة:* #${invoiceId}\n`;
    messageText += `*الاسم:* ${formData.fullName}\n`;
    messageText += `*الهاتف:* ${formData.phone}\n`;
    messageText += `🧾 *نوع الطلب:* ${orderTypeLabels[formData.orderType]}\n`;
    if (formData.orderType === 'delivery') {
      messageText += `📍 *العنوان:* ${formData.address}\n`;
    }
    if (formData.deliveryTime) {
      messageText += `📅 *الموعد المطلوب:* ${formData.deliveryTime}\n`;
    }
    messageText += `💳 *طريقة الدفع:* ${paymentLabels[formData.paymentMethod]}\n`;
    if (formData.notes) {
      messageText += `📝 *ملاحظات:* ${formData.notes}\n`;
    }
    messageText += `------------------------------------\n`;
    messageText += `*🛒 تفاصيل السلع المطلوبة:*\n`;

    cartItems.forEach((item, index) => {
      const lineTotal = Math.round(item.product.price * item.quantity * 100) / 100;
      const qtyLabel = isCheeseProduct(item.product)
        ? formatCheesePortionLabel(item.portionKg, item.quantity)
        : `${formatQty(item.quantity)} ${item.product.unit === 'كيلو جرام' ? 'كجم' : 'قطعة'}`;
      messageText += `${index + 1}. ${item.product.name} (${qtyLabel}) - ${lineTotal} ج.م\n`;
    });

    messageText += `------------------------------------\n`;
    messageText += `💵 *إجمالي الحساب:* ${totalAmount} ج.م\n`;
    messageText += `------------------------------------\n`;
    messageText += `شكراً لكم مزارع الحفني على الخدمة المتميزة! 💚`;

    return messageText;
  };

  const sendToWhatsApp = (invoiceId: string) => {
    const encodedText = encodeURIComponent(buildWhatsAppMessage(invoiceId));
    const whatsappUrl = `https://wa.me/${FARM_INFO.whatsapp}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName === '' || formData.phone === '') return;
    if (formData.orderType === 'delivery' && formData.address === '') return;

    setLoading(true);
    setTimeout(() => {
      const newId = 'KHF-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newId);
      setLoading(false);
      // Send the order straight to WhatsApp on confirmation
      sendToWhatsApp(newId);
      setStep(3);
    }, 800);
  };

  const handleSendWhatsApp = () => {
    sendToWhatsApp(orderId || 'KHF-' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleFinishAndReset = () => {
    onClearCart();
    setStep(1);
    setFormData({
      fullName: '',
      phone: '',
      orderType: 'delivery',
      address: '',
      deliveryTime: '',
      paymentMethod: 'cash',
      notes: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60] cursor-pointer"
          />

          {/* Drawer Body Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-[70] flex flex-col focus:outline-none"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
                aria-label="إغلاق السلة"
              >
                <X className="w-5.5 h-5.5" />
              </button>

              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-medium" />
                <span className="font-extrabold text-slate-800 text-base">سلة طلباتك</span>
                {cartItems.length > 0 && (
                  <span className="bg-brand-medium text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </div>

            {/* Stepper bar visual */}
            <div className="bg-slate-100/65 border-b border-slate-200/50 px-5 py-2.5 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className={step === 1 ? 'text-brand-medium' : 'text-slate-400'}>١. مراجعة السلع</span>
              <span className="text-slate-350">←</span>
              <span className={step === 2 ? 'text-brand-medium' : 'text-slate-400'}>٢. بيانات التوصيل</span>
              <span className="text-slate-350">←</span>
              <span className={step === 3 ? 'text-brand-medium' : 'text-slate-400'}>٣. فاتورة التأكيد</span>
            </div>

            {/* Drawer Body (Steps routing) */}
            <div className="flex-grow overflow-y-auto p-5 text-right">
              {/* STEP 1: CART REVISION */}
              {step === 1 && (
                <>
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => {
                        const isCheese = isCheeseProduct(item.product);
                        const isWeight = item.product.unit === 'كيلو جرام' && !isCheese;
                        const step = getCartItemStep(item.product, item.portionKg);
                        const minQty = getWeightQuantityConfig(item.product).min;
                        const unitShort = item.product.unit === 'كيلو جرام' ? 'كجم' : 'قطعة';
                        const fmt = formatQty;
                        const imgSrc = item.product.image.startsWith('/')
                          ? encodeURI(item.product.image)
                          : item.product.image;
                        const lineTotal = Math.round(item.product.price * item.quantity * 100) / 100;
                        const qtyDisplay = isCheese
                          ? formatCheesePortionLabel(item.portionKg, item.quantity)
                          : `${fmt(item.quantity)} ${unitShort}`;
                        return (
                        <div
                          key={item.cartKey}
                          className="flex items-center gap-4 p-3.5 bg-slate-55 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          {/* Product thumbnail (full image) */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white border border-slate-100 flex items-center justify-center p-1">
                            <img
                              src={imgSrc}
                              alt={item.product.name}
                              className="max-w-full max-h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Info Column */}
                          <div className="flex-grow">
                            <h4 className="font-extrabold text-slate-850 text-sm leading-snug">
                              {item.product.name}
                            </h4>
                            <span className="text-xs font-bold text-slate-400 block mt-0.5">
                              {item.product.price} ج.م / {item.product.unit}
                            </span>
                            <span className="text-xs font-black text-brand-medium block mt-1">
                              المجموع: {lineTotal} ج.م
                            </span>
                          </div>

                          {/* Quantity Modifier and delete controls */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.cartKey)}
                              className="text-slate-350 hover:text-red-500 cursor-pointer p-1 rounded transition-colors"
                              aria-label="حذف السلعة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Up down selector */}
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQty(
                                    item.cartKey,
                                    Math.round((item.quantity - step) * 1000) / 1000
                                  )
                                }
                                disabled={item.quantity <= minQty}
                                className="w-6 h-6 rounded bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black text-slate-800 min-w-[2.5rem] text-center">
                                {isCheese ? qtyDisplay : `${fmt(item.quantity)} ${unitShort}`}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQty(
                                    item.cartKey,
                                    Math.round((item.quantity + step) * 1000) / 1000
                                  )
                                }
                                className="w-6 h-6 rounded bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <h3 className="text-slate-850 font-bold text-base">سلة طلباتك فارغة تماماً</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                        تصفح دليل السلع الفاخرة الطازجة وقم بإضافة أفضل أنواع اللحوم ومصنفاتها لمشترياتك الحالية.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-brand-medium hover:bg-brand-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm shadow-brand-medium/10"
                      >
                        ابدأ التسوق الآن
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: ORDER DETAILS */}
              {step === 2 && (
                <form onSubmit={handleSubmitOrder} className="space-y-5 pt-1">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-1">بيانات الطلب</h3>
                    <p className="text-xs text-slate-500 leading-normal">
                      أكمل بياناتك وسيتم إرسال الطلب مباشرةً على واتساب المزرعة لتأكيده.
                    </p>
                  </div>

                  {/* Name field */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1.5">الاسم *</label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="اكتب اسمك"
                      className="w-full pr-4.5 pl-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold"
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف *</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01xxxxxxxxx"
                      className="w-full pr-4.5 pl-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold"
                    />
                  </div>

                  {/* Order type */}
                  <div>
                    <span className="block text-xs font-bold text-slate-700 mb-2">نوع الطلب *</span>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: 'delivery', label: 'توصيل' },
                        { value: 'pickup', label: 'استلام' },
                        { value: 'dinein', label: 'بالفرع' },
                      ] as const).map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                            formData.orderType === opt.value
                              ? 'border-brand-medium bg-sky-50/50 text-brand-medium font-extrabold'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="orderType"
                            value={opt.value}
                            checked={formData.orderType === opt.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-xs">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Address (delivery only) */}
                  {formData.orderType === 'delivery' && (
                    <div>
                      <label htmlFor="address" className="block text-xs font-bold text-slate-700 mb-1.5">العنوان بالتفصيل *</label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="اسم الشارع، رقم العمارة، الطابق وأقرب علامة مميزة"
                        className="w-full pr-4.5 pl-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold"
                      />
                    </div>
                  )}

                  {/* Payment method */}
                  <div>
                    <span className="block text-xs font-bold text-slate-700 mb-2">طريقة الدفع *</span>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { value: 'cash', label: 'الدفع عند الاستلام' },
                        { value: 'vodafone', label: 'فودافون كاش' },
                        { value: 'instapay', label: 'انستا باي / InstaPay' },
                      ] as const).map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-2 justify-start p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            formData.paymentMethod === opt.value
                              ? 'border-brand-medium bg-sky-50/50 text-brand-medium font-extrabold'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={opt.value}
                            checked={formData.paymentMethod === opt.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                            formData.paymentMethod === opt.value ? 'border-brand-medium bg-brand-medium' : 'border-slate-300'
                          }`} />
                          <span className="text-xs">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Delivery time (free text) */}
                  <div>
                    <label htmlFor="deliveryTime" className="block text-xs font-bold text-slate-700 mb-1.5">الموعد المطلوب للتسليم</label>
                    <input
                      id="deliveryTime"
                      type="text"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      placeholder="مثال: اليوم الساعة ٨ مساءً، أو غداً صباحاً..."
                      className="w-full pr-4.5 pl-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold"
                    />
                  </div>

                  {/* Notes message */}
                  <div>
                    <label htmlFor="notes" className="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="ملاحظات التقطيع أو أي تفضيلات خاصة..."
                      className="w-full pr-4 pl-4 py-2 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold resize-none"
                    />
                  </div>

                  {/* Bottom Checkout trigger */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>جاري تجهيز الطلب...</span>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 fill-white" />
                          <span>تأكيد وإرسال الطلب على الواتساب</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs text-center cursor-pointer"
                    >
                      العودة للسلع
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: ORDER COMPLETED RECEIPT */}
              {step === 3 && (
                <div className="py-6 text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-emerald-800 font-extrabold text-xl leading-tight">تم إرسال طلبك بنجاح</h3>
                    <p className="text-[11px] text-slate-400 font-bold block">رقم طلبك الداخلي: #{orderId}</p>
                  </div>

                  {/* Summary Recipe Card styled beautifully */}
                  <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-5 text-right space-y-3 font-medium">
                    <p className="text-xs text-slate-650 flex justify-between">
                      <span className="font-bold text-slate-800">{formData.fullName}</span>
                      <span className="text-slate-400">اسم العميل:</span>
                    </p>
                    <p className="text-xs text-slate-650 flex justify-between">
                      <span className="font-bold text-slate-800" dir="ltr">{formData.phone}</span>
                      <span className="text-slate-400">رقم التواصل:</span>
                    </p>
                    <p className="text-xs text-slate-650 flex justify-between">
                      <span className="font-bold text-slate-800">{orderTypeLabels[formData.orderType]}</span>
                      <span className="text-slate-400">نوع الطلب:</span>
                    </p>
                    {formData.orderType === 'delivery' && (
                      <p className="text-xs text-slate-650 flex justify-between">
                        <span className="font-bold text-slate-800 leading-normal">{formData.address}</span>
                        <span className="text-slate-400 shrink-0">العنوان:</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-650 flex justify-between">
                      <span className="font-bold text-slate-800">{paymentLabels[formData.paymentMethod]}</span>
                      <span className="text-slate-400">طريقة الدفع:</span>
                    </p>
                    <p className="text-xs text-slate-650 flex justify-between border-t border-slate-250 pt-2">
                      <span className="font-bold text-slate-800">{cartItems.length} سلعة طازجة</span>
                      <span className="text-slate-400">عدد المنتجات:</span>
                    </p>
                    <p className="text-xs text-emerald-700 font-extrabold flex justify-between text-base">
                      <span>{totalAmount} ج.م</span>
                      <span>الحساب الإجمالي:</span>
                    </p>
                  </div>

                  {/* WhatsApp Dispatcher (resend) */}
                  <div className="space-y-3.5 pt-3">
                    <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl text-right">
                      <h4 className="font-extrabold text-emerald-800 text-xs mb-1.5 flex items-center gap-1.5 justify-start">
                        <MessageSquare className="w-4 h-4 text-emerald-600 animate-pulse" />
                        <span>تم فتح واتساب بتفاصيل طلبك</span>
                      </h4>
                      <p className="text-[10px] text-emerald-750 leading-relaxed font-semibold">
                        إذا لم يفتح الواتساب تلقائياً، اضغط على الزر بالأسفل لإرسال تفاصيل الطلب لإدارة المزرعة وتأكيد الحجز.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:-translate-y-0.5"
                    >
                      <MessageSquare className="w-5 h-5 fill-white" />
                      <span>إعادة إرسال الطلب للواتساب</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishAndReset}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-brand-dark rounded-xl font-bold text-xs cursor-pointer"
                    >
                      العودة للمتجر الرئيسي
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Price Summary (Fixed display, only during step 1 & 2) */}
            {step < 3 && cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 shrink-0 text-right">
                <div className="flex justify-between text-base font-black text-brand-dark">
                  <span className="text-brand-medium">{totalAmount} ج.م</span>
                  <span>الإجمالي الكلي:</span>
                </div>

                {/* Primary Button Route */}
                {step === 1 && (
                  <button
                    type="button"
                    onClick={handleGoToCheckout}
                    className="w-full py-4 bg-brand-medium hover:bg-brand-hover text-white rounded-xl font-extrabold text-sm shadow-md cursor-pointer transition-colors"
                  >
                    الانتقال لتأكيد الطلب
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
