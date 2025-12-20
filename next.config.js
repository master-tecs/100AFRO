/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
    unoptimized: true, // Required for Cloudflare Pages
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config, { isServer, webpack }) => {
    // Configure fallbacks for Node.js modules (needed for Edge Runtime)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      http: false,
      https: false,
      querystring: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      path: false,
      os: false,
    };
    
    // Ignore cloudinary packages completely (not used, causes Edge Runtime issues)
    // These packages require Node.js built-in modules that don't exist in Edge Runtime
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^cloudinary$/,
        contextRegExp: /.*/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^next-cloudinary$/,
        contextRegExp: /.*/,
      })
    );
    
    return config;
  },
};

module.exports = nextConfig;
