import { createClient } from '@supabase/supabase-js';

const BUCKET = 'product-images';

type Body = {
  productId?: string;
  category?: string;
  fileName?: string;
  contentType?: string;
  base64?: string;
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function sanitizeExt(fileName: string, mimeType: string): string {
  const fromName = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (/^[a-z0-9]{2,5}$/.test(fromName) && fromName !== 'jpeg') return fromName;
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('gif')) return 'gif';
  return 'jpg';
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !secretKey) {
    return json(500, { error: 'Supabase server env vars are missing on Vercel' });
  }

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return json(401, { error: 'Unauthorized' });

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json(401, { error: 'Invalid session' });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { productId, category, fileName, contentType, base64 } = body;
  if (!productId || !category || !base64) {
    return json(400, { error: 'productId, category, and base64 are required' });
  }

  const safeId = productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || `product-${Date.now()}`;
  const ext = sanitizeExt(fileName || 'image.jpg', contentType || 'image/jpeg');
  const storagePath = `${category}/${safeId}-${Date.now()}.${ext}`;

  const raw = base64.includes(',') ? base64.split(',')[1] : base64;
  const bytes = Buffer.from(raw, 'base64');

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, bytes, {
      upsert: true,
      contentType: contentType || 'image/jpeg',
    });

  if (uploadError) return json(500, { error: uploadError.message });

  const { data } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
  return json(200, { publicUrl: data.publicUrl });
}
