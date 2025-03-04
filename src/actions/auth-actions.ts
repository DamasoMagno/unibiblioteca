"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_COOKIE_NAME,
  PRIVATE_ROUTES,
  ROOT_ROUTE,
} from "@/constants/routes";

export async function createSession(uid: string) {
  let sessionCookies = await cookies();

  sessionCookies.set(SESSION_COOKIE_NAME, uid, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(PRIVATE_ROUTES[0]);
}

export async function removeSession() {
  let sessionCookies = await cookies();
  sessionCookies.delete(SESSION_COOKIE_NAME);

  redirect(ROOT_ROUTE);
}
