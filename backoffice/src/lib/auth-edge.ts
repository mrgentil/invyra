const COOKIE_NAME = "backoffice_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return (
    process.env.BACKOFFICE_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "invyra-dev-session-secret"
  );
}

function base64UrlDecode(value: string) {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return atob(base64);
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySessionTokenEdge(token: string | undefined | null) {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payload = "";
  try {
    payload = base64UrlDecode(payloadB64);
  } catch {
    return false;
  }

  const expectedSig = await hmacSha256Hex(getSecret(), payload);
  if (!timingSafeEqualHex(signature, expectedSig)) return false;

  const [, issuedAtRaw] = payload.split(":");
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > MAX_AGE_MS) return false;

  return true;
}

export function parseCredentialsEdge() {
  const raw = process.env.BACKOFFICE_BASIC_AUTH;
  if (!raw) return null;
  const idx = raw.indexOf(":");
  if (idx <= 0) return null;
  return {
    username: raw.slice(0, idx),
    password: raw.slice(idx + 1),
  };
}

export { COOKIE_NAME };
