import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MALICIOUS_PATTERNS = [
  /\.env/i,
  /\.git/i,
  /wp-login/i,
  /wp-admin/i,
  /xmlrpc\.php/i,
  /phpmyadmin/i,
  /\.aws/i,
  /\.ssh/i,
  /eval-stdin/i,
  /\.DS_Store/i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Block automated vulnerability scanners & exploit bots
  if (/sqlmap|nikto|wpscan|masscan|dirbuster|nmap|morfeus|zgrab/i.test(userAgent)) {
    return new NextResponse('Blocked by StackDeal Shield', { status: 403 });
  }

  // 2. Block malicious probing attempts (.env, .git, wp-login, etc.)
  if (MALICIOUS_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // 3. Obfuscate /admin: Return 404 for anyone trying to access standard /admin
  if (pathname.startsWith('/admin')) {
    const notFoundUrl = new URL('/_not-found', request.url);
    return NextResponse.rewrite(notFoundUrl);
  }

  // 4. Protect Secret Vault: /sd-ops-vault-9839
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
  matcher: [
    '/admin/:path*',
    '/sd-ops-vault-9839/:path*',
    '/:path*(.env|.git|wp-login|wp-admin|xmlrpc|phpmyadmin)',
  ],
};
