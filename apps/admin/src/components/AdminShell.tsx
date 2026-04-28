"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarHeart,
  CalendarDays,
  Gauge,
  Heart,
  LayoutDashboard,
  ListTree,
  Library,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { FirebaseStatus } from "@/components/FirebaseStatus";
import { AuthGate } from "@/components/AuthGate";
import { signOutAdmin } from "@/lib/firebase/auth";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/duas", label: "Dualar", icon: BookOpen },
  { href: "/zikrs", label: "Zikirler", icon: Radio },
  { href: "/daily-content", label: "Günlük", icon: CalendarHeart },
  { href: "/moods", label: "Ruh hali", icon: Heart },
  { href: "/events", label: "Özel gün", icon: Sparkles },
  { href: "/plan-templates", label: "Planlar", icon: CalendarDays },
  { href: "/badges", label: "Rozetler", icon: ShieldCheck },
  { href: "/categories", label: "Kategoriler", icon: ListTree },
  { href: "/sources", label: "Kaynaklar", icon: Library },
  { href: "/app-config", label: "Config", icon: Settings },
  { href: "/notifications", label: "Bildirimler", icon: Gauge }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOutAdmin();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sand/50 bg-white/78 p-4 backdrop-blur lg:block">
        <div className="mb-4 rounded-panel bg-night px-4 py-5 text-pearl">
          <p className="text-xs font-semibold text-amber">Sükût</p>
          <h1 className="mt-1 text-2xl font-bold">Admin</h1>
        </div>
        <div className="mb-5">
          <FirebaseStatus />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-panel bg-night px-3 py-2.5 text-sm font-semibold text-pearl transition"
                    : "flex items-center gap-3 rounded-panel px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-sand/30"
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="mt-5 w-full rounded-full border border-sand px-4 py-2 text-xs font-bold text-ink transition hover:bg-sand/25">
          Çıkış yap
        </button>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-4 py-5 lg:ml-64 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <Link href="/" className="rounded-panel bg-night px-4 py-3 text-sm font-bold text-pearl">
            Sükût Admin
          </Link>
          <FirebaseStatus />
        </div>
        <nav className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="Admin modülleri">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "shrink-0 rounded-full bg-night px-4 py-2 text-xs font-bold text-pearl"
                    : "shrink-0 rounded-full border border-sand bg-white/70 px-4 py-2 text-xs font-bold text-ink"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <button onClick={handleLogout} className="shrink-0 rounded-full border border-sand bg-white/70 px-4 py-2 text-xs font-bold text-ink">
            Çıkış
          </button>
        </nav>
        <AuthGate>{children}</AuthGate>
      </main>
    </div>
  );
}
