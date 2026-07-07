/**
 * Debug Supabase events fetch — run: npm run debug:supabase
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const env = {};
  const content = readFileSync(resolve(__dirname, "../.env"), "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

const env = loadEnv();
const url = env.EXPO_PUBLIC_SUPABASE_URL;
const key = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("=== Invyra Supabase Debug ===\n");
console.log("URL:", url ? "OK" : "MISSING");
console.log("Key:", key ? `${key.slice(0, 20)}...` : "MISSING");

async function rest(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  return { status: res.status, body };
}

for (const [label, path] of [
  ["All events", "events?select=id,title&limit=5"],
  ["Featured Kinshasa", "events?select=id,title&city_id=eq.kinshasa&featured=eq.true"],
  ["Full join", "events?select=*,categories(*),organizers(*)&limit=2"],
  ["Categories", "categories?select=id,name&limit=3"],
  ["Bad JWT", null],
]) {
  if (label === "Bad JWT") {
    const res = await fetch(`${url}/rest/v1/events?select=id&limit=1`, {
      headers: {
        apikey: key,
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid",
      },
    });
    console.log(`\n[${label}] HTTP ${res.status}`);
    console.log(await res.text());
    continue;
  }

  const { status, body } = await rest(path);
  console.log(`\n[${label}] HTTP ${status}`);
  try {
    const json = JSON.parse(body);
    console.log(Array.isArray(json) ? `${json.length} rows` : body.slice(0, 200));
    if (Array.isArray(json)?.[0]?.title) console.log("  →", json[0].title);
  } catch {
    console.log(body.slice(0, 300));
  }
}

console.log("\n=== Done ===");
