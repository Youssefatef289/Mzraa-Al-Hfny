/**
 * Create or reset the admin user in Supabase Auth.
 * Usage: npm run setup:admin
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'adminAlhfny';
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || `${ADMIN_USERNAME.toLowerCase()}@mzraa-alhfny.com`;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Alhfny@123';

const LEGACY_EMAILS = ['admin.alkhafany@gmail.com'];

if (!supabaseUrl || !secretKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllUsers() {
  const users = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`List users: ${error.message}`);
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }

  return users;
}

async function upsertAdmin(users) {
  const existing = users.find((u) => u.email === ADMIN_EMAIL);

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { username: ADMIN_USERNAME, role: 'admin' },
    });
    if (error) throw new Error(`Update admin: ${error.message}`);
    console.log(`✓ Admin updated: ${ADMIN_USERNAME} (${ADMIN_EMAIL})`);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { username: ADMIN_USERNAME, role: 'admin' },
  });

  if (error?.message?.includes('already been registered')) {
    const refreshed = await listAllUsers();
    const found = refreshed.find((u) => u.email === ADMIN_EMAIL);
    if (!found) throw error;
    const { error: updateError } = await supabase.auth.admin.updateUserById(found.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { username: ADMIN_USERNAME, role: 'admin' },
    });
    if (updateError) throw new Error(`Update admin: ${updateError.message}`);
    console.log(`✓ Admin password reset: ${ADMIN_USERNAME}`);
    return;
  }

  if (error) throw new Error(`Create admin: ${error.message}`);
  console.log(`✓ Admin created: ${ADMIN_USERNAME} (id: ${data.user.id})`);
}

async function main() {
  const users = await listAllUsers();
  await upsertAdmin(users);

  for (const legacyEmail of LEGACY_EMAILS) {
    if (legacyEmail === ADMIN_EMAIL) continue;
    const legacy = users.find((u) => u.email === legacyEmail);
    if (legacy) {
      await supabase.auth.admin.deleteUser(legacy.id);
      console.log(`✓ Removed legacy admin: ${legacyEmail}`);
    }
  }

  const anon = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
  const { error: loginError } = await anon.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (loginError) throw new Error(`Login test failed: ${loginError.message}`);
  console.log('✓ Login test passed');
  console.log(`\nUsername: ${ADMIN_USERNAME}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

main().catch((err) => {
  console.error('❌', err.message ?? err);
  process.exit(1);
});
