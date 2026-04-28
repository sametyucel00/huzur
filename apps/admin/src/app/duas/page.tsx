import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function DuasPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules.duas!} />
    </AdminShell>
  );
}
