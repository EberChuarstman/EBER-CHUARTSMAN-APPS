export const ADMIN_SESSION_COOKIE = "__Host-saudehub_admin_session";
export const ADMIN_ATTEMPTS_COOKIE = "__Host-saudehub_admin_attempts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const PASSWORD_RECORD_PREFIX = "pbkdf2-sha256";

type RuntimeEnv = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_RECORD?: string;
  ADMIN_SESSION_SECRET?: string;
};

type RuntimeGlobal = typeof globalThis & {
  __SAUDEHUB_RUNTIME_ENV__?: RuntimeEnv;
};

type AdminSession = {
  v: 1;
  sub: string;
  role: "admin";
  exp: number;
};

export type AdminAttempts = {
  v: 1;
  count: number;
  lockedUntil: number;
  exp: number;
};

export class AdminAuthConfigurationError extends Error {
  constructor() {
    super("Admin authentication is not configured.");
    this.name = "AdminAuthConfigurationError";
  }
}

function getRuntimeConfig() {
  const runtimeEnv = (globalThis as RuntimeGlobal).__SAUDEHUB_RUNTIME_ENV__;
  const username = runtimeEnv?.ADMIN_USERNAME?.trim();
  const passwordRecord = runtimeEnv?.ADMIN_PASSWORD_RECORD?.trim();
  const sessionSecret = runtimeEnv?.ADMIN_SESSION_SECRET?.trim();

  if (!username || !passwordRecord || !sessionSecret || sessionSecret.length < 32) {
    throw new AdminAuthConfigurationError();
  }

  return { username, passwordRecord, sessionSecret };
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

async function derivePassword(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function createSignedToken(payload: AdminSession | AdminAttempts) {
  const { sessionSecret } = getRuntimeConfig();
  const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = toBase64Url(await hmac(encodedPayload, sessionSecret));
  return `${encodedPayload}.${signature}`;
}

async function readSignedToken<T extends AdminSession | AdminAttempts>(token: string | undefined) {
  if (!token) return null;

  const { sessionSecret } = getRuntimeConfig();

  try {
    const [encodedPayload, encodedSignature, ...extra] = token.split(".");
    if (!encodedPayload || !encodedSignature || extra.length > 0) return null;

    const expectedSignature = await hmac(encodedPayload, sessionSecret);
    const actualSignature = fromBase64Url(encodedSignature);
    if (!constantTimeEqual(expectedSignature, actualSignature)) return null;

    const payload = JSON.parse(decoder.decode(fromBase64Url(encodedPayload))) as T;
    if (!payload || payload.v !== 1 || !Number.isFinite(payload.exp) || payload.exp <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(username: string, password: string) {
  const { username: configuredUsername, passwordRecord } = getRuntimeConfig();
  const [prefix, iterationText, saltText, expectedText, ...extra] = passwordRecord.split("$");
  const iterations = Number(iterationText);

  if (
    prefix !== PASSWORD_RECORD_PREFIX ||
    !Number.isInteger(iterations) ||
    iterations < 100_000 ||
    !saltText ||
    !expectedText ||
    extra.length > 0
  ) {
    throw new AdminAuthConfigurationError();
  }

  const actualPassword = await derivePassword(password, fromBase64Url(saltText), iterations);
  const expectedPassword = fromBase64Url(expectedText);
  const usernameMatches = constantTimeEqual(encoder.encode(username), encoder.encode(configuredUsername));
  return usernameMatches && constantTimeEqual(actualPassword, expectedPassword);
}

export async function createAdminSessionToken() {
  const { username } = getRuntimeConfig();
  return createSignedToken({
    v: 1,
    sub: username,
    role: "admin",
    exp: Date.now() + SESSION_DURATION_SECONDS * 1000,
  });
}

export async function readAdminSession(token: string | undefined) {
  const payload = await readSignedToken<AdminSession>(token);
  if (!payload || payload.role !== "admin" || typeof payload.sub !== "string") return null;
  return payload;
}

export async function createAdminAttemptsToken(attempts: Omit<AdminAttempts, "v">) {
  return createSignedToken({ v: 1, ...attempts });
}

export async function readAdminAttempts(token: string | undefined) {
  const payload = await readSignedToken<AdminAttempts>(token);
  if (
    !payload ||
    !Number.isInteger(payload.count) ||
    payload.count < 0 ||
    !Number.isFinite(payload.lockedUntil)
  ) return null;
  return payload;
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
};

export const adminSessionMaxAge = SESSION_DURATION_SECONDS;
