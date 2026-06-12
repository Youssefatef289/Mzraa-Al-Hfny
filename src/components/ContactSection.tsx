import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { FARM_INFO } from '../data';
import { ContactFormData } from '../types';
import { motion } from 'motion/react';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name === '' || formData.phone === '') return;

    setLoading(true);
    // Simulate API request dispatch
    setTimeout(() => {
      setLoading(false);
      setIsSubmitSuccessful(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => {
        setIsSubmitSuccessful(false);
      }, 5000); // clear banner after 5s
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h4 className="text-brand-medium font-extrabold text-sm tracking-widest uppercase mb-3">تواصل معنا</h4>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">
            نحن هنا لخدمتك والإجابة على استفساراتك
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            تفخر عائلة مزارع الحفني بالتواصل المباشر معكم لتلبية متطلبات بيوتكم ومناسباتكم الكبيرة في أي وقت.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Informational Column (Left Side relative to RTL is column span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-right">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-brand-dark">منافذ البيع والإدارة</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                تفضّل بزيارتنا في منفذ المبيعات الرئيسي للمزرعة لرؤية قطوعات اللحم الطازجة يومياً واختيار ذبيحتك بنفسك، أو تواصل عن طريق الهاتف والواتس للتوصيل الفوري المبرد لباب المنزل.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-brand-medium shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5 opacity-90" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-dark text-sm mb-1">الموقع والمزرعة كبرى</h4>
                  <p className="text-xs text-slate-650 leading-relaxed">{FARM_INFO.address}</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-brand-medium shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 opacity-90" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-dark text-sm mb-1">أرقام الهواتف والتواصل</h4>
                  <a href={`tel:${FARM_INFO.phoneFormatted}`} className="text-xs text-slate-650 hover:text-brand-medium leading-normal font-bold block transition-colors" dir="ltr">هاتف: {FARM_INFO.phoneFormatted}</a>
                  <a href={`https://wa.me/${FARM_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-650 hover:text-emerald-600 leading-normal font-bold block transition-colors" dir="ltr">واتساب: {FARM_INFO.whatsappFormatted}</a>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-brand-medium shrink-0 shadow-sm">
                  <Mail className="w-5 h-5 opacity-90" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-dark text-sm mb-1">البريد وصفحتنا على فيسبوك</h4>
                  <p className="text-xs text-slate-650 leading-normal font-bold" dir="ltr">{FARM_INFO.email}</p>
                  <a href={FARM_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-medium hover:text-brand-hover leading-normal font-bold block transition-colors">صفحة الحفني على فيسبوك ←</a>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-brand-medium shrink-0 shadow-sm">
                  <Clock className="w-5 h-5 opacity-90" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-dark text-sm mb-1">مواعيد العمل الرسمية</h4>
                  <p className="text-xs text-slate-650 leading-normal">{FARM_INFO.hours}</p>
                </div>
              </div>
            </div>

            {/* Simulated Dynamic Google Maps with Theme Styling */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-48 relative shadow-inner group">
              <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-4 text-center z-10 transition-colors duration-300 group-hover:bg-sky-50/50">
                {/* Visual Representation of Grid lines */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />
                {/* Visual Map Route Line mock */}
                <svg className="absolute inset-0 w-full h-full opacity-30 stroke-brand-medium fill-none stroke-[2]" viewBox="0 0 400 200">
                  <path d="M 0,100 Q 150,50 200,100 T 400,120" />
                  <path d="M 120,0 Q 180,80 200,100 T 220,200" />
                </svg>
                
                {/* Map Pin */}
                <div className="relative z-20 w-12 h-12 rounded-full bg-brand-medium/10 flex items-center justify-center animate-bounce mb-2">
                  <MapPin className="w-6 h-6 text-brand-medium" />
                </div>
                
                <h4 className="font-black text-brand-dark text-xs z-20 mb-1">موقع مزارع الحفني</h4>
                <p className="text-[10px] text-slate-500 z-20 mb-3 font-semibold">{FARM_INFO.city}</p>
                
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(FARM_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-20 px-4 py-1.5 bg-brand-medium hover:bg-brand-hover text-white text-[10px] font-extrabold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  فتح في خرائط جوجل الفريضة
                </a>
              </div>
            </div>
          </div>

          {/* Form Column (Right Side relative to RTL is column span 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-150 shadow-sm text-right flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">أرسل رسالة مباشرة</h3>
              <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                هل لديك استفسار بخصوص العجول والمواشي الكاملة للعقيقة والأضاحي؟ اترك لنا رسالة وسنقوم بالرد عليك في أسرع وقت.
              </p>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-2">الإسم الكريم *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="الإسم بالكامل"
                    className="w-full pr-4 pl-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold"
                  />
                </div>

                {/* Grid name / phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 mb-2">رقم الهاتف الجوال *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="رقم الهاتف (الواتساب)"
                      className="w-full pr-4 pl-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-2">البريد الإلكتروني (اختياري)</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      className="w-full pr-4 pl-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-left font-sans font-bold"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-2">كيف يمكننا مساعدتك؟ *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="اكتب تفاصيل طلبك أو استفسارك هنا بالتفصيل..."
                    className="w-full pr-4 pl-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-medium focus:ring-2 focus:ring-brand-light rounded-xl outline-none text-xs transition-all text-right font-bold resize-none"
                  />
                </div>

                {/* Submit Banner */}
                {isSubmitSuccessful && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-800 text-right"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">تم إرسال رسالتك بنجاح!</p>
                      <p className="text-[10px] text-emerald-650 font-medium">سيقوم فريق مبيعات مزارع الحفني بالاتصال بك قريباً.</p>
                    </div>
                  </motion.div>
                )}

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-white font-extrabold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    loading ? 'bg-slate-400' : 'bg-brand-medium hover:bg-brand-hover shadow-brand-medium/15'
                  }`}
                >
                  {loading ? (
                    <span>جاري الإرسال المأمون...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>أرسل الرسالة الآن</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
