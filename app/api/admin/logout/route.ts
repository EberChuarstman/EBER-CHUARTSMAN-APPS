import { NextResponse } from "next/server";
import {
  ADMIN_ATTEMPTS_COOKIE,
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
} from "@/app/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  response.cookies.set(ADMIN_ATTEMPTS_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}
