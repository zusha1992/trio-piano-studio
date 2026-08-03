import type { MetadataRoute } from 'next';

// Points crawlers at the sitemap and keeps the admin/API surface out of the
// index. /media is allowed — those are the site's photos.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://www.triopianostudio.com/sitemap.xml',
  };
}
