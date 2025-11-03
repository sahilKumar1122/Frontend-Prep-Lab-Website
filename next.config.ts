import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Enable React compiler optimizations
  reactStrictMode: true,
  
  // Optimize images and CSS
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@clerk/nextjs'],
  },

  // Webpack configuration for client-side only packages
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude mermaid from server-side bundle
      config.externals = [...(config.externals || []), 'mermaid'];
    }
    return config;
  },
};

export default nextConfig;
