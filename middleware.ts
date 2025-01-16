import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const publicRoutes = ['/', '/about', '/contact']
const privateRoutes = ['/result', '/select', '/videos'] // Add private routes here

export async function middleware(request: NextRequest) {
  // Retrieve the session
  const session = await getKindeServerSession()

  // Await the result of isAuthenticated
  const isAuthed = await session.isAuthenticated()

  // Check if the request matches a public route
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Check if the request matches a private route
  const isPrivateRoute = privateRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Debug logs
  console.log('Session:', session)
  console.log('Is Authenticated:', isAuthed)
  console.log('Is Public Route:', isPublicRoute)
  console.log('Is Private Route:', isPrivateRoute)

  // Redirect to the homepage if the user is not authenticated and trying to access a private route
  if (!isAuthed && isPrivateRoute) {
    const url = new URL('/', request.url) // Create a URL relative to the request
    return NextResponse.redirect(url)
  }

  // Allow public routes and authenticated private routes
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
