// import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import rehypeHighlight from "rehype-highlight";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

import { compileMDX } from "next-mdx-remote/rsc";

import type { BlogPost, Meta } from "types";
import CustomImage from "@components/custom-image";
import Video from "@components/Video";
import { mdxComponents, useMDXComponents } from "@components/mdx-components";

type Filetree = {
  tree: [
    {
      path: string;
    },
  ];
};

type NodeProps = {
  children: { type: string; value: string }[];
  properties: {
    className: string[];
  };
};

/**
 * Calculates the estimated reading time for a given text content
 * @param content - The raw MDX content string
 * @returns Formatted read time string (e.g., "5 min read" or "1 min read")
 */
function calculateReadTime(content: string): string {
  // Remove frontmatter (content between --- markers)
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/, "");

  // Remove markdown syntax:
  // - Headers (# ## ###)
  // - Links [text](url)
  // - Images ![alt](url)
  // - Code blocks (```code```)
  // - Inline code (`code`)
  // - Bold/italic (**text** *text*)
  // - Lists (- item, * item, 1. item)
  // - Blockquotes (> text)
  // - Horizontal rules (---)
  const textOnly = withoutFrontmatter
    .replace(/^#{1,6}\s+/gm, "") // Headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links, keep text
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // Images
    .replace(/```[\s\S]*?```/g, "") // Code blocks
    .replace(/`[^`]+`/g, "") // Inline code
    .replace(/\*\*([^\*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^\*]+)\*/g, "$1") // Italic
    .replace(/^[-*+]\s+/gm, "") // Unordered list items
    .replace(/^\d+\.\s+/gm, "") // Ordered list items
    .replace(/^>\s+/gm, "") // Blockquotes
    .replace(/^---+$/gm, "") // Horizontal rules
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  // Count words (split by whitespace and filter out empty strings)
  const wordCount = textOnly
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  // Format: "X min read" or "1 min read" for less than 1 minute
  return `${Math.max(1, minutes)} min read`;
}

export async function getPostByName(
  fileName: string
): Promise<BlogPost | undefined> {
  const res = await fetch(
    `https://raw.githubusercontent.com/nucternal18/blogs/main/${fileName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.REPO_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 60 },
    }
  );


  if (!res.ok) return undefined;

  const rawMDX = await res.text();

  if (rawMDX === "404: Not Found") return undefined;

  const components = useMDXComponents(mdxComponents);

  const { frontmatter, content } = await compileMDX<Meta>({
    source: rawMDX,
    components: {
      Video,
      CustomImage,
      ...components,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
            },
          ],
          // TODO: Fix this type error. Look into right typing for rehypePrettyCode
          [
            rehypePrettyCode as any,
            {
              theme: "github-dark",
              onVisitLine(node: NodeProps) {
                // Prevent lines from collapsing in `display: grid` mode, and allow empty
                // lines to be copy/pasted
                if (node.children.length === 0) {
                  node.children = [{ type: "text", value: " " }];
                }
              },
              onVisitHighlightedLine(node: NodeProps) {
                node.properties.className.push("line--highlighted");
              },
              onVisitHighlightedWord(node: NodeProps) {
                node.properties.className = ["word--highlighted"];
              },
            },
          ],
        ],
      },
    },
  });

  const id = fileName.replace(/\.mdx$/, "");

  // Calculate read time from the raw MDX content
  const readTime = calculateReadTime(rawMDX);

  const blogPostObj: BlogPost = {
    meta: {
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
      cover_image: frontmatter.cover_image,
      excerpt: frontmatter.excerpt,
      category: frontmatter.category,
      author: frontmatter.author,
      author_image: frontmatter.author_image,
      readTime,
    },
    contentHtml: content,
  };

  return blogPostObj;
}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
  const res = await fetch(
    "https://api.github.com/repos/nucternal18/blogs/git/trees/main?recursive=1",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.REPO_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return undefined;

  const repoFiletree: Filetree = await res.json();

  const filesArray = repoFiletree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  const posts: Meta[] = [];

  for (const file of filesArray) {
    const post = await getPostByName(file);
    if (post) {
      const { meta } = post;
      posts.push(meta);
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
