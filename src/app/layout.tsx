import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "意安序",
  description: "存放思想碎片、深度教程与实用工具的数字领地。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="border-b border-gray-100 py-4 mb-8">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">意安序</Link>
            <div className="space-x-8 text-gray-600">
              <Link href="/library" className="hover:text-black">书阁</Link>
              <Link href="/fragments" className="hover:text-black">思想碎片</Link>
              <Link href="/toolbox" className="hover:text-black">万宝箱</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
