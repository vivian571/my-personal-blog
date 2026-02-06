import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath: '/my-personal-blog',
  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
