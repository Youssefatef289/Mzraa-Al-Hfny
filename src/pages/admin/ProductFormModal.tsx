import { useEffect, useRef, useState, type FormEvent, type DragEvent } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import { Product } from '../../types';
import { productToRow } from '../../lib/productMapper';
import { uploadProductImage } from '../../lib/uploadProductImage';
import { supabase } from '../../lib/supabaseClient';
import { getProductImageUrl } from '../../imageUtils';

const CATEGORIES: { id: Product['category']; label: string }[] = [
  { id: 'meat', label: 'لحوم طازجة' },
  { id: 'processed', label: 'مصنعات لحوم' },
  { id: 'poultry', label: 'دواجن' },
  { id: 'dairy', label: 'ألبان وحلويات' },
  { id: 'cheese', label: 'الجبن' },
];

export interface ProductFormValues {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: Product['category'];
  isAvailable: boolean;
  tag?: string;
  rating: number;
  minQuantity?: number;
  quantityStep?: number;
  image: string;
}

interface ProductFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Product | null;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

const emptyForm = (category: Product['category'] = 'meat'): ProductFormValues => ({
  id: '',
  name: '',
  description: '',
  price: 0,
  unit: 'كيلو جرام',
  category,
  isAvailable: true,
  rating: 4.5,
  image: '',
});

function productToForm(product: Product): ProductFormValues {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    unit: product.unit,
    category: product.category,
    isAvailable: product.isAvailable,
    tag: product.tag,
    rating: product.rating,
    minQuantity: product.minQuantity,
    quantityStep: product.quantityStep,
    image: product.image,
  };
}

function slugId(category: Product['category'], name: string): string {
  const base = name.trim().replace(/\s+/g, '-').slice(0, 24) || 'product';
  return `${category}-${base}-${Date.now().toString(36)}`;
}

export default function ProductFormModal({
  open,
  mode,
  initial,
  onClose,
  onSaved,
  onError,
  onSuccess,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormValues>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setForm(productToForm(initial));
      setPreviewUrl(getProductImageUrl(initial.image));
    } else {
      setForm(emptyForm());
      setPreviewUrl(null);
    }
    setImageFile(null);
  }, [open, mode, initial]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      onError('اسم المنتج مطلوب');
      return;
    }
    if (form.price <= 0) {
      onError('السعر يجب أن يكون أكبر من صفر');
      return;
    }
    if (mode === 'create' && !imageFile && !form.image) {
      onError('يرجى رفع صورة للمنتج');
      return;
    }

    setSaving(true);

    try {
      const productId = mode === 'edit' ? form.id : slugId(form.category, form.name);
      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, productId, form.category);
      }

      const product: Product = {
        id: productId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price,
        unit: form.unit,
        image: imageUrl,
        category: form.category,
        rating: form.rating,
        isAvailable: form.isAvailable,
        ...(form.tag?.trim() ? { tag: form.tag.trim() } : {}),
        ...(form.originalPrice && form.originalPrice > 0
          ? { originalPrice: form.originalPrice }
          : {}),
        ...(form.minQuantity != null && form.minQuantity > 0
          ? { minQuantity: form.minQuantity }
          : {}),
        ...(form.quantityStep != null && form.quantityStep > 0
          ? { quantityStep: form.quantityStep }
          : {}),
      };

      const row = productToRow(product);

      if (mode === 'edit') {
        const { error } = await supabase.from('products').update(row).eq('id', productId);
        if (error) throw error;
        onSuccess('تم تحديث المنتج بنجاح');
      } else {
        const { error } = await supabase.from('products').insert(row);
        if (error) throw error;
        onSuccess('تم إضافة المنتج بنجاح');
      }

      onSaved();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ';
      onError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-150">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-black text-brand-dark">
            {mode === 'edit' ? 'تعديل منتج' : 'إضافة منتج جديد'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-slate-600 mb-2">اسم المنتج *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-slate-600 mb-2">الوصف</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 mb-2">السعر (ج.م) *</label>
              <input
                type="number"
                min={1}
                step={1}
                required
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 mb-2">السعر قبل الخصم (اختياري)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.originalPrice ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    originalPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 mb-2">الوحدة</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium cursor-pointer"
              >
                <option value="كيلو جرام">كيلو جرام</option>
                <option value="العبوة">العبوة</option>
                <option value="العرض">العرض</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 mb-2">القسم</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Product['category'] })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 mb-2">Tag (اختياري)</label>
              <input
                value={form.tag ?? ''}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="مثال: فاخر"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <button
                type="button"
                role="switch"
                aria-checked={form.isAvailable}
                onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                  form.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.isAvailable ? 'right-1' : 'right-6'
                  }`}
                />
              </button>
              <span className="text-sm font-bold text-slate-700">
                {form.isAvailable ? 'متوفر' : 'غير متوفر'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">صورة المنتج</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-brand-medium bg-brand-light' : 'border-slate-200 hover:border-brand-medium/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="معاينة"
                  className="w-32 h-32 object-cover rounded-xl mx-auto mb-3 border border-slate-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <p className="text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                اسحب صورة هنا أو اضغط للاختيار
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-medium hover:bg-brand-hover disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              {saving ? 'جاري الحفظ...' : mode === 'edit' ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
