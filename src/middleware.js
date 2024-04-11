import { NextResponse } from "next/server";
import getSession from "./lib/session";

const publicOnlyUrls = {
  "/login": true,
  "/create-account": true,
};

export async function middleware(request) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return Response.redirect(new URL("/login", request.url));
    }
  } else {
    if (exists) {
      return Response.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
