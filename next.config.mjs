/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
