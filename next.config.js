/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atdhhsqommyfdoajrcwu.supabase.co' },
    ],
  },
}
module.exports = nextConfig