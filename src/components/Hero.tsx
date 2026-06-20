import { BadgeCheck, ShoppingCart, Truck } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  { label: 'توصيل سريع لحد باب البيت', Icon: Truck },
  { label: 'تقطيع احترافي بأيدي خبراء', Icon: CleaverIcon },
  { label: 'جودة مضمونة 100%', Icon: BadgeCheck },
  { label: 'لحوم طازجة يومياً', Icon: SteakIcon },
] as const;

function CleaverIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 18.5 14.5 8l5.5 1.5-1.5 5.5L9.5 20 4 18.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14.5 8 20 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SteakIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 14c0-4 2.5-8 6-8s6 4 6 8c0 2.5-1.5 4.5-3.5 5.5S12 21 12 21s-1-1.5-2.5-1.5S6 16.5 6 14Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="14.5" cy="11" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Full-bleed background — extends behind navbar */}
      <div className="absolute inset-0 hero-banner-bg" />
      <div className="absolute inset-0 hero-banner-grain opacity-40" />
      <div className="absolute inset-y-0 left-0 w-1/2 hero-farmhouse opacity-[0.07] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-1/2 hero-cow opacity-[0.06] pointer-events-none" aria-hidden="true" />
      <span className="hero-spark hero-spark-1" aria-hidden="true" />
      <span className="hero-spark hero-spark-2" aria-hidden="true" />
      <span className="hero-pepper hero-pepper-1" aria-hidden="true" />
      <span className="hero-pepper hero-pepper-2" aria-hidden="true" />
      <span className="hero-leaf hero-leaf-1" aria-hidden="true" />

      <div className="relative z-10 min-h-[calc(100vh-0px)] min-h-[640px] flex items-center pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-14 items-center">
            {/* Text — visual left in RTL */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2 flex flex-col items-center text-center max-w-xl mx-auto lg:mx-0 lg:mr-auto lg:items-center"
            >
              {/* Title block */}
              <div className="hero-copy-block w-full">
                <div className="flex items-center justify-center gap-2 mb-4 text-sky-200/90">
                  <CleaverIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm tracking-[0.25em] opacity-80">★</span>
                </div>

                <h1 className="font-black leading-[1.15] mb-5">
                  <span className="block text-[2rem] sm:text-5xl lg:text-[3.25rem] text-white drop-shadow-lg">
                    لحم طازج
                  </span>
                  <span className="block text-[1.65rem] sm:text-4xl lg:text-5xl mt-2 hero-title-glow text-sky-300">
                    جودة تستحق الثقة
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-md mx-auto px-1">
                  نقدم لكم أجود أنواع اللحوم الطازجة مقطعة بعناية يومياً لتصل لكم بأفضل جودة
                </p>
              </div>

              {/* Feature icons — single organized row */}
              <div className="hero-features-row w-full mt-8 sm:mt-10 mb-8 sm:mb-10">
                {FEATURES.map(({ label, Icon }) => (
                  <div key={label} className="hero-feature-item">
                    <div className="hero-feature-icon mx-auto">
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                    </div>
                    <p className="hero-feature-label">{label}</p>
                  </div>
                ))}
              </div>

              <a
                href="#products"
                className="hero-cta group inline-flex items-center gap-3 pl-3 pr-7 sm:pr-8 py-3 sm:py-3.5 rounded-full text-white font-extrabold text-sm sm:text-base shadow-lg shadow-sky-500/30 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                تسوق الآن
              </a>
            </motion.div>

            {/* Meat image — visual right in RTL */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="relative order-2 lg:order-1 flex items-center justify-center min-h-[240px] sm:min-h-[300px] lg:min-h-[400px]"
            >
              <div className="hero-meat-glow absolute inset-0 scale-90 lg:scale-100" aria-hidden="true" />
              <img
                src="/images/hero (2).png"
                alt="لحوم طازجة من مزارع الحفني"
                className="relative z-10 w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] xl:max-w-[480px] h-auto object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
