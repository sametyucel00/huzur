import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4">
      <section className="rounded-panel border border-sand/60 bg-white/86 p-6 shadow-soft">
        <p className="text-sm font-bold text-amber">Sükût Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-night">Sayfa bulunamadı</h1>
        <p className="mt-3 text-sm text-ink/65">Aradığın admin modülü mevcut değil veya adres hatalı yazılmış olabilir.</p>
        <Link href="/" className="mt-5 inline-flex rounded-full bg-night px-5 py-2.5 text-sm font-bold text-pearl">
          Dashboard'a dön
        </Link>
      </section>
    </main>
  );
}
