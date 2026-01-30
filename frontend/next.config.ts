import type { NextConfig } from "next";

const nextConfig = {
  output: 'export', // [추가] 정적 HTML 파일들로 추출되게 합니다.
  trailingSlash: true,
  images: {
    unoptimized: true, // S3 배포 시 이미지 최적화 기능을 끌 필요가 있습니다.
  },
};

export default nextConfig;
