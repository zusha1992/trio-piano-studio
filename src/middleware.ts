import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const CANONICAL_HOST = 'www.triopianostudio.com';

function isLocalHost(host: string) {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

export default function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? request.nextUrl.host;
  const hostname = host.split(':')[0];

  if (!isLocalHost(hostname)) {
    const proto =
      request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');
    const needsHttps = proto === 'http';
    const needsWww = hostname === 'triopianostudio.com';
    if (needsHttps || needsWww) {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      url.hostname = CANONICAL_HOST;
      url.port = '';
      url.host = CANONICAL_HOST;
      return NextResponse.redirect(url, 301);
    }
  }

  const response = intlMiddleware(request);
  // Locale-prefix redirects default to 307; 301 tells Google to keep the
  // canonical /he/… URL rather than the locale-less one.
  if (!isLocalHost(hostname) && (response.status === 307 || response.status === 308)) {
    const location = response.headers.get('location');
    if (location) {
      return NextResponse.redirect(new URL(location, request.url), 301);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
