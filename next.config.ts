import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ['config.ton.org'], // Разрешаем этот хост
  },
}

export default nextConfig
