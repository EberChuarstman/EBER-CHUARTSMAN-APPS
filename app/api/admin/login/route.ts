import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_ATTEMPTS_COOKIE,
  ADMIN_SESSION_COOKIE,
  AdminAuthConfigurationError,
  adminCookieOptions,
  adminSessionMaxAge,
  createAdminAttemptsToken,
  createAdminSessionToken,
  readAdminAttempts,
  verifyAdminCredentials,
} from "@/app/admin-auth";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_SECONDS = 15 * 60;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 8_192) return json({ error: "Solicitação inválida." }, 413);

    const body = await request.json() as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!username || !password || username.length > 128 || password.length > 256) {
      return json({ error: "Informe o usuário e a senha." }, 400);
    }

    const cookieStore = await cookies();
    const previousAttempts = await readAdminAttempts(cookieStore.get(ADMIN_ATTEMPTS_COOKIE)?.value);
    const now = Date.now();

    if (previousAttempts && previousAttempts.lockedUntil > now) {
      const retryAfter = Math.max(1, Math.ceil((previousAttempts.lockedUntil - now) / 1000));
      const response = json({ error: "Acesso temporariamente bloqueado. Tente novamente mais tarde.", retryAfter }, 429);
      response.headers.set("Retry-After", String(retryAfter));
      return response;
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      const count = Math.min(MAX_ATTEMPTS, (previousAttempts?.count ?? 0) + 1);
      const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCK_DURATION_SECONDS * 1000 : 0;
      const expiresAt = lockedUntil || now + LOCK_DURATION_SECONDS * 1000;
      const response = json({
        error: lockedUntil
          ? "Acesso temporariamente bloqueado. Tente novamente em 15 minutos."
          : "Usuário ou senha incorretos.",
        attemptsRemaining: Math.max(0, MAX_ATTEMPTS - count),
      }, lockedUntil ? 429 : 401);
      response.cookies.set(
        ADMIN_ATTEMPTS_COOKIE,
        await createAdminAttemptsToken({ count, lockedUntil, exp: expiresAt }),
        { ...adminCookieOptions, maxAge: LOCK_DURATION_SECONDS },
      );
      if (lockedUntil) response.headers.set("Retry-After", String(LOCK_DURATION_SECONDS));
      return response;
    }

    const response = json({ authenticated: true, role: "admin" });
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      await createAdminSessionToken(),
      { ...adminCookieOptions, maxAge: adminSessionMaxAge },
    );
    response.cookies.set(ADMIN_ATTEMPTS_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      return json({ error: "O acesso administrativo ainda não foi configurado." }, 503);
    }
    return json({ error: "Não foi possível validar o acesso agora." }, 400);
  }
}
