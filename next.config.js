/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // disable browser source maps for smaller bundles
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Performance optimizations for production
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // Enable compression
  compress: true,

  // Bundle analyzer (enable with ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze/client.html',
          }),
        )
      }
      return config
    },
  }),

  experimental: {
    // Optimize package imports for faster loading
    optimizePackageImports: [
      '@heroicons/react',
      'lodash-es',
      'react-syntax-highlighter',
      'ahooks',
    ],
  },

  // fix all before production. Now it slow the develop speed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  output: 'standalone',

  // Headers for caching static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
