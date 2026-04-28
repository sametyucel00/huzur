import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function AppConfigPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules["app-config"]!} />
    </AdminShell>
  );
}
