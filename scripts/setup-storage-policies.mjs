/**
 * Apply storage RLS policies so authenticated admin can upload/delete images.
 * Usage: npm run setup:storage
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
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !secretKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

const admin = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function applyPoliciesViaSql() {
  const sqlPath = path.join(ROOT, 'supabase/storage-policies.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'));

  // Prefer database query endpoint when available
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (res.ok) {
    console.log('✓ Storage policies applied via Management API');
    return true;
  }

  const body = await res.text();
  console.warn('Management API unavailable:', res.status, body.slice(0, 180));

  for (const stmt of statements) {
    const { error } = await admin.rpc('exec_sql', { query: stmt });
    if (error) {
      console.warn('rpc exec_sql unavailable:', error.message);
      return false;
    }
  }
  console.log('✓ Storage policies applied via rpc');
  return true;
}

async function verifyUpload() {
  if (!anonKey) {
    console.warn('Skip verify: missing VITE_SUPABASE_ANON_KEY');
    return;
  }

  const client = createClient(supabaseUrl, anonKey);
  const { error: loginError } = await client.auth.signInWithPassword({
    email: (process.env.ADMIN_EMAIL || 'adminalhfny@mzraa-alhfny.com').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Alhfny@123',
  });
  if (loginError) throw new Error(`Login verify failed: ${loginError.message}`);

  const pathKey = `meat/_policy-check-${Date.now()}.jpg`;
  const buf = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
  const { error: uploadError } = await client.storage
    .from('product-images')
    .upload(pathKey, buf, { contentType: 'image/jpeg', upsert: true });

  if (uploadError) {
    throw new Error(
      `Upload still blocked: ${uploadError.message}\n` +
        'Open Supabase SQL Editor and run supabase/storage-policies.sql manually.'
    );
  }

  await client.storage.from('product-images').remove([pathKey]);
  console.log('✓ Authenticated upload verified');
}

async function main() {
  console.log('=== Apply Storage Policies ===\n');
  const applied = await applyPoliciesViaSql();
  if (!applied) {
    console.log(
      '\n⚠ Could not apply SQL automatically.\n' +
        'Please open Supabase Dashboard → SQL Editor and run:\n' +
        '  supabase/storage-policies.sql\n'
    );
  }
  await verifyUpload();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('\n❌', err.message ?? err);
  process.exit(1);
});
