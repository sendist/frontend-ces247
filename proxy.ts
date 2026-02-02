import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Generate a random nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 2. Define a strict CSP using the nonce
  // Note: 'strict-dynamic' helps automate trust for legitimate sub-scripts
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self' http://localhost:3000 http://localhost:3001;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.delete('X-Powered-By');
  return response;
}