/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['res.cloudinary.com'], // ✅ Allow Cloudinary for next/image
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/:path*`, // Just leave as string, no template literal
      },
    ];
  },
}

export default nextConfig
