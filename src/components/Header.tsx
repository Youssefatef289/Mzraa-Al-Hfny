import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FARM_INFO } from '../data';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (href: string) => void;
  solid?: boolean;
}

export default function Header({ cartCount, onOpenCart, onNavigate, solid = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Force the solid (light) header style on pages without a dark hero behind it.
  const isScrolled = scrolled || solid;

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="flex items-center gap-2.5 group">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 ${
                isScrolled ? 'bg-white shadow-md border border-sky-100' : 'bg-white/95 shadow-lg ring-2 ring-white/40'
              }`}
            >
              <img
                src="/images/logo.png"
                alt="شعار مزارع الحفني"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-xl tracking-wide transition-colors duration-300 ${isScrolled ? 'text-brand-dark' : 'text-white'}`}>
                مزارع الحفني
              </span>
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isScrolled ? 'text-brand-medium' : 'text-sky-200'}`}>
                جزارة وألبان ودواجن طازجة
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-semibold text-sm transition-all duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-medium after:transition-all after:duration-300 hover:after:w-full ${
                  isScrolled
                    ? 'text-slate-700 hover:text-brand-medium'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Cart & Contact CTA */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={onOpenCart}
              className={`relative p-2.5 rounded-full shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-center hover:scale-105 ${
                isScrolled
                  ? 'bg-sky-50 text-brand-medium hover:bg-brand-medium hover:text-white'
                  : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-brand-dark'
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

            {/* Quick Phone Call (Desktop Only) */}
            <a
              href={`tel:${FARM_INFO.phoneFormatted}`}
              className={`hidden lg:flex items-center gap-2 font-bold text-xs py-2 px-4 rounded-full border shadow-sm transition-all duration-300 ${
                isScrolled
                  ? 'border-brand-medium text-brand-medium bg-sky-50 hover:bg-brand-medium hover:text-white'
                  : 'border-white/30 text-white bg-white/5 hover:bg-white hover:text-brand-dark'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>اتصل للحجز: {FARM_INFO.phoneFormatted}</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg md:hidden cursor-pointer transition-colors duration-200 ${
                isScrolled ? 'text-brand-dark' : 'text-white'
              }`}
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block text-slate-700 font-bold py-2.5 px-4 rounded-lg hover:bg-sky-50 hover:text-brand-medium transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 px-4 flex flex-col gap-3">
                <a
                  href={`tel:${FARM_INFO.phoneFormatted}`}
                  className="flex items-center justify-center gap-2 font-bold text-sm bg-brand-medium hover:bg-brand-hover text-white py-3 rounded-lg shadow-sm"
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
