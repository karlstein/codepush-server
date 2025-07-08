// app/api/set-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ErrorModel, TokenModel } from "@/types";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      throw { status: 400, message: "token is required" };
    }

    const decoded = jwtDecode<TokenModel>(token);
    const unix = new Date().getTime() / 1000;

    if (decoded.exp < unix) {
      throw { status: 400, message: "token is expired" };
    }

    const response = NextResponse.json({ message: `Cookie-Set` });
    const authToken = response.cookies.get("auth_token");

    console.info("set-cookie - authToken", authToken);

    if (authToken)
      return NextResponse.json({ message: `Cookie 'auth_token' already set` });

    const option: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    };

    if (process.env.NODE_ENV === "production") {
      option.domain = process.env.NEXT_PUBLIC_BASE_URL;
      option.sameSite = "none";
      option.secure = true;
    }

    console.info("set-cookie - option", option);

    response.cookies.set("auth_token", token, option);

    return response;
  } catch (error) {
    const newErr: ErrorModel = error as ErrorModel;

    if (typeof newErr === "string")
      return NextResponse.json(
        { error: newErr },
        { status: 500, statusText: newErr }
      );

    return NextResponse.json(
      { error: newErr.message },
      { status: newErr.status, statusText: newErr.message } // Bad Request
    );
  }
}
