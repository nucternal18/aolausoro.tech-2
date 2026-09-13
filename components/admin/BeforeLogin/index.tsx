import Link from 'next/link'

/**
 * Rendered above Payload's default login form (admin.components.beforeLogin).
 * Gives a way back to the public site — without it, logging out (or landing
 * on /admin/login directly) leaves the visitor stuck with no way out other
 * than editing the URL by hand.
 */
export function BeforeLogin() {
  return (
    <Link href="/" className="back-to-site">
      ← BACK TO SITE
    </Link>
  )
}
