import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果您要部署到 GitHub Pages 子目录，取消下面的注释
  // basePath: '/my-personal-blog',
  // 如果您使用动态路由，取消下面的注释
  // trailingSlash: true,
  // 可选：生成静态页面时不生成 .html 扩展名
  // 如果启用，访问 /about 会查找 about/index.html
  // 如果禁用，访问 /about 会查找 about.html
  // 根据您的需求选择
  // cleanUrls: true,
  // 可选：为静态导出生成 404 页面
  // 如果使用 Vercel 部署，可以不需要这个
  // generateBuildId: () => 'build',
};

export default nextConfig;
