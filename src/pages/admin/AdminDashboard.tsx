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

const CATEGORY_TABS: {
  id: 'all' | Product['category'];
  label: string;
  short: string;
  icon: string;
}[] = [
  { id: 'all', label: 'الكل', short: 'الكل', icon: '' },
  { id: 'meat', label: 'لحوم', short: 'لحوم', icon: '🥩' },
  { id: 'processed', label: 'مصنعات', short: 'مصنعات', icon: '🌭' },
  { id: 'poultry', label: 'دواجن', short: 'دواجن', icon: '🍗' },
  { id: 'dairy', label: 'ألبان', short: 'ألبان', icon: '🍮' },
  { id: 'cheese', label: 'جبن', short: 'جبن', icon: '🧀' },
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
    CATEGORY_TABS.find((tab) => tab.id === category)?.label ?? 'الكل';

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
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8" dir="rtl">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-brand-dark text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={encodeURI('/images/Logo tab.jpg')}
              alt="مزارع الحفني"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 object-contain shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black truncate">لوحة التحكم</h1>
              <p className="text-[10px] sm:text-xs text-sky-200">{products.length} منتج</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={fetchProducts}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="تحديث"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`ابحث في ${activeTabLabel}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light shadow-sm"
          />
        </div>

        {/* Category chips */}
        <section className="mb-4">
          <div className="-mx-3 px-3 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 min-w-max pb-1">
              {CATEGORY_TABS.map((tab) => {
                const isActive = category === tab.id;
                const count = categoryCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-medium text-white shadow-md shadow-brand-medium/25'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {tab.id === 'all' ? (
                      <Layers className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-sm leading-none">{tab.icon}</span>
                    )}
                    <span>{tab.short}</span>
                    <span
                      className={`text-[10px] min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 px-0.5">
            {filtered.length} نتيجة في {activeTabLabel}
          </p>
        </section>

        {/* Desktop add button */}
        <div className="hidden md:flex justify-end mb-4">
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 bg-brand-medium hover:bg-brand-hover text-white rounded-xl text-sm font-extrabold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-3 animate-pulse flex gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-sm font-extrabold text-slate-700 mb-1">لا توجد منتجات</p>
            <p className="text-xs text-slate-400 font-bold mb-5">في قسم «{activeTabLabel}»</p>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-brand-medium text-white text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج
            </button>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-2.5">
              {filtered.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex gap-3"
                >
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-brand-dark truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm font-black text-brand-medium mt-0.5">
                          {product.price}{' '}
                          <span className="text-[10px] font-bold text-slate-400">ج.م / {product.unit}</span>
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg ${
                          product.isAvailable
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-500'
                        }`}
                      >
                        {product.isAvailable ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 gap-2">
                      <span className="text-[10px] font-bold bg-sky-50 text-brand-medium px-2 py-1 rounded-lg">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 text-brand-medium text-[11px] font-extrabold cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 cursor-pointer"
                          aria-label="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
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
            </div>
          </>
        )}
      </main>

      {/* Mobile FAB */}
      <button
        type="button"
        onClick={openCreate}
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-brand-medium hover:bg-brand-hover text-white font-extrabold text-sm px-5 py-3.5 rounded-full shadow-xl shadow-brand-medium/30 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        إضافة منتج
      </button>

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
