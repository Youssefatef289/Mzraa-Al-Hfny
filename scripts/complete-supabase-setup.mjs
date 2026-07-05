/**
 * Complete one-time Supabase setup (requires SUPABASE_SECRET_KEY in .env):
 * 1. Storage bucket product-images (public)
 * 2. Admin user with confirmed email
 * 3. Migrate all products + images from src/data.ts
 *
 * Usage: npm run setup:supabase
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'adminAlhfny';
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || `${ADMIN_USERNAME}@mzraa-alhfny.com`;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Alhfny@123';
const BUCKET = 'product-images';

if (!supabaseUrl || !secretKey) {
  console.error(
    '❌ Missing SUPABASE_SECRET_KEY in .env\n' +
      '   Dashboard → Project Settings → API → Secret keys → sb_secret_...'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`List buckets: ${error.message}`);

  const exists = buckets?.some((b) => b.id === BUCKET || b.name === BUCKET);
  if (exists) {
    console.log('✓ Storage bucket product-images exists');
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (createError) throw new Error(`Create bucket: ${createError.message}`);
  console.log('✓ Created public bucket product-images');
}

async function ensureAdminUser() {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw new Error(`List users: ${listError.message}`);

  const existing = list.users.find((u) => u.email === ADMIN_EMAIL);

  if (existing) {
    await supabase.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password: ADMIN_PASSWORD,
    });
    console.log(`✓ Admin ready: ${ADMIN_EMAIL} (password updated)`);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error) throw new Error(`Create admin: ${error.message}`);
  console.log(`✓ Admin created: ${ADMIN_EMAIL} (id: ${data.user.id})`);
}

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
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

async function migrateProducts() {
  const { PRODUCTS } = await import('../src/data.ts');

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (count && count >= PRODUCTS.length) {
    console.log(`✓ Products already in DB (${count} rows)`);
    return;
  }

  console.log(`\nMigrating ${PRODUCTS.length} products + images...\n`);
  let ok = 0;
  let fail = 0;
  let missingImages = 0;

  for (const product of PRODUCTS) {
    try {
      const localPath = resolveLocalImage(product.image);
      let imageUrl = product.image;

      if (fs.existsSync(localPath)) {
        imageUrl = await uploadImage(localPath, product);
      } else {
        missingImages += 1;
      }

      const { error } = await supabase
        .from('products')
        .upsert(productToRow({ ...product, image: imageUrl }), { onConflict: 'id' });
      if (error) throw error;

      ok += 1;
      if (ok % 25 === 0) console.log(`  … ${ok}/${PRODUCTS.length}`);
    } catch (err) {
      fail += 1;
      console.error(`✗ ${product.id}:`, err.message ?? err);
    }
  }

  console.log(`\n✓ Migration: ${ok} products, ${missingImages} missing local images, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

async function applyStoragePolicies() {
  const sql = fs.readFileSync(path.join(ROOT, 'supabase/storage-policies.sql'), 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'));

  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: stmt });
    if (error) {
      console.log('· Storage policies: apply manually via SQL Editor if uploads fail for admin');
      return;
    }
  }
  console.log('✓ Storage policies applied');
}

async function main() {
  console.log('=== Mzraa-Al-Hfny Supabase Setup ===\n');
  await ensureBucket();
  await applyStoragePolicies();
  await ensureAdminUser();
  await migrateProducts();

  console.log('\n=== Done ===');
  console.log(`Login:  ${ADMIN_EMAIL}`);
  console.log(`Pass:   ${ADMIN_PASSWORD}`);
  console.log('URL:    http://localhost:3001/admin/login');
  console.log('\n⚠ Enable Realtime manually: Dashboard → Database → Replication → products');
  console.log('⚠ Apply storage-policies.sql in SQL Editor if admin image upload fails');
  console.log('⚠ Change admin password after first login');
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message ?? err);
  process.exit(1);
});
