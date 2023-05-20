/** @type {import('next').NextConfig} */

const rehypeHighlight = require("rehype-highlight");
const rehypeSlug = require("rehype-slug");
const rehypeAutolinkHeadings = require("rehype-autolink-headings");
const rehypePrettyCode = require("@fec/rehype-pretty-code");
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  // Your existing module.exports
  experimental: {
    appDir: true,
    mdxRs: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "source.unsplash.com", "cdn.jsdelivr.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
    formats: ["image/webp"],
  },
  eslint: {
    dirs: ["app", "utils", "components"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_SITE_KEY: process.env.NEXT_PUBLIC_SITE_KEY,
  },
};

const withMDX = require("@next/mdx")({
  options: {
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
    ],
  },
});
module.exports = withPWA(withMDX(nextConfig));
