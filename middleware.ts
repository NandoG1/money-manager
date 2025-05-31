import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: response.headers,
      });
    }
    
    return response;
  }
  
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/account') ||
    request.nextUrl.pathname.startsWith('/income') ||
    request.nextUrl.pathname.startsWith('/expense') ||
    request.nextUrl.pathname.startsWith('/transfer') ||
    request.nextUrl.pathname.startsWith('/saving') ||
    request.nextUrl.pathname.startsWith('/category') ||
    request.nextUrl.pathname.startsWith('/quiz')
  ) {
    const session = await auth();

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard',
    '/account',
    '/income',
    '/expense',
    '/transfer',
    '/saving',
    '/category',
    '/quiz/:path*'
  ],
};
