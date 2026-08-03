import { getCloudflareContext } from '@opennextjs/cloudflare';

// Serves objects from the R2 media bucket at /media/<key>, same-origin so no
// custom domain is needed. Long-cache immutable: uploads use content-hashed
// keys, so a changed image gets a new key rather than overwriting.
export const dynamic = 'force-dynamic';

// Fallback for objects stored without content-type metadata.
const MIME: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
};
const typeFromKey = (key: string) =>
  MIME[key.split('.').pop()?.toLowerCase() ?? ''] ?? 'application/octet-stream';

export async function GET(
  _request: Request,
  { params }: { params: { key: string[] } },
) {
  const key = params.key.map((s) => decodeURIComponent(s)).join('/');
  const { env } = getCloudflareContext();
  const object = await env.MEDIA.get(key);

  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  // Copy the stored metadata across by hand rather than via
  // object.writeHttpMetadata(headers): that call has to send the Headers object
  // over miniflare's RPC proxy in `next dev`, which can't serialize it, so
  // every media request 500s locally.
  const meta = object.httpMetadata;
  const headers = new Headers();
  headers.set('content-type', meta?.contentType || typeFromKey(key));
  if (meta?.contentLanguage) headers.set('content-language', meta.contentLanguage);
  if (meta?.contentDisposition) headers.set('content-disposition', meta.contentDisposition);
  if (meta?.contentEncoding) headers.set('content-encoding', meta.contentEncoding);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}
