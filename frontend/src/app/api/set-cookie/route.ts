// app/api/set-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      throw { status: 400, message: "token is required" };
    }

    const decoded = jwtDecode<any>(token);
    const unix = new Date().getTime() / 1000;

    if (decoded.exp < unix) {
      throw { status: 400, message: "token is expired" };
    }

    const response = NextResponse.json({ message: `Cookie set` });
    const authToken = response.cookies.get("auth_token");

    if (authToken) return response;

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || error },
      { status: error.status || 500, statusText: error.message || error } // Bad Request
    );
  }
}
