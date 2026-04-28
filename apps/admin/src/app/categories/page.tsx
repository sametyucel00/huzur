import { AdminShell } from "@/components/AdminShell";
import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function CategoriesPage() {
  return (
    <AdminShell>
      <ContentManager module={adminModules.categories!} />
    </AdminShell>
  );
}
