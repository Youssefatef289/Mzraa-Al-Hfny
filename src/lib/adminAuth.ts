/** Admin login: Supabase Auth uses email internally; username maps to this domain. */
export const ADMIN_AUTH_DOMAIN = 'mzraa-alhfny.com';
export const ADMIN_USERNAME = 'adminAlhfny';
export const ADMIN_AUTH_EMAIL = `${ADMIN_USERNAME}@${ADMIN_AUTH_DOMAIN}`;

export function usernameToAuthEmail(username: string): string {
  const trimmed = username.trim();
  if (!trimmed) return '';
  if (trimmed.includes('@')) return trimmed.toLowerCase();
  return `${trimmed.toLowerCase()}@${ADMIN_AUTH_DOMAIN}`;
}
