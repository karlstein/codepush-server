// app/api/set-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ErrorModel, TokenModel } from "@/types";

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
