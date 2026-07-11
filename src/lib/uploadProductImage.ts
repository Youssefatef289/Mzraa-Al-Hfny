import { supabase } from './supabaseClient';

const BUCKET = 'product-images';
const MAX_IMAGE_EDGE = 900;
const JPEG_QUALITY = 0.78;

function sanitizeExt(fileName: string, mimeType: string): string {
  const fromName = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (/^[a-z0-9]{2,5}$/.test(fromName) && fromName !== 'jpeg') return fromName;
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('gif')) return 'gif';
  return 'jpg';
}

/** ASCII-only storage key (Arabic filenames break Supabase Storage). */
export function buildStoragePath(category: string, productId: string, file: File): string {
  const safeId = productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || `product-${Date.now()}`;
  const ext = sanitizeExt(file.name, file.type);
  return `${category}/${safeId}-${Date.now()}.${ext}`;
}

export function getStoragePathFromUrl(imageUrl: string): string | null {
  if (!imageUrl.startsWith('http')) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(imageUrl.slice(idx + marker.length));
}

async function fileToCompressedBlob(file: File): Promise<{ blob: Blob; dataUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('تعذر معالجة الصورة');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('تعذر ضغط الصورة'))),
      'image/jpeg',
      JPEG_QUALITY
    );
  });
  return { blob, dataUrl };
}

async function uploadViaApi(
  file: File,
  productId: string,
  category: string
): Promise<string | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return null;

  const { dataUrl } = await fileToCompressedBlob(file);

  try {
    const res = await fetch('/api/upload-product-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        category,
        fileName: file.name,
        contentType: 'image/jpeg',
        base64: dataUrl,
      }),
    });

    if (!res.ok) return null;
    const payload = (await res.json()) as { publicUrl?: string };
    return payload.publicUrl ?? null;
  } catch {
    return null;
  }
}

export async function uploadProductImage(
  file: File,
  productId: string,
  category: string
): Promise<string> {
  // 1) Prefer direct Storage upload (works when RLS policies exist)
  const storagePath = buildStoragePath(category, productId, file);
  const { blob } = await fileToCompressedBlob(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, blob, { upsert: true, contentType: 'image/jpeg' });

  if (!uploadError) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  }

  // 2) Production fallback: Vercel API route using secret key (bypasses Storage RLS)
  const viaApi = await uploadViaApi(file, productId, category);
  if (viaApi) return viaApi;

  // 3) Local/dev fallback: compressed data URL so admin can still add products
  const isRlsBlocked =
    uploadError.message.includes('row-level security') ||
    uploadError.message.toLowerCase().includes('policy');

  if (isRlsBlocked) {
    console.warn('Storage RLS blocked upload; using data URL fallback.');
    const { dataUrl } = await fileToCompressedBlob(file);
    return dataUrl;
  }

  throw new Error(`فشل رفع الصورة: ${uploadError.message}`);
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const path = getStoragePathFromUrl(imageUrl);
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.warn('Failed to delete storage image:', error.message);
  }
}
