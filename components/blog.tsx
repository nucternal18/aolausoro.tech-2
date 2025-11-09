import { ArrowRight, Clock, User } from "lucide-react";
import type { BlogPost } from "types/index";

export function Blog({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-balance">
            Latest Articles
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Insights and learnings from my experience building web applications
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.meta.id}
              className="flex flex-col p-6 rounded-lg border transition-all duration-300 group bg-card border-border hover:border-primary hover:shadow-lg"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary line-clamp-2">
                {post.meta.title}
              </h3>

              {/* Excerpt */}
              <p className="mb-6 grow text-muted-foreground line-clamp-2">
                {post.meta.excerpt}
              </p>

              {/* Meta Info */}
              <div className="pt-4 space-y-3 border-t border-border">
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{post.meta.author}</span>
                </div>
                <div className="flex gap-4 items-center text-sm text-muted-foreground">
                  <div className="flex gap-1 items-center">
                    <Clock className="w-4 h-4" />
                    <span>{post.meta.readTime}</span>
                  </div>
                  <span>{post.meta.date}</span>
                </div>
              </div>

              {/* Read More Link */}
              <a
                href={`/blog/${post.meta.id}`}
                className="inline-flex gap-2 items-center mt-4 font-medium transition-all text-primary group/link hover:gap-3"
              >
                Read Article
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <a
            href="/blog"
            className="inline-flex gap-2 items-center px-6 py-3 font-medium rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
