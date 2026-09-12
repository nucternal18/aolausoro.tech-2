import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Rendered above Payload's default admin dashboard — at-a-glance portfolio numbers.
 */
export async function BeforeDashboard() {
  const payload = await getPayload({ config })

  const [messages, issues, projects, latestPost] = await Promise.all([
    payload.count({ collection: 'messages', where: { read: { equals: false } } }),
    payload.count({ collection: 'issues', where: { status: { not_equals: 'CLOSED' } } }),
    payload.count({ collection: 'projects' }),
    payload.find({ collection: 'posts', limit: 1, sort: '-publishedAt', depth: 0 }),
  ])

  const post = latestPost.docs[0]
  const cards: { label: string; value: string | number; sub?: string }[] = [
    { label: 'Unread messages', value: messages.totalDocs },
    { label: 'Open issues', value: issues.totalDocs },
    { label: 'Projects', value: projects.totalDocs },
    {
      label: 'Latest post',
      value: post?.title ?? '—',
      sub: post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : undefined,
    },
  ]

  return (
    <div
      className="before-dashboard"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.label}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{c.value}</div>
          {c.sub && <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{c.sub}</div>}
        </div>
      ))}
    </div>
  )
}
