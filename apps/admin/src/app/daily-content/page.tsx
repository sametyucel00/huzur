import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function DailyContentPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules["daily-content"]!} />
    </AdminShell>
  );
}
