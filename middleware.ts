import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth

  // Protect admin routes
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/account', nextUrl))
    }
    const role = session.user?.role
    if (role !== 'ADMIN' && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', nextUrl))
    }
  }

  // Protect checkout — redirect with callbackUrl so user returns after login
  if (nextUrl.pathname === '/checkout') {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/account?callbackUrl=/checkout`, nextUrl)
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/checkout'],
}
