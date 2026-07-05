import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { usernameToAuthEmail } from '../../lib/adminAuth';

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'اسم المستخدم أو كلمة المرور غير صحيحة.';
  }
  if (m.includes('invalid api key') || m.includes('invalid jwt')) {
    return 'مفتاح Supabase غير صحيح على Vercel. أضف VITE_SUPABASE_ANON_KEY ثم أعد النشر.';
  }
  if (m.includes('email not confirmed')) {
    return 'الحساب غير مفعّل. تواصل مع المطور لإعادة ضبط الحساب.';
  }
  return `خطأ في تسجيل الدخول: ${message}`;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError(
        'إعدادات Supabase غير موجودة في هذا النشر. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في Vercel ثم Redeploy.'
      );
      return;
    }

    setLoading(true);

    const email = usernameToAuthEmail(username);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: password.trim(),
    });

    setLoading(false);

    if (signInError) {
      console.error('Admin login error:', signInError.message);
      setError(mapAuthError(signInError.message));
      return;
    }

    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center mx-auto mb-4">
            <img
              src={encodeURI('/images/Logo tab.jpg')}
              alt="مزارع الحفني"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-black text-brand-dark">لوحة تحكم مزارع الحفني</h1>
          <p className="text-sm text-slate-500 mt-2">سجّل دخولك لإدارة المنتجات</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 flex gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Supabase غير مضبوط في هذا البناء. أضف متغيرات VITE_SUPABASE_* في Vercel ثم أعد النشر.
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-username" className="block text-xs font-extrabold text-slate-600 mb-2">
              اسم المستخدم
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light transition-all"
                placeholder="adminAlhfny"
                dir="ltr"
                spellCheck={false}
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-extrabold text-slate-600 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light transition-all"
                placeholder="Alhfny@123"
                dir="ltr"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
              تأكد أن لوحة المفاتيح English وأن @ في كلمة المرور إنجليزية
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-medium hover:bg-brand-hover disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
