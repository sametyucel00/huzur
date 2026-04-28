import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function NotificationsPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules.notifications!} />
    </AdminShell>
  );
}
