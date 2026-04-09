/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger file uploads (up to 10MB)
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'jspdf', 'html2canvas'],
    esmExternals: true,
  },
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Font optimization
  optimizeFonts: true,
  
  // Disable static optimization for dynamic content
  staticPageGenerationTimeout: 30,
  
  // Webpack configuration to ignore jsPDF client-side issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
