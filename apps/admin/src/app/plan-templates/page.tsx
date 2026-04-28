import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function PlanTemplatesPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules["plan-templates"]!} />
    </AdminShell>
  );
}
