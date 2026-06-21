/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Compress output for production
  compress: true,
  // Enable React strict mode for catching bugs
  reactStrictMode: true,
  // Power the x-powered-by header off for security
  poweredByHeader: false,
  // Experimental features
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig
