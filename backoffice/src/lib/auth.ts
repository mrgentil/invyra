import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "backoffice_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return (
    process.env.BACKOFFICE_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "invyra-dev-session-secret"
  );
}

export function parseCredentials() {
  const raw = process.env.BACKOFFICE_BASIC_AUTH;
  if (!raw) return null;
  const idx = raw.indexOf(":");
  if (idx <= 0) return null;
  return {
    username: raw.slice(0, idx),
    password: raw.slice(idx + 1),
  };
}

export function verifyCredentials(username: string, password: string) {
  const expected = parseCredentials();
  if (!expected) return true;
  const userOk = timingSafeEqualStr(username, expected.username);
  const passOk = timingSafeEqualStr(password, expected.password);
  return userOk && passOk;
}

function timingSafeEqualStr(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(username: string) {
  const issuedAt = Date.now();
  const payload = `${username}:${issuedAt}`;
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payload = "";
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  const [, issuedAtRaw] = payload.split(":");
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > MAX_AGE_MS) return false;

  return true;
}

export function getSessionUsername(token: string | undefined | null) {
  if (!verifySessionToken(token)) return null;
  const [payloadB64] = token!.split(".");
  const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  return payload.split(":")[0] ?? null;
}

export { COOKIE_NAME };
