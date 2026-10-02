import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Catalogue imagery is local (public/images) or uploaded through the admin
    // panel to Supabase Storage. No stock-photo host is allow-listed, so a
    // stray external URL fails the build rather than shipping silently.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
