import path from "node:path";
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// NOTE: the repo-root .env is loaded for the server runtime by
// apps/web/instrumentation.ts — env mutations in this file (config context)
// do not reach request handlers.

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  // Trace workspace packages from the monorepo root, not just apps/web.
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  cacheComponents: true,
  partialPrefetching: true,
  // Workspace packages ship TypeScript source — compile them with the app.
  transpilePackages: ["@atom/db", "@atom/shared"],
  // Don't advertise the framework.
  poweredByHeader: false,
  // Playwright and other tools probe the dev server over 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    // Security headers for production. Dev is exempt: Turbopack's HMR relies
    // on inline scripts that a strict CSP would block.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js injects inline bootstrap scripts; a nonce-based CSP is
              // the hardening path (see docs/NEXTJS-STANDARDS.md).
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default bundleAnalyzer(nextConfig);
