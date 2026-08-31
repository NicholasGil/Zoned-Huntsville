import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/refunds",
        destination: "/legal/refunds",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
