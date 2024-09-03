// import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import rehypeHighlight from "rehype-highlight";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

import { compileMDX } from "next-mdx-remote/rsc";

import type { BlogPost, Meta } from "types/types";
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

export async function getPostByName(
  fileName: string,
): Promise<BlogPost | undefined> {
  const res = await fetch(
    `https://raw.githubusercontent.com/nucternal18/blogs/main/${fileName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.REPO_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
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
    },
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
