/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors on build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors on build
  },
};

module.exports = nextConfig;
