/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_API_URL}/:path*`, // Proxy to backend
      },
    ]
  },
}

module.exports = {
  reactStrictMode: true,
}
