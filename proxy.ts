import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session-crypto";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const session = await decrypt(token);

  // Admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Participant dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/pronosticos") || pathname.startsWith("/bonus")) {
    if (!session || session.role !== "participant") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (session) {
    if (pathname === "/login" && session.role === "participant") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname === "/admin/login" && session.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
