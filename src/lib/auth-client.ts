// ─── Client-side auth helpers ──────────────────────────────────────────────
//
// The real auth state lives in a signed HttpOnly cookie that JavaScript cannot
// read. These helpers let admin pages detect whether *some* auth cookie is
// present (so we can redirect to the login page early) without ever touching
// the token value itself. All real authorization happens server-side in
// lib/auth.ts#requireAdmin.

export function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return /(?:^|; )pm_logged_in=/.test(document.cookie);
}

/** Redirect to /admin (the login page) if no auth cookie is present. */
export function requireAuthClientSide(router: { push: (path: string) => void }): boolean {
  if (!hasAuthCookie()) {
    router.push('/admin');
    return false;
  }
  return true;
}
