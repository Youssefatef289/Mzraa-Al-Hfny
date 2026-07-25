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
  defaultCategory?: Product['category'];
  defaultTag?: string;
  defaultUnit?: string;
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

/** ASCII-only product id (Arabic names break Supabase Storage keys). */
function slugId(category: Product['category']): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${category}-${Date.now().toString(36)}-${rand}`;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return 'حدث خطأ أثناء الحفظ';
}

export default function ProductFormModal({
  open,
  mode,
  initial,
  defaultCategory = 'meat',
  defaultTag,
  defaultUnit,
  onClose,
  onSaved,
  onError,
  onSuccess,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormValues>(emptyForm(defaultCategory));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setForm(productToForm(initial));
      setPreviewUrl(getProductImageUrl(initial.image));
      setIsOffer(initial.tag === 'عرض' || !!initial.originalPrice);
    } else {
      setForm({
        ...emptyForm(defaultCategory),
        tag: defaultTag ?? '',
        unit: defaultUnit ?? 'كيلو جرام',
      });
      setPreviewUrl(null);
      setIsOffer(defaultTag === 'عرض');
    }
    setImageFile(null);
  }, [open, mode, initial, defaultCategory, defaultTag]);

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

  const handleToggleOffer = () => {
    const nextVal = !isOffer;
    setIsOffer(nextVal);
    if (nextVal) {
      setForm((prev) => ({
        ...prev,
        tag: prev.tag?.trim() ? prev.tag : 'عرض',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        tag: prev.tag === 'عرض' ? '' : prev.tag,
        originalPrice: undefined,
      }));
    }
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
      const productId = mode === 'edit' ? form.id : slugId(form.category);
      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, productId, form.category);
      }

      const finalTag = isOffer
        ? (form.tag?.trim() ? form.tag.trim() : 'عرض')
        : (form.tag?.trim() === 'عرض' ? '' : form.tag?.trim());

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
        ...(finalTag ? { tag: finalTag } : {}),
        ...(isOffer && form.originalPrice && form.originalPrice > 0
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
        if (error) throw new Error(error.message);
        onSuccess('تم تحديث المنتج بنجاح');
      } else {
        const { error } = await supabase.from('products').insert(row);
        if (error) throw new Error(error.message);
        onSuccess('تم إضافة المنتج بنجاح');
      }

      onSaved();
      onClose();
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto border border-slate-150">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between z-10">
          <div className="sm:hidden w-10 h-1 rounded-full bg-slate-200 absolute left-1/2 -translate-x-1/2 top-2" />
          <h2 className="text-base sm:text-lg font-black text-brand-dark">
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              <label className="block text-xs font-extrabold text-slate-600 mb-2">قبل الخصم</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.originalPrice ?? ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setForm((prev) => ({
                    ...prev,
                    originalPrice: val,
                    ...(val && val > 0 ? { tag: prev.tag?.trim() ? prev.tag : 'عرض' } : {}),
                  }));
                  if (val && val > 0) {
                    setIsOffer(true);
                  }
                }}
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
              <label className="block text-xs font-extrabold text-slate-600 mb-2">وسم (اختياري)</label>
              <input
                value={form.tag ?? ''}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="مثال: فاخر"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-brand-medium focus:ring-4 focus:ring-brand-light"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 sm:pt-6">
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

            <div className="flex items-center gap-3 pt-2 sm:pt-6">
              <button
                type="button"
                role="switch"
                aria-checked={isOffer}
                onClick={handleToggleOffer}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                  isOffer ? 'bg-red-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isOffer ? 'right-1' : 'right-6'
                  }`}
                />
              </button>
              <span className="text-sm font-bold text-slate-700">
                {isOffer ? 'تفعيل كعرض خاص' : 'منتج بدون عرض'}
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
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors ${
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
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl mx-auto mb-3 border border-slate-100"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                </div>
              )}
              <p className="text-xs sm:text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                اضغط لاختيار صورة
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-1 sticky bottom-0 bg-white pb-1">
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
              className="px-5 sm:px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
