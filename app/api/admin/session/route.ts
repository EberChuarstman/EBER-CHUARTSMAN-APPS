import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  AdminAuthConfigurationError,
  readAdminSession,
} from "@/app/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
    return NextResponse.json(
      session ? { authenticated: true, role: "admin" } : { authenticated: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      return NextResponse.json(
        { authenticated: false, configured: false },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
}
