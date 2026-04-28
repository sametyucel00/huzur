import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function BadgesPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules.badges!} />
    </AdminShell>
  );
}
