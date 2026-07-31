import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Media is pre-converted to WebP and served straight from R2 (via the
    // /media/<key> Worker route) with immutable caching, so we skip Next's
    // image optimizer — on Cloudflare it can't proxy the same-origin R2 route,
    // and re-optimizing already-optimized assets only burns Worker CPU.
    unoptimized: true,
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);

// Makes Cloudflare bindings (D1, R2, env) available during `next dev`.
// No-ops outside local development.
initOpenNextCloudflareForDev();
