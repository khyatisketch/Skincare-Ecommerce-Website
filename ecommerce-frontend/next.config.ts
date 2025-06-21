/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4007/:path*', // Proxy to backend
      },
    ]
  },
}

module.exports = {
  reactStrictMode: true,
}
