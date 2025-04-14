import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  bodyParser: {
    sizeLimit: '10mb',
  },
};

export default nextConfig;
