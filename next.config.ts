import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/my-personal-blog',
  // 可选：如果您使用动态路由，请取消下面的注释
  // trailingSlash: true,
};

export default nextConfig;
