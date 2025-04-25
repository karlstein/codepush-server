// middleware.ts
import { NextResponse } from "next/server";

export function middleware() {
  const fullURL = process.env.NEXTAUTH_URL || "http://localhost:3004";

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
