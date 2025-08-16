import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If we're on a secure connection, enforce secure cookies
          if (request.url.startsWith('https://')) {
            options.secure = true
          }
          
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/demo', '/auth/signin', '/auth/signup', '/auth/reset-password', '/auth/verify-email', '/auth/update-password']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)

  // Always allow public routes without session checks
  if (isPublicRoute) {
    return response
  }

  // Check if we have a session only for protected routes
  const { data: { session }, error } = await supabase.auth.getSession()

  // If there's an error getting the session, allow the request to proceed
  // This prevents redirect loops when session is being established
  if (error) {
    console.warn('Session error in middleware:', error.message)
    return response
  }

  // If there's no session and the user is trying to access a protected route
  if (!session) {
    // Check if there's a pending authentication token in cookies
    // This helps handle the case where anonymous sign-in is in progress
    const authToken = request.cookies.get('sb-access-token') || 
                     request.cookies.get('supabase-auth-token') ||
                     request.cookies.get('sb-refresh-token')

    if (authToken) {
      // If there's an auth token but no session yet, allow the request
      // The session might be in the process of being established
      console.log('Auth token found but no session yet, allowing request')
      return response
    }

    // Only redirect to sign-in if we're sure there's no authentication in progress
    const referer = request.headers.get('referer')
    const isFromDemo = referer?.includes('/demo')
    
    if (isFromDemo) {
      // If coming from demo page, allow a brief moment for session to establish
      console.log('Request from demo page, allowing through')
      return response
    }

    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If there's a session and the user is trying to access auth routes
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/schedule', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}