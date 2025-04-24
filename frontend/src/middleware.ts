// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") || "http"; // Detect protocol
  const hostname = req.nextUrl.host; // Get domain
  const fullURL = `${protocol}://${hostname}`;

  const response = NextResponse.next();
  response.cookies.set("hostname", fullURL, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: "/:path*", // Apply to all routes
};
