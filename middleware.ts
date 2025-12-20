import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-edge";

export const runtime = 'experimental-edge';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow access to login page without authentication
  if (pathname === "/admin/login") {
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      const user = await verifyToken(token);
      if (user && user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // For other admin routes, check authentication
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const user = await verifyToken(token);
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
