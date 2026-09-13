import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Payload's /admin/create-first-user route has no built-in gate against
 * being reached once an admin account already exists — confirmed live: it
 * renders HTTP 200 with the signup form regardless of how many users are
 * already in the users collection. This is a single-admin site, so the
 * route is blocked outright here rather than relied on to self-gate.
 *
 * Named `proxy` (not `middleware`) per Next.js 16's renamed convention —
 * `middleware.ts`/`export function middleware` is deprecated in favor of
 * `proxy.ts`/`export function proxy`. See:
 * https://nextjs.org/docs/messages/middleware-to-proxy
 */
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: '/admin/create-first-user',
}
