import { ArrowRight, Clock, User } from 'lucide-react'
import type { BlogPost } from 'types/index'

export function Blog({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">Latest Articles</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Insights and learnings from my experience building web applications
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.meta.id}
              className="group bg-card border-border hover:border-primary flex flex-col rounded-lg border p-6 transition-all duration-300 hover:shadow-lg"
            >
              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="group-hover:text-primary mb-3 line-clamp-2 text-xl font-bold transition-colors">
                {post.meta.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground mb-6 line-clamp-2 grow">{post.meta.excerpt}</p>

              {/* Meta Info */}
              <div className="border-border space-y-3 border-t pt-4">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{post.meta.author}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.meta.readTime}</span>
                  </div>
                  <span>{post.meta.date}</span>
                </div>
              </div>

              {/* Read More Link */}
              <a
                href={`/blog/${post.meta.id}`}
                className="text-primary group/link mt-4 inline-flex items-center gap-2 font-medium transition-all hover:gap-3"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <a
            href="/blog"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
