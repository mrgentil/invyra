"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "./LogoutButton";
import {
  IconBookings,
  IconCategories,
  IconClose,
  IconDashboard,
  IconEvents,
  IconMenu,
  IconOrganizers,
  IconUsers,
} from "./icons";

function IconApplications({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

const nav = [
  { href: "/", label: "Tableau de bord", icon: IconDashboard, exact: true },
  { href: "/events", label: "Événements", icon: IconEvents },
  { href: "/users", label: "Utilisateurs", icon: IconUsers },
  { href: "/bookings", label: "Réservations", icon: IconBookings },
  { href: "/categories", label: "Catégories", icon: IconCategories },
  { href: "/organizers", label: "Organisateurs", icon: IconOrganizers },
  { href: "/organizer-applications", label: "Demandes org.", icon: IconApplications },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <span className="text-sm font-bold text-white">I</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">Invyra</div>
          <div className="truncate text-xs text-zinc-400">Administration</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Menu</p>
        {nav.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-indigo-300" : ""}`} />
              {item.label}
              {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{username}</p>
              <p className="text-[11px] text-zinc-500">Administrateur</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <IconMenu />
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0c0e14] transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Fermer"
        >
          <IconClose className="h-4 w-4" />
        </button>
        {content}
      </aside>
    </>
  );
}
