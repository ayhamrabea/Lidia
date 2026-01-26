import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",     // هذا يجعل Next.js يصدر الموقع كـ static HTML
//   assetPrefix: "./",    // لتصحيح مسارات CSS/JS/images بعد الرفع
//   images: {
//     unoptimized: true,  // إذا عندك صور من Next/Image
//   },
// };

// module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     unoptimized: true, // إذا عندك صور من Next/Image
//   },
// };
