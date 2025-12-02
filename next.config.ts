import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ['config.ton.org'], // разрешаем этот хост
  },
}

export default nextConfig
