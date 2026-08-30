import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Obfuscate /admin: Return 404 for anyone trying to access standard /admin
  if (pathname.startsWith('/admin')) {
    const notFoundUrl = new URL('/_not-found', request.url);
    return NextResponse.rewrite(notFoundUrl);
  }

  // 2. Protect Secret Vault: /sd-ops-vault-9839
  if (pathname.startsWith('/sd-ops-vault-9839')) {
    const token = request.cookies.get('saaterra_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/sd-ops-vault-9839/:path*'],
};
