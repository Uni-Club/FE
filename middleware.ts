import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")
  const isProtectedPage =
    request.nextUrl.pathname.startsWith("/dashboard") || 
    request.nextUrl.pathname.startsWith("/member") ||
    request.nextUrl.pathname.startsWith("/club/create")

  // Redirect to login if accessing protected page without auth
  if (isProtectedPage && !userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow navigating to /login and /signup even if already logged in
  // (로그인/회원가입 페이지 접근을 막지 않음)

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
