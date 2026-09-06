import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/refunds",
        destination: "/legal/refunds",
        permanent: true,
      },
      // Post-pay page moved to /thank-you. Checkout Sessions created before
      // the move still carry the old success_url; query strings pass through.
      {
        source: "/checkout/success",
        destination: "/thank-you",
        permanent: true,
      },
      {
        source: "/checkout/success/unlock",
        destination: "/thank-you/unlock",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
