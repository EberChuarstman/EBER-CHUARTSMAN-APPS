import assert from "node:assert/strict";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import test from "node:test";

const testPassword = randomBytes(24).toString("base64url");
const testSalt = randomBytes(16);
const testIterations = 150_000;
const testPasswordHash = pbkdf2Sync(testPassword, testSalt, testIterations, 32, "sha256");

const testEnv = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD_RECORD: `pbkdf2-sha256$${testIterations}$${testSalt.toString("base64url")}$${testPasswordHash.toString("base64url")}`,
  ADMIN_SESSION_SECRET: randomBytes(48).toString("base64url"),
};

const testContext = {
  waitUntil() {},
  passThroughOnException() {},
};

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const worker = await loadWorker();

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    testEnv,
    testContext,
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("validates the complete administrator authentication flow", async () => {
  const worker = await loadWorker();

  const wrongPasswordResponse = await worker.fetch(
    new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "senha-incorreta" }),
    }),
    testEnv,
    testContext,
  );
  assert.equal(wrongPasswordResponse.status, 401);
  assert.equal((await wrongPasswordResponse.json()).error, "Usuário ou senha incorretos.");

  const loginResponse = await worker.fetch(
    new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "admin", password: testPassword }),
    }),
    testEnv,
    testContext,
  );
  assert.equal(loginResponse.status, 200);
  assert.equal((await loginResponse.clone().json()).authenticated, true);

  const sessionCookie = loginResponse.headers.getSetCookie()
    .find((cookie) => cookie.startsWith("__Host-saudehub_admin_session="));
  assert.ok(sessionCookie);
  assert.match(sessionCookie, /HttpOnly/i);
  assert.match(sessionCookie, /Secure/i);
  assert.match(sessionCookie, /SameSite=Strict/i);

  const sessionResponse = await worker.fetch(
    new Request("http://localhost/api/admin/session", {
      headers: { cookie: sessionCookie.split(";", 1)[0] },
    }),
    testEnv,
    testContext,
  );
  assert.equal(sessionResponse.status, 200);
  assert.equal((await sessionResponse.json()).authenticated, true);

  const logoutResponse = await worker.fetch(
    new Request("http://localhost/api/admin/logout", { method: "POST" }),
    testEnv,
    testContext,
  );
  assert.equal(logoutResponse.status, 200);
  assert.ok(logoutResponse.headers.getSetCookie().some((cookie) =>
    cookie.startsWith("__Host-saudehub_admin_session=") && /Max-Age=0/i.test(cookie)
  ));
});
