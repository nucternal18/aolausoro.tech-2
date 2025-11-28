/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
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
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
    formats: ["image/webp"],
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // output: "standalone",
};

const withMDX = require("@next/mdx")();

// Injected content via Sentry wizard below
const { withSentryConfig } = require("@sentry/nextjs");

// PWA temporarily disabled due to compatibility issues with Next.js 16
// The next-pwa package has a known issue with pify.bind() error
// TODO: Re-enable when next-pwa is updated or replaced with a compatible alternative
let config = withMDX(nextConfig);

// Uncomment the following code when next-pwa compatibility is fixed:
// if (process.env.NODE_ENV !== "development") {
//   const runtimeCaching = require("next-pwa/cache");
//   const withPWA = require("next-pwa")({
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//     runtimeCaching,
//     disable: false,
//     buildExcludes: [/middleware-manifest\.json$/],
//   });
//   config = withPWA(config);
// }

module.exports = withSentryConfig(config, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "aolausorotech",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
