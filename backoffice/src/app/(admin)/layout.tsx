import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin/AdminShell";
import { COOKIE_NAME, getSessionUsername } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const username = getSessionUsername(cookieStore.get(COOKIE_NAME)?.value) ?? "Admin";

  return <AdminShell username={username}>{children}</AdminShell>;
}
