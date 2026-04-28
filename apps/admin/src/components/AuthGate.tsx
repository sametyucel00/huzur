"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getAdminAuth, isAllowedAdminEmail, signOutAdmin } from "@/lib/firebase/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const auth = getAdminAuth();

  useEffect(() => {
    if (!auth) {
      setAuthError("Firebase config eksik olduğu için admin oturumu kontrol edilemiyor.");
      setReady(true);
      return undefined;
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser && !isAllowedAdminEmail(nextUser.email)) {
        await signOutAdmin();
        setUser(null);
        setAuthError("Bu e-posta admin panel için yetkili değil.");
        setReady(true);
        router.replace("/login");
        return;
      }

      setAuthError(null);
      setUser(nextUser);
      setReady(true);
      if (!nextUser) {
        router.replace("/login");
      }
    });
  }, [auth, router]);

  if (!ready) {
    return <div className="rounded-panel bg-white/80 p-4 text-sm font-semibold text-ink">Oturum kontrol ediliyor.</div>;
  }

  if (!auth) {
    return (
      <div className="rounded-panel border border-amber bg-amber/15 p-4 text-sm font-semibold text-ink">
        {authError} <span className="font-normal">`.env.local` içindeki `NEXT_PUBLIC_FIREBASE_*` değerlerini kontrol et.</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-panel border border-amber bg-amber/15 p-4 text-sm font-semibold text-ink shadow-soft">
        <p>{authError ?? "Admin işlemleri için giriş gerekli."}</p>
        <Link href="/login" className="mt-3 inline-flex rounded-full bg-night px-4 py-2 text-xs font-bold text-pearl">
          Giriş ekranına git
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
