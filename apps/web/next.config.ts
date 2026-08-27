import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @mdp/core é consumido como fonte TypeScript direto do workspace
  transpilePackages: ["@mdp/core"],
};

export default nextConfig;
