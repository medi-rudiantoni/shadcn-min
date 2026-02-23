/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: `https://api-dev.servicehub.id/:path*`,
  //     },
  //   ]
  // },
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/data/images/**",
      },
    ],
  },
  crossOrigin: "anonymous",
};

module.exports = nextConfig;
