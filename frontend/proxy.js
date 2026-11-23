import { NextResponse } from "next/server";
import { recordVisit } from "./lib/visits";

export function proxy(request, event) {
  const { pathname } = request.nextUrl;

  event.waitUntil(
    recordVisit(pathname).catch((err) => {
      console.error("visit tracking failed:", err);
    })
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
