import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    if (token && url.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!token && url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.log("[PROXY_ERROR]: ", error);
  }
}

export const config = {
  matcher: ["/", "/login", "/dashboard"],
};
