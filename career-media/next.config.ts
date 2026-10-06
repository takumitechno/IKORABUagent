import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // next dev が AGENTS.md / CLAUDE.md を自動生成しないようにする（リポジトリのルールファイルと混ざるため）
  agentRules: false,
  // デモ用プロファイルのビルドを本番ビルドと分けて置けるようにする
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // 記事本文 (content/*.md) をサーバー側で読むため、トレース対象に含める
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
