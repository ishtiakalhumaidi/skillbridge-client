/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://skillbridge-server-xi.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;