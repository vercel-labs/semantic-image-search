/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ztaacy9ly66axcws.public.blob.vercel-storage.com',
        port: '',
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
