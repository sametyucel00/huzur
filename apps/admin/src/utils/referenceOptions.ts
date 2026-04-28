import { FIRESTORE_COLLECTIONS, seedContentBundle } from "@sukut/shared";
import type { AdminDocument } from "@/lib/firebase/firestore";
import type { AdminModuleField, AdminSelectOption } from "@/utils/adminSchemas";

export type ReferenceDocuments = Record<string, AdminDocument[]>;

export function getSeedReferenceDocuments(collectionName: string): AdminDocument[] {
  switch (collectionName) {
    case FIRESTORE_COLLECTIONS.categories:
      return seedContentBundle.categories as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.duas:
      return seedContentBundle.duas as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.zikrs:
      return seedContentBundle.zikrs as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.badges:
      return seedContentBundle.badges as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.dailyContents:
      return seedContentBundle.dailyContents as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.events:
      return seedContentBundle.events as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.moodContents:
      return seedContentBundle.moodContents as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.notificationTemplates:
      return seedContentBundle.notificationTemplates as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.planTemplates:
      return seedContentBundle.planTemplates as unknown as AdminDocument[];
    case FIRESTORE_COLLECTIONS.sources:
      return seedContentBundle.sources as unknown as AdminDocument[];
    default:
      return [];
  }
}

export function getReferencedCollectionNames(fields: AdminModuleField[]): string[] {
  return Array.from(
    new Set(
      fields
        .map((field) => field.relation?.collectionName)
        .filter((collectionName): collectionName is string => Boolean(collectionName))
    )
  );
}

export function buildRelationOptions(field: AdminModuleField, referenceDocuments: ReferenceDocuments): AdminSelectOption[] {
  if (!field.relation) {
    return [];
  }

  const docs = referenceDocuments[field.relation.collectionName] ?? [];
  return docs
    .filter((doc) => {
      const filter = field.relation?.filter;
      return filter ? doc[filter.key] === filter.value : true;
    })
    .map((doc) => ({
      value: doc.id,
      label: field.relation!.labelKeys.map((key) => String(doc[key] ?? "")).filter(Boolean).join(" · ") || doc.id
    }));
}
