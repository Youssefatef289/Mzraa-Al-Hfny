import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FARM_INFO } from '../data';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (href: string) => void;
  solid?: boolean;
  heroIntegrated?: boolean;
}

export default function Header({
  cartCount,
  onOpenCart,
  onNavigate,
  solid = false,
  heroIntegrated = false,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = scrolled || solid;
  const onHero = heroIntegrated && !isScrolled;

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'من نحن', href: '#about' },
    { name: 'المنتجات', href: '#products' },
    { name: 'مميزاتنا', href: '#features' },
    { name: 'آراء العملاء', href: '#reviews' },
    { name: 'اتصل بنا', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-sky-100'
          : onHero
            ? 'hero-header-glass py-4 sm:py-5 border-b border-white/10'
            : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 ${
                isScrolled
                  ? 'bg-white shadow-md border border-sky-100'
                  : 'bg-white/95 shadow-lg ring-2 ring-white/30'
              }`}
            >
              <img src="/images/logo.png" alt="شعار مزارع الحفني" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`font-black text-base sm:text-lg lg:text-xl tracking-wide transition-colors duration-300 truncate ${
                  isScrolled ? 'text-brand-dark' : 'text-white'
                }`}
              >
                مزارع الحفني
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-medium transition-colors duration-300 truncate ${
                  isScrolled ? 'text-brand-medium' : 'text-sky-200/90'
                }`}
              >
                جزارة وألبان ودواجن طازجة
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-semibold text-sm whitespace-nowrap transition-all duration-200 relative py-1 after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-sky-400 after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled ? 'text-slate-700 hover:text-brand-medium' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="cart-toggle-btn"
              onClick={onOpenCart}
              className={`relative p-2 sm:p-2.5 rounded-full shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-center hover:scale-105 ${
                isScrolled
                  ? 'bg-sky-50 text-brand-medium hover:bg-brand-medium hover:text-white'
                  : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/15'
              }`}
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <a
              href={`tel:${FARM_INFO.phoneFormatted}`}
              className={`hidden lg:flex items-center gap-2 font-bold text-xs py-2 px-3 xl:px-4 rounded-full border shadow-sm transition-all duration-300 whitespace-nowrap ${
                isScrolled
                  ? 'border-brand-medium text-brand-medium bg-sky-50 hover:bg-brand-medium hover:text-white'
                  : 'border-white/25 text-white bg-white/5 hover:bg-white/15'
              }`}
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">اتصل للحجز: {FARM_INFO.phoneFormatted}</span>
              <span className="xl:hidden">{FARM_INFO.phoneFormatted}</span>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg xl:hidden cursor-pointer transition-colors duration-200 ${
                isScrolled ? 'text-brand-dark' : 'text-white'
              }`}
              aria-label="القائمة"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet menu — glass style on hero */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className={`xl:hidden overflow-hidden border-t ${
              onHero
                ? 'hero-mobile-menu border-white/10'
                : 'bg-white border-slate-100 shadow-lg'
            }`}
          >
            <div className="px-4 pt-3 pb-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`block font-bold py-3 px-4 rounded-xl transition-all duration-200 ${
                    onHero
                      ? 'text-white/95 hover:bg-white/10 hover:text-white'
                      : 'text-slate-700 hover:bg-sky-50 hover:text-brand-medium'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className={`pt-3 mt-2 border-t px-1 ${onHero ? 'border-white/10' : 'border-slate-100'}`}>
                <a
                  href={`tel:${FARM_INFO.phoneFormatted}`}
                  className={`flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl shadow-sm transition-colors ${
                    onHero
                      ? 'bg-sky-500/90 hover:bg-sky-400 text-white'
                      : 'bg-brand-medium hover:bg-brand-hover text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصل الآن: {FARM_INFO.phoneFormatted}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
