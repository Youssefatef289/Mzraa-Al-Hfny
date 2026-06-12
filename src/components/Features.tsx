import { Shield, Sparkles, CircleDollarSign, Headset, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Features() {
  const list = [
    {
      icon: <Shield className="w-6 h-6 text-inherit" />,
      title: 'جودة مضمونة',
      desc: 'فحص دوري كامل للمواشي وتطهير مستمر لصالات العرض والتحضير، لحوم معبأة ومعقمة بأعلى معايير جودة سلامة الغذاء العالمية.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-inherit" />,
      title: 'منتجات طازجة يومياً',
      desc: 'لا يوجد تخزين أو لحوم مجمدة! نوفر الذبح اليومي الطازج واللبن المستخلص صبيحة كل يوم، لتستمتع بقمة النكهة والفوائد.',
    },
    {
      icon: <CircleDollarSign className="w-6 h-6 text-inherit" />,
      title: 'أسعار تنافسية',
      desc: 'لأننا نملك المزرعة والمجازر وخدمة التوصيل، قضينا تماماً على الوسطاء والعمولات ووفرنا لك السعر العادل من المنبع مباشرة.',
    },
    {
      icon: <Headset className="w-6 h-6 text-inherit" />,
      title: 'خدمة عملاء فائقة',
      desc: 'فريق ودود ومتلقٍ للطلبات والشكاوى والاستفسارات على مدار الـ ٢٤ ساعة، نضمن لك الرضا الكامل أو استبدال المنتج فوراً.',
    },
    {
      icon: <Zap className="w-6 h-6 text-inherit" />,
      title: 'سرعة وكفاءة التوصيل',
      desc: 'سيارات مخصصة للنقل المبرد تحتفظ بدرجة تجميد وثبات المنتج حتى باب بيتك، لنستوفي معاً دورة السلامة والصحة المتكاملة.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h4 className="text-brand-medium font-extrabold text-sm tracking-widest uppercase mb-3">لماذا تختارنا؟</h4>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">
            مميزات مزارع الخفني التي تجعلنا الخيار الأول لبيتك
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed">
            نحن لا نبيع اللحوم والمنتجات فحسب، بل نقدم التزاماً تاماً بالصحة والنظافة وجودة الغذاء الذي نقدمه لأسرنا وأسركم.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
        >
          {list.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex flex-col justify-between hover:bg-brand-medium hover:text-white transition-all duration-300 group text-right cursor-default shadow-sm ${
                index === 3 || index === 4 ? 'lg:col-span-1 md:col-span-1' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                  0{index + 1}
                </span>
                <div className="w-12 h-12 bg-white group-hover:bg-brand-dark rounded-2xl flex items-center justify-center text-brand-medium group-hover:text-white shadow-sm transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-dark group-hover:text-white mb-2 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 group-hover:text-sky-100/90 leading-relaxed transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
