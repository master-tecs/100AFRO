import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = (token as any)?.role === "ADMIN";
    const pathname = req.nextUrl.pathname;

    // Allow access to login page without authentication
    if (pathname === "/admin/login") {
      // If already logged in as admin, redirect to dashboard
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // For other admin routes, check if user is admin
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Always allow access to login page
        if (pathname === "/admin/login") {
          return true;
        }

        // For other admin routes, require admin role
        if (pathname.startsWith("/admin")) {
          return (token as any)?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
