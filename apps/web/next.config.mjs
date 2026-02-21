/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@taskflow/core",
    "@taskflow/db",
    "@taskflow/ui",
    "@taskflow/api",
  ],
};

export default nextConfig;
