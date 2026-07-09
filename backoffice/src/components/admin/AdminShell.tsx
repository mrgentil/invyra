import { LogoutButton } from "./LogoutButton";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children, username }: { children: React.ReactNode; username: string }) {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar username={username} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 hidden border-b border-zinc-200/80 bg-white/80 backdrop-blur-md lg:block">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Invyra</p>
              <p className="text-sm font-semibold text-zinc-800">Panneau d&apos;administration</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En ligne
              </span>
              <span className="text-sm text-zinc-500">
                Bonjour, <span className="font-medium text-zinc-800">{username}</span>
              </span>
              <LogoutButton variant="header" />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pt-16 lg:px-8 lg:py-8 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
