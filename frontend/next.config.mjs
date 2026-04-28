/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress mapbox-gl worker import warnings in Next.js
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Suppress "Can't resolve 'fs'" from mapbox-gl
      "mapbox-gl": "mapbox-gl",
    };
    return config;
  },
};

export default nextConfig;

