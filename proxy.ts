import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: Request) {
  const session = await auth()
  const { pathname } = new URL(request.url)

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/painel", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/painel/:path*", "/admin/:path*"],
}
