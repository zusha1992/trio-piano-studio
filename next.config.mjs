import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);

// Makes Cloudflare bindings (D1, R2, env) available during `next dev`.
// No-ops outside local development.
initOpenNextCloudflareForDev();
