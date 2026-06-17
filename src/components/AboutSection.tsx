import { ShieldCheck, Award, HeartHandshake, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutSection() {
  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-medium" />,
      title: 'إشراف طبي وبيطري دائم',
      desc: 'تخضع جميع عمليات الذبح والسلخ والتعبئة تحت إشراف وزارة الطب البيطري لضمان جودة وصحة الذبيحة.',
    },
    {
      icon: <Award className="w-6 h-6 text-brand-medium" />,
      title: 'أعلاف طبيعية 100%',
      desc: 'مواشينا ودواجننا تتغذى بالكامل على أعلاف نباتية ومراعي خضراء نقية خالية من الهرمونات والكيماويات والمحفزات.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-brand-medium" />,
      title: 'أمان ونظافة فائقة',
      desc: 'تعبئة مفرغة للهواء ومحفوظة في بيئة معقمة ومبردة تماماً منذ لحظة الذبح والتقطيع حتى وصولها لباب منزلك.',
    },
    {
      icon: <Users className="w-6 h-6 text-brand-medium" />,
      title: 'إرث عائلي وخبرة طويلة',
      desc: 'نمخر عباب الزمن منذ أكثر من عقدين في خدمة أهالينا وتوفير أفضل اللحوم والمنتجات بأمانة وصدق ومصداقية تامة.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images/Graphic Column (L_Col) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 aspect-square sm:aspect-[4/5] lg:aspect-square"
            >
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
                alt="تقطيع اللحم الطازج في مزارع الحفني"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Floating success badge */}
              <div className="absolute bottom-6 right-6 left-6 bg-brand-dark/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white text-right">
                <p className="text-brand-gold text-2xl font-black mb-1">مزارع آل حفني - 35 سنة خبرة، لحوم طبيعية وألبان فريش 100%، طعم أصيل وجودة عالية، بأعلى معايير السلامة في قلب مصر.
                </p>
                <p className="text-xs text-sky-200">الريادة والخبرة والمصداقية في السوق المصري</p>
              </div>
            </motion.div>
          </div>

          {/* Text/Content Column (R_Col) */}
          <div className="lg:col-span-7 text-right">
            <h4 className="text-brand-medium font-extrabold text-sm tracking-widest uppercase mb-3">حكايتنا وقيمنا</h4>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-dark leading-tight mb-6">
              تراث فلاحي عريق يضمن لك المذاق الطازج واللحم المرمل
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8 text-base">
              تأسست <strong>مزارع الحفني</strong> بهدف سد الفجوة بين الجودة العالية والأسعار المناسبة للمستهلك المصري. نؤمن بأن اللحوم والدواجن والألبان هي أساس التغذية السليمة، لذا قررنا إدارة الحلقة الإنتاجية بأكملها منا وإليكم؛ بدءاً من زراعة الأعلاف الطبيعية وتسمين المواشي في مزارعنا الصديقة للبيئة، وحتى الذبح الطبي بمجازر الدولة والتعبئة السليمة والوصول المبرد للبيوت.
            </p>

            {/* Quick Benefits Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-sky-50/50 hover:bg-sky-50 transition-colors duration-300 border border-sky-100 shadow-sm"
                >
                  <div className="p-3 bg-white text-brand-medium border border-sky-100 shadow-sm rounded-xl shrink-0 mt-0.5">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-1.5 text-base">{v.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
