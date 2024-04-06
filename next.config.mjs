/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.noitatnemucod.net",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.io",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
    ],
  },
};

export default nextConfig;
