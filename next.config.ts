import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The prototype ships no remote images and no telemetry-bearing features.
  poweredByHeader: false,
  reactStrictMode: true,
  // The repo already carries its own agent conventions in ../../agents.md;
  // don't scatter generated ones through the app directory.
  agentRules: false,
  // Keeps the dev overlay out of screenshots used for review and the video.
  devIndicators: false,
};

export default nextConfig;

// Lets `next dev` see Cloudflare bindings (KV) declared in wrangler.jsonc.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
