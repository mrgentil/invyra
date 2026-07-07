const url = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://mqzzsjfjugblwliotpjw.supabase.co";
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_t9FLWeIFIuUC0e09fKFR_w_-GO6fJ8W";

const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com", password: "wrongpassword" }),
});

console.log("Status:", res.status);
console.log(await res.text());
