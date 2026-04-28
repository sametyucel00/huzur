"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getAdminAuth, signInAdmin } from "@/lib/firebase/auth";

export function LoginPanel() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = getAdminAuth();

    if (!auth) {
      return undefined;
    }

    return onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setMessage(null);

    try {
      await signInAdmin(String(formData.get("email")), String(formData.get("password")));
      setMessage("Giriş başarılı. İçerik yönetimi modüllerine devam edebilirsin.");
      router.replace("/");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Giriş başarısız.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-24 w-full max-w-md rounded-panel border border-sand/60 bg-white/86 p-6 shadow-soft">
      <p className="text-sm font-bold text-amber">Sükût Admin</p>
      <h1 className="mt-1 text-3xl font-bold text-night">Giriş</h1>
      <div className="mt-6 space-y-4">
        <input name="email" type="email" required placeholder="Admin e-posta" className="w-full rounded-panel border border-sand bg-pearl px-3 py-2" />
        <input name="password" type="password" required placeholder="Şifre" className="w-full rounded-panel border border-sand bg-pearl px-3 py-2" />
      </div>
      {message ? <p className="mt-4 rounded-panel bg-sand/30 px-3 py-2 text-sm font-semibold text-ink">{message}</p> : null}
      <button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-night px-5 py-3 text-sm font-bold text-pearl disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
