import { AdminShell } from "@/components/AdminShell";
import { DashboardStats } from "@/components/DashboardStats";

export default function DashboardPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <header className="rounded-panel bg-night p-6 text-pearl shadow-soft">
          <p className="text-sm font-bold text-amber">Sükût içerik paneli</p>
          <h1 className="mt-2 text-3xl font-bold">Sade, kaynaklı ve güncel içerik yönetimi</h1>
          <p className="mt-3 max-w-2xl text-sm text-pearl/72">
            Mobil uygulama kullanıcı verisi Firebase'e yazmaz; bu panel yalnızca aktif içerikleri, app config'i ve bildirim metinlerini yönetir.
          </p>
        </header>
        <DashboardStats />
      </div>
    </AdminShell>
  );
}
