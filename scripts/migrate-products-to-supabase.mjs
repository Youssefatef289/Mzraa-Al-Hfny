/**
 * One-time migration: uploads local product images to Supabase Storage
 * and inserts all products from src/data.ts into the products table.
 *
 * Prerequisites:
 *   1. Run supabase/setup.sql in Supabase SQL Editor
 *   2. Create public bucket "product-images" and run supabase/storage-policies.sql
 *   3. Enable Realtime on products table (Database > Replication)
 *   4. Set env vars in .env (see .env.example)
 *
 * Usage: npm run migrate:products
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env\n' +
      'Get sb_secret_... from Supabase Dashboard > Settings > API > Secret keys'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const BUCKET = 'product-images';

function resolveLocalImage(imagePath) {
  const relative = imagePath.replace(/^\//, '');
  let localPath = path.join(ROOT, 'public', relative);

  if (imagePath.includes('/قسم اللحوم/')) {
    const webpPath = localPath.replace(/\.(png|jpe?g)$/i, '.webp');
    if (fs.existsSync(webpPath)) localPath = webpPath;
  }

  return localPath;
}

function productToRow(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    unit: product.unit,
    image: product.image,
    category: product.category,
    rating: product.rating ?? 4.5,
    is_available: product.isAvailable ?? true,
    tag: product.tag ?? null,
    original_price: product.originalPrice ?? null,
    min_quantity: product.minQuantity ?? null,
    quantity_step: product.quantityStep ?? null,
  };
}

async function uploadImage(localPath, product) {
  const ext = path.extname(localPath).slice(1).toLowerCase() || 'jpg';
  const storagePath = `${product.category}/${product.id}.${ext}`;

  const fileBuffer = fs.readFileSync(localPath);
  const contentType =
    ext === 'webp' ? 'image/webp' :
    ext === 'png' ? 'image/png' :
    ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
    'application/octet-stream';

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { upsert: true, contentType });

  if (error) throw new Error(`Upload failed for ${product.id}: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function main() {
  const { PRODUCTS } = await import('../src/data.ts');

  console.log(`Migrating ${PRODUCTS.length} products...\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of PRODUCTS) {
    try {
      const localPath = resolveLocalImage(product.image);
      let imageUrl = product.image;

      if (fs.existsSync(localPath)) {
        imageUrl = await uploadImage(localPath, product);
        uploaded += 1;
        console.log(`✓ ${product.id}: uploaded image`);
      } else {
        console.warn(`⚠ ${product.id}: local image not found (${localPath}), keeping path as-is`);
        skipped += 1;
      }

      const row = productToRow({ ...product, image: imageUrl });
      const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });

      if (error) throw error;
      console.log(`  → inserted/updated ${product.name}`);
    } catch (err) {
      failed += 1;
      console.error(`✗ ${product.id}:`, err.message ?? err);
    }
  }

  console.log(`\nDone. Images uploaded: ${uploaded}, missing: ${skipped}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main();
