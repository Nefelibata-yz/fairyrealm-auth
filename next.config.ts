import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  transpilePackages: ["@fairyrealm/shared"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
