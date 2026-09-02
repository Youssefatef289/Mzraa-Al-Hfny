import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'product-images';

/** Returns the list of Supabase env var names that are missing on the server. */
function missingServerEnvVars(): string[] {
  const missing: string[] = [];
  if (!(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) {
    missing.push('VITE_SUPABASE_URL / SUPABASE_URL');
  }
  if (!(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) {
    missing.push('VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY');
  }
  if (!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    missing.push('SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY');
  }
  return missing;
}

function sanitizeExt(fileName: string, mimeType: string): string {
  const fromName = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (/^[a-z0-9]{2,5}$/.test(fromName) && fromName !== 'jpeg') return fromName;
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('gif')) return 'gif';
  return 'jpg';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    const missingEnv = missingServerEnvVars();
    if (missingEnv.length > 0) {
      return res.status(500).json({
        error:
          `Missing Supabase server env var(s) on Vercel: ${missingEnv.join(', ')}. ` +
          'Add them under Vercel → Project → Settings → Environment Variables, then redeploy.',
        missing: missingEnv,
      });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const body = req.body || {};
    const { productId, category, fileName, contentType, base64 } = body as {
      productId?: string;
      category?: string;
      fileName?: string;
      contentType?: string;
      base64?: string;
    };

    if (!productId || !category || !base64) {
      return res.status(400).json({ error: 'productId, category, and base64 are required' });
    }

    const safeId =
      productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || `product-${Date.now()}`;
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

    if (uploadError) {
      return res.status(500).json({
        error: `Storage upload failed (${uploadError.statusCode ?? 'unknown status'}): ${uploadError.message}`,
        hint: 'Verify the "product-images" bucket exists and the storage policies in supabase/storage-policies.sql are applied.',
      });
    }

    const { data } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
    return res.status(200).json({ publicUrl: data.publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return res.status(500).json({ error: message });
  }
}
