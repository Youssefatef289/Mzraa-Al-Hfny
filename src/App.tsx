import { useState, useEffect, useRef } from 'react';
import { ArrowUp, MessageSquare, PhoneCall, Heart, Award, ShieldAlert, Star, Facebook, Home, Store, ShoppingBag, Phone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Features from './components/Features';
import ProductCatalog from './components/ProductCatalog';
import ReviewsSlider from './components/ReviewsSlider';
import ContactSection from './components/ContactSection';
import CartDrawer from './components/CartDrawer';
import { Product, CartItem } from './types';
import { PRODUCTS, FARM_INFO } from './data';

export default function App() {
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [page, setPage] = useState<'home' | 'products'>('home');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (productName: string) => {
    setToast(productName);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Sync cart State with localStorage for persistent client session
  useEffect(() => {
    const savedCart = localStorage.getItem('alkhafany_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing cart from localStorage:', err);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: { [productId: string]: number }) => {
    setCart(updatedCart);
    localStorage.setItem('alkhafany_cart', JSON.stringify(updatedCart));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    const currentQty = cart[product.id] || 0;
    const updatedCart = {
      ...cart,
      [product.id]: currentQty + quantity,
    };
    saveCartToStorage(updatedCart);
    showToast(product.name);
  };

  const handleUpdateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updatedCart = {
      ...cart,
      [productId]: quantity,
    };
    saveCartToStorage(updatedCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId];
    saveCartToStorage(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToStorage({});
  };

  const handleInstantBuy = (product: Product) => {
    // Add 1 of item if not already in cart, then open cart drawer immediately
    const currentQty = cart[product.id] || 0;
    const updatedCart = {
      ...cart,
      [product.id]: currentQty === 0 ? 1 : currentQty,
    };
    saveCartToStorage(updatedCart);
    setIsCartOpen(true);
    // Focus or trigger cart drawer checkout form
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Navigation between the home page sections and the dedicated products page
  const goToProducts = () => {
    setPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (href: string) => {
    if (href === '#products') {
      goToProducts();
      return;
    }
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else if (href === '#home') {
      scrollToTop();
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Build cart item list
  const cartItems: CartItem[] = Object.keys(cart)
    .map((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return null;
      return {
        product,
        quantity: cart[id],
      };
    })
    .filter((item): item is CartItem => item !== null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen text-slate-800 bg-slate-50 relative flex flex-col justify-between pb-16 md:pb-0">
      {/* Absolute Header with interactive cart info */}
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} onNavigate={handleNavigate} solid={page === 'products'} />

      {/* Main Pages Flow */}
      <main className="flex-grow">
        {page === 'home' ? (
          <>
            {/* 1. Hero Introduction */}
            <Hero />

            {/* 2. About Al-Khafany Farms Section */}
            <AboutSection />

            {/* 3. Features Highlight block with visual cards */}
            <Features />

            {/* 4. Complete Dynamic Categorized Products Catalog */}
            <ProductCatalog
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
              cart={cart}
            />

            {/* 5. Customer Testimonials Slider */}
            <ReviewsSlider />

            {/* 6. Contact details, Form and visual Google Maps */}
            <ContactSection />
          </>
        ) : (
          /* Dedicated Products Page */
          <div className="pt-24 sm:pt-28">
            {/* Page banner */}
            <div className="bg-brand-dark text-white py-12 text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-black mb-3">كل منتجات مزارع الحفني</h1>
              <p className="text-sm text-sky-200 max-w-2xl mx-auto leading-relaxed">
                تصفح التشكيلة الكاملة من اللحوم البلدية والدواجن والمصنعات ومنتجات الألبان والحلويات الطازجة، واطلب ما تريد بسهولة.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('#home')}
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white hover:text-brand-dark border border-white/20 py-2 px-4 rounded-full transition-all cursor-pointer"
              >
                ← العودة للرئيسية
              </button>
            </div>

            <ProductCatalog
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
              cart={cart}
              initialVisible={12}
            />
          </div>
        )}
      </main>

      {/* Footer Section (روابط سريعة، وسائل التواصل، حقوق النشر) */}
      <footer className="bg-brand-dark text-slate-300 py-16 border-t border-slate-900 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
            {/* 1. About the Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center shrink-0">
                  <img
                    src={encodeURI('/images/Logo tab.jpg')}
                    alt="شعار مزارع الحفني"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <span className="text-xl font-black text-white">
                  مزارع الحفني
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                مشروع مزارع وجزارة الحفني هو ثمرة أكثر من خمسة عشر عاماً من الشغف والعمل الجاد في تقديم لحوم بلدية، دواجن، وألبان نقية طازجة من مزارعنا الصديقة للبيئة في بني سويف مباشرة لبيوتكم العامرة.
              </p>
              
              {/* Extra badges for Egyptian local pride */}
              <div className="flex gap-2.5 pt-2 justify-start flex-wrap">
                <span className="text-[10px] font-bold text-sky-200 bg-sky-950 border border-sky-900 py-1 px-3 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-brand-gold animate-pulse text-amber-500" />
                  <span>محصول بلدي 100%</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-250 bg-emerald-950/40 border border-emerald-900 py-1 px-3 rounded-full flex items-center gap-1 text-emerald-400">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>بأيدي مصرية فخورة</span>
                </span>
              </div>
            </div>

            {/* 2. Rapid links */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white border-r-2 border-brand-medium pr-2.5">روابط سريعة تهمك</h4>
              <ul className="space-y-2.5 text-xs font-bold">
                <li>
                  <a href="#home" onClick={(e) => { e.preventDefault(); handleNavigate('#home'); }} className="hover:text-white hover:mr-1 transition-all duration-200 block text-slate-400 cursor-pointer">الرئيسية والترحيب</a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => { e.preventDefault(); handleNavigate('#about'); }} className="hover:text-white hover:mr-1 transition-all duration-200 block text-slate-400 cursor-pointer">من نحن وتاريخ المزرعة</a>
                </li>
                <li>
                  <a href="#products" onClick={(e) => { e.preventDefault(); goToProducts(); }} className="hover:text-white hover:mr-1 transition-all duration-200 block text-slate-400 cursor-pointer">دليل السلع والمنتجات</a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => { e.preventDefault(); handleNavigate('#features'); }} className="hover:text-white hover:mr-1 transition-all duration-200 block text-slate-400 cursor-pointer">مميزاتنا ومبررات الاختيار</a>
                </li>
                <li>
                  <a href="#reviews" onClick={(e) => { e.preventDefault(); handleNavigate('#reviews'); }} className="hover:text-white hover:mr-1 transition-all duration-200 block text-slate-400 cursor-pointer">آراء عملائنا الأفاضل</a>
                </li>
              </ul>
            </div>

            {/* 3. Products categories short links */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white border-r-2 border-brand-medium pr-2.5">أقسام السلع الدقيقة</h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li>
                  <a href="#products" onClick={(e) => { e.preventDefault(); goToProducts(); }} className="hover:text-white block text-slate-400 font-bold cursor-pointer">🥩 قسم اللحوم البلدية الطازجة</a>
                </li>
                <li>
                  <a href="#products" onClick={(e) => { e.preventDefault(); goToProducts(); }} className="hover:text-white block text-slate-400 font-bold cursor-pointer">🌭 قسم مصنعات اللحوم المتميزة</a>
                </li>
                <li>
                  <a href="#products" onClick={(e) => { e.preventDefault(); goToProducts(); }} className="hover:text-white block text-slate-400 font-bold cursor-pointer">🍗 قسم الدواجن والمربيات</a>
                </li>
                <li>
                  <a href="#products" onClick={(e) => { e.preventDefault(); goToProducts(); }} className="hover:text-white block text-slate-400 font-bold cursor-pointer">🍮 قسم الألبان والحلويات</a>
                </li>
              </ul>
            </div>

            {/* 4. Social media & Contacts */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white border-r-2 border-brand-medium pr-2.5">شاركنا وتواصل معنا</h4>
              <p className="text-xs text-slate-400 leading-loose">
                العنوان: {FARM_INFO.address}<br />
                <span dir="ltr">هاتف: {FARM_INFO.phoneFormatted}</span><br />
                <span dir="ltr">واتساب: {FARM_INFO.whatsappFormatted}</span>
              </p>
              
              {/* Social Media icons */}
              <div className="flex gap-3 pt-2 justify-start">
                <a
                  href={`https://wa.me/${FARM_INFO.whatsapp}`}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-350 flex items-center justify-center transition-all duration-300"
                  aria-label="تواصل واتساب"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a
                  href={FARM_INFO.facebook}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-350 flex items-center justify-center transition-all duration-300"
                  aria-label="صفحة فيسبوك"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`tel:${FARM_INFO.phoneFormatted}`}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-350 flex items-center justify-center transition-all duration-300"
                  aria-label="اتصال هاتفي سريع"
                >
                  <PhoneCall className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Divider & SEO metadata lines */}
          <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} لمزارع وجزارة الحفني.</p>
            <p className="text-[11px] text-slate-500">
              تم التصميم والتطوير بواسطة{' '}
              <a
                href="https://protfolio-youssef-atef-marouf.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-sky-300 hover:text-sky-200 transition-colors underline-offset-2 hover:underline"
              >
                يوسف عاطف
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Persistent Shopping Cart Drawer Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating WhatsApp Quick-Help Anchor */}
      <a
        id="whatsapp-float-btn"
        href={`https://wa.me/${FARM_INFO.whatsapp}?text=${encodeURIComponent(
          'السلام عليكم مزارع الحفني، أرغب في الاستفسار عن عروض اللحوم والمنتجات المتوفرة حالياً للتوصيل.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
        aria-label="تواصل واتساب مباشر"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap pl-0 group-hover:pl-2 text-xs font-black">
          تواصل معنا مباشر!
        </span>
        <MessageSquare className="w-6 h-6 fill-white" />
      </a>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="back-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-brand-medium hover:bg-brand-hover text-white rounded-full p-3.5 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
            aria-label="العودة لأعلى الصفحة"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add-to-cart Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm"
          >
            <div className="bg-white border border-emerald-100 shadow-2xl rounded-2xl p-3.5 flex items-center gap-3 text-right">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-[11px] text-slate-400 font-bold leading-none mb-1">تمت الإضافة إلى السلة</p>
                <p className="text-sm font-extrabold text-brand-dark truncate">{toast}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="shrink-0 text-[11px] font-extrabold text-white bg-brand-medium hover:bg-brand-hover px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                عرض السلة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile App-like Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-150 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.08)] ${isCartOpen ? 'hidden' : ''}`}>
        <div className="grid grid-cols-4 items-center">
          <button
            type="button"
            onClick={() => handleNavigate('#home')}
            className={`flex flex-col items-center gap-1 py-2.5 active:scale-95 transition-all cursor-pointer ${page === 'home' ? 'text-brand-medium' : 'text-slate-500 hover:text-brand-medium'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          <button
            type="button"
            onClick={goToProducts}
            className={`flex flex-col items-center gap-1 py-2.5 active:scale-95 transition-all cursor-pointer ${page === 'products' ? 'text-brand-medium' : 'text-slate-500 hover:text-brand-medium'}`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] font-bold">المنتجات</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center gap-1 py-2.5 text-slate-500 hover:text-brand-medium active:scale-95 transition-all cursor-pointer"
          >
            <span className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-[10px] font-bold">السلة</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavigate('#contact')}
            className="flex flex-col items-center gap-1 py-2.5 text-slate-500 hover:text-brand-medium active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-bold">اتصل بنا</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
