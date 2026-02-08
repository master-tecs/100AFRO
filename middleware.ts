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
      if (user) {
        // Redirect based on role
        if (user.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else if (user.role === "AUTHOR") {
          return NextResponse.redirect(new URL("/editor/dashboard", request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // For admin routes, only ADMIN can access
  // Exception: AUTHOR role can access /admin/posts/* routes (create/edit articles)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Allow AUTHOR role to access post creation/editing routes
    if (pathname.startsWith("/admin/posts/") && (user.role === "ADMIN" || user.role === "AUTHOR")) {
      return NextResponse.next();
    }

    // For all other admin routes, only ADMIN can access
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // For editor routes, AUTHOR and ADMIN can access
  if (pathname.startsWith("/editor")) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const user = await verifyToken(token);
    
    if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*"],
};
