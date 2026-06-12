import { ArrowDown, Flame, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { FARM_INFO } from '../data';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_farms_banner_1781226629299.jpg"
          alt="مزارع وجزارة الخفني"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Deep, premium overlay fitting white/blue mood */}
        <div className="absolute inset-0 bg-gradient-to-l from-brand-dark/95 via-brand-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-brand-dark/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-2xl text-right text-white">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-medium/20 backdrop-blur-sm border border-brand-medium/40 py-1.5 px-4 rounded-full text-brand-light text-xs font-semibold mb-6"
          >
            <Flame className="w-4 h-4 text-brand-gold animate-pulse" />
            <span>منتجات بلدي طازجة من مزارعنا لمطبخك</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white mb-6"
          >
            جودة مزارع الخفني<br />
            <span className="text-sky-300 italic font-medium text-4xl sm:text-5xl lg:text-6xl pb-2 block">أجود أنواع اللحوم الطازجة</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-250 text-base sm:text-lg leading-relaxed mb-10 max-w-lg text-slate-200"
          >
            نوفر لك أرقى قطوعات اللحم البلدي والمصنعات والدواجن الطازجة، بجانب منتجات الألبان الفلاحي النقية بالطعم الأصيل من مزارعنا مباشرة بأعلى معايير النظافة والتعقيم.
          </motion.p>

          {/* Action Cta Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-start items-center"
          >
            <a
              href="#products"
              className="px-8 py-4 bg-brand-medium hover:bg-brand-hover text-white font-extrabold rounded-xl shadow-lg hover:shadow-brand-medium/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center cursor-pointer min-w-[170px]"
            >
              تصفح منتجاتنا
            </a>
            <a
              href={`https://wa.me/${FARM_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 hover:bg-white hover:text-brand-dark text-white font-extrabold rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:-translate-y-0.5 text-center min-w-[170px]"
            >
              طلب سريع بالواتساب
            </a>
          </motion.div>

          {/* Feature highlights badge block */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 mt-16 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
              <div className="p-2 sm:p-2.5 bg-white/5 rounded-full text-brand-light">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">ضمان كامل</h4>
                <p className="text-[10px] text-slate-400">رقابة بيطرية 100%</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
              <div className="p-2 sm:p-2.5 bg-white/5 rounded-full text-brand-light">
                <Truck className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">توصيل منزلي</h4>
                <p className="text-[10px] text-slate-400">حافظات مبردة آمنة</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
              <div className="p-2 sm:p-2.5 bg-white/5 rounded-full text-brand-light">
                <Flame className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">طازج يومياً</h4>
                <p className="text-[10px] text-slate-400">ذبح وتعبئة فورية</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Indicator arrow */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block">
        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-10 h-10 rounded-full border border-white/20 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.a>
      </div>
    </section>
  );
}
