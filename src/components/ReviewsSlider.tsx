import { useState, useEffect } from 'react';
import { Star, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import { REVIEWS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function ReviewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextReview = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Auto-play every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextReview();
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentReview = REVIEWS[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section id="reviews" className="py-20 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h4 className="text-brand-medium font-extrabold text-sm tracking-widest uppercase mb-3">ثقة عملائنا</h4>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">
            ماذا يقولون عن منتجات مزارع الخفني؟
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            نسعد ونفتخر بخدمة وثقة آلاف العائلات المصرية التي تشاركنا تجاربها الإيجابية يومياً.
          </p>
        </div>

        {/* Testimonials Slider Wrapper */}
        <div className="max-w-3xl mx-auto relative px-4 sm:px-12">
          {/* Decorative quote icon */}
          <div className="absolute top-0 right-4 sm:right-6 text-sky-100 -z-0 opacity-80">
            <Quote className="w-20 h-20 rotate-180 transform -scale-x-100" />
          </div>

          <div className="relative z-10 min-h-[220px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full text-right bg-sky-50/65 border border-sky-100 rounded-[2rem] p-6 sm:p-10 shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5 justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < currentReview.rating
                          ? 'fill-brand-gold text-brand-gold'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold italic mb-6">
                  " {currentReview.comment} "
                </p>

                {/* Sender ID */}
                <div className="flex items-center gap-4 justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-light overflow-hidden shadow-sm shrink-0">
                    <img
                      src={currentReview.avatar}
                      alt={currentReview.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                      {currentReview.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-bold block mt-1">
                      {currentReview.date} · عميل موثق
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controllers */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevReview}
              className="w-11 h-11 rounded-full bg-slate-50 hover:bg-brand-medium text-slate-600 hover:text-white border border-slate-200 flex items-center justify-center transition-all duration-300 md:absolute md:top-1/2 md:-translate-y-1/2 md:-right-1 border-slate-100 md:shadow-md cursor-pointer"
              aria-label="التقييم السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={nextReview}
              className="w-11 h-11 rounded-full bg-slate-50 hover:bg-brand-medium text-slate-600 hover:text-white border border-slate-200 flex items-center justify-center transition-all duration-300 md:absolute md:top-1/2 md:-translate-y-1/2 md:-left-1 border-slate-100 md:shadow-md cursor-pointer"
              aria-label="التقييم التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {REVIEWS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? 'bg-brand-medium w-6' : 'bg-slate-200 hover:bg-slate-350'
                }`}
                aria-label={`تخطي لمراجعة رقم ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
