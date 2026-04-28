import { hasFirebaseConfig } from "@/lib/firebase/config";

export function FirebaseStatus() {
  const ready = hasFirebaseConfig();

  return (
    <div
      className={
        ready
          ? "rounded-panel border border-mint bg-mint/20 px-3 py-2 text-xs font-bold text-ink"
          : "rounded-panel border border-amber bg-amber/15 px-3 py-2 text-xs font-bold text-ink"
      }
    >
      Firebase: {ready ? "Config hazır" : "Config bekleniyor"}
    </div>
  );
}
