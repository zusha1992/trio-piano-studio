import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Phase 1: minimal config to get the app running on Workers.
// Later phases will enable the R2 incremental cache for ISR:
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
export default defineCloudflareConfig({});
