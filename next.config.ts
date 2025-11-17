import type { NextConfig } from "next";

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Enable React compiler optimizations
  reactStrictMode: true,
  
  // Optimize images and CSS
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@clerk/nextjs',
      'lucide-react',
      'react-markdown',
      'remark-gfm',
      'rehype-highlight',
      'date-fns',
    ],
    // Optimize server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // External packages for server components (moved from experimental)
  serverExternalPackages: ['mermaid', 'react-syntax-highlighter'],

  // Faster dev mode
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25 seconds - faster cleanup
    pagesBufferLength: 2, // Only keep 2 pages in memory
  },

  // Faster builds
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },

  // Webpack configuration for optimizations
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Exclude client-side only packages from server bundle
      config.externals = [...(config.externals || []), 'mermaid'];
    }

    if (!isServer) {
      // Client-side optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Split heavy libraries into separate chunks
            mermaid: {
              test: /[\\/]node_modules[\\/](mermaid)[\\/]/,
              name: 'mermaid',
              priority: 40,
              reuseExistingChunk: true,
            },
            syntaxHighlighter: {
              test: /[\\/]node_modules[\\/](react-syntax-highlighter)[\\/]/,
              name: 'syntax-highlighter',
              priority: 30,
              reuseExistingChunk: true,
            },
            reactMarkdown: {
              test: /[\\/]node_modules[\\/](react-markdown|remark-gfm|rehype-highlight)[\\/]/,
              name: 'markdown',
              priority: 25,
              reuseExistingChunk: true,
            },
            clerk: {
              test: /[\\/]node_modules[\\/](@clerk)[\\/]/,
              name: 'clerk',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common shared libraries
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'commons',
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
