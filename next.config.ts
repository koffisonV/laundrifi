import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'laundrifi.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: '192.168.4.100',
        port: '3000',
      },
    ],
  },
  allowedDevOrigins: ['192.168.4.100:3000', 'localhost:3000'],
};

export default nextConfig;
