import { ContentManager } from "@/components/ContentManager";
import { adminModules } from "@/utils/adminSchemas";

export default function SourcesPage() {
  return (
    <section className="space-y-6">
      <ContentManager module={adminModules.sources!} />
    </section>
  );
}
