import { type NextRequest, NextResponse } from "next/server";

import {
  PRIVATE_ROUTES,
  SESSION_COOKIE_NAME,
  ROOT_ROUTE,
} from "./constants/routes";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  if (!session && PRIVATE_ROUTES.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
