import { NextRequest, NextResponse } from "next/server";

// Optimistic redirects based on cookie presence only.
// Actual JWT verification and security enforcement happens inside each
// page/action via verifyAdmin() and verifyParticipant() in lib/dal.ts.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("session");

  if (!hasSession) {
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/pronosticos") ||
      pathname.startsWith("/bonus")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
