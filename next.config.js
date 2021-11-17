const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'res.cloudinary.com'],
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_SITE_KEY: process.env.NEXT_PUBLIC_SITE_KEY,
  },
});