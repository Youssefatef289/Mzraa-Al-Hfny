import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Search, RefreshCw, Layers } from 'lucide-react';
import { Product } from '../../types';
import { rowToProduct, ProductRow } from '../../lib/productMapper';
import { deleteProductImage } from '../../lib/uploadProductImage';
import { supabase } from '../../lib/supabaseClient';
import { getProductImageUrl } from '../../imageUtils';
import ProductFormModal from './ProductFormModal';
import { AdminToast, useAdminToast } from './AdminToast';

const CATEGORY_TABS: { id: 'all' | Product['category']; label: string; icon: string }[] = [
  { id: 'all', label: 'جميع المنتجات', icon: '' },
  { id: 'meat', label: 'لحوم طازجة', icon: '🥩' },
  { id: 'processed', label: 'مصنعات لحوم', icon: '🌭' },
  { id: 'poultry', label: 'دواجن', icon: '🍗' },
  { id: 'dairy', label: 'ألبان وحلويات', icon: '🍮' },
  { id: 'cheese', label: 'الجبن', icon: '🧀' },
];

const CATEGORY_LABELS: Record<Product['category'], string> = {
  meat: 'لحوم',
  processed: 'مصنعات',
  poultry: 'دواجن',
  dairy: 'ألبان',
  cheese: 'جبن',
};

type CategoryFilter = 'all' | Product['category'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast, showToast } = useAdminToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) {
      showToast('فشل تحميل المنتجات: ' + error.message, 'error');
    } else {
      setProducts((data as ProductRow[]).map(rowToProduct));
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('admin-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: products.length,
      meat: 0,
      processed: 0,
      poultry: 0,
      dairy: 0,
      cheese: 0,
    };
    for (const product of products) {
      counts[product.category] += 1;
    }
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, category, search]);

  const activeTabLabel =
    CATEGORY_TABS.find((tab) => tab.id === category)?.label ?? 'جميع المنتجات';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const openCreate = () => {
    setModalMode('create');
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف "${product.name}" نهائيًا؟`);
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if (error) throw error;

      if (product.image.startsWith('http')) {
        try {
          await deleteProductImage(product.image);
        } catch {
          // Image cleanup is best-effort
        }
      }

      showToast('تم حذف المنتج بنجاح');
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل حذف المنتج';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-brand-dark text-white border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={encodeURI('/images/Logo tab.jpg')}
              alt="مزارع الحفني"
              className="w-10 h-10 rounded-xl bg-white p-0.5 object-contain"
            />
            <div>
              <h1 className="text-lg font-black">لوحة تحكم المنتجات</h1>
              <p className="text-xs text-sky-200">{products.length} منتج</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category tabs section */}
        <section className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-black text-brand-dark">أقسام المنتجات</h2>
            <span className="text-xs font-bold text-slate-500">
              عرض: {activeTabLabel} ({filtered.length})
            </span>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-2 shadow-sm overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {CATEGORY_TABS.map((tab) => {
                const isActive = category === tab.id;
                const count = categoryCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-brand-medium text-white shadow-md shadow-brand-medium/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-brand-medium'
                    }`}
                  >
                    {tab.id === 'all' ? (
                      <Layers className="w-4 h-4" />
                    ) : (
                      <span className="text-base leading-none">{tab.icon}</span>
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={`min-w-[1.5rem] h-5 px-1.5 rounded-md text-[10px] font-black flex items-center justify-center ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`بحث في ${activeTabLabel}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light"
            />
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-medium hover:bg-brand-hover text-white rounded-xl text-sm font-extrabold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
              جاري تحميل المنتجات...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 font-bold">
              لا توجد منتجات في «{activeTabLabel}»
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-extrabold text-slate-500">
                    <th className="text-right p-4">الصورة</th>
                    <th className="text-right p-4">الاسم</th>
                    <th className="text-right p-4">السعر</th>
                    <th className="text-right p-4">القسم</th>
                    <th className="text-right p-4">التوفر</th>
                    <th className="text-right p-4">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4">
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                        />
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-brand-dark">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono" dir="ltr">
                          {product.id}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-brand-medium">
                        {product.price} ج.م
                        <span className="text-[10px] text-slate-400 block">/ {product.unit}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold bg-sky-50 text-brand-medium px-2.5 py-1 rounded-lg">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            product.isAvailable
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-red-50 text-red-500'
                          }`}
                        >
                          {product.isAvailable ? 'متوفر' : 'غير متوفر'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            className="p-2 rounded-lg bg-sky-50 text-brand-medium hover:bg-sky-100 cursor-pointer"
                            aria-label="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer"
                            aria-label="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ProductFormModal
        open={modalOpen}
        mode={modalMode}
        initial={editingProduct}
        defaultCategory={category === 'all' ? 'meat' : category}
        onClose={() => setModalOpen(false)}
        onSaved={fetchProducts}
        onError={(msg) => showToast(msg, 'error')}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <AdminToast toast={toast} />
    </div>
  );
}
