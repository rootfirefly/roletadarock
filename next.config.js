/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        encoding: false,
      }
    }
    return config
  },
  images: {
    domains: ["rockfeller.com.br"],
  },
}

module.exports = nextConfig

