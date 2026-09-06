import Link from 'next/link'
import { Clock } from 'lucide-react'
import CategoryLabel from '../../../../components/category-label'
import { getPostsMeta, getPostByName } from '../../../../lib/posts'
import Date from '../../../../components/date'
import { notFound } from 'next/navigation'

import Image from 'next/image'
import 'highlight.js/styles/github-dark.css'
import { Button } from '@components/ui/button'

export const revalidate = 86400

export async function generateStaticParams() {
  const posts = await getPostsMeta()

  if (!posts) return []

  return posts.map((post) => ({
    params: {
      id: post.id,
    },
  }))
}

export async function generateMetadata({ params: { id } }: { params: { id: string } }) {
  const post = await getPostByName(`${id}.mdx`)

  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: `${post.meta.title} | aolausoro.tech`,
  }
}

export default async function Post({ params: { id } }: { params: { id: string } }) {
  const post = await getPostByName(`${id}.mdx`)

  if (!post) notFound()

  const { contentHtml, meta } = post

  return (
    <section className="text-primary mx-auto h-full grow px-4 py-4 md:container md:max-w-5xl md:px-10">
      <Button asChild>
        <Link href="/blog" className="text-lg font-bold">
          Go Back
        </Link>
      </Button>
      <section className="shadow-ld mt-6 w-full rounded-lg py-6 dark:shadow-lg">
        <div className="mt-4 flex w-full flex-col">
          <h1 className="mb-7 text-3xl">{meta.title}</h1>
          <CategoryLabel variant={meta.category} />
        </div>
        <div className="my-8 flex items-center justify-between rounded-sm bg-zinc-800 p-2 dark:bg-zinc-100">
          <div className="relative flex items-center">
            <Image
              src={meta.author_image}
              alt="author image"
              width={40}
              height={40}
              className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
            />
            <h4 className="text-zinc-100 dark:text-zinc-800">{meta.author}</h4>
          </div>
          <div className="mr-4 flex items-center gap-4 text-zinc-100 dark:text-zinc-800">
            {meta.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{meta.readTime}</span>
              </div>
            )}
            <Date dateString={meta.date} />
          </div>
        </div>
        <article className="blog-text text-primary prose lg:prose-2xl mt-2 w-full">
          {contentHtml}
        </article>
      </section>
    </section>
  )
}
