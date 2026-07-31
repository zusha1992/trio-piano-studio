import { getCloudflareContext } from '@opennextjs/cloudflare';

// Serves objects from the R2 media bucket at /media/<key>, same-origin so no
// custom domain is needed. Long-cache immutable: uploads use content-hashed
// keys, so a changed image gets a new key rather than overwriting.
export const dynamic = 'force-dynamic';

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

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}
