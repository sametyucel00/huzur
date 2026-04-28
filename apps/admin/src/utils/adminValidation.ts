import {
  appConfigSchema,
  badgeDefinitionSchema,
  categorySchema,
  dailyContentSchema,
  duaSchema,
  FIRESTORE_COLLECTIONS,
  moodContentSchema,
  notificationTemplateSchema,
  planTemplateSchema,
  sourceReferenceSchema,
  specialEventContentSchema,
  zikrSchema
} from "@sukut/shared";
import type { AdminDocument } from "@/lib/firebase/firestore";

export interface AdminValidationResult {
  ok: boolean;
  message: string | null;
  fieldErrors: Record<string, string>;
}

export function validateAdminDocument(collectionName: string, doc: AdminDocument): AdminValidationResult {
  const payload: AdminDocument = {
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...doc,
    id: doc.id || "draft"
  };

  const schema =
    collectionName === FIRESTORE_COLLECTIONS.duas
      ? duaSchema
      : collectionName === FIRESTORE_COLLECTIONS.zikrs
        ? zikrSchema
        : collectionName === FIRESTORE_COLLECTIONS.dailyContents
          ? dailyContentSchema
          : collectionName === FIRESTORE_COLLECTIONS.moodContents
            ? moodContentSchema
            : collectionName === FIRESTORE_COLLECTIONS.events
              ? specialEventContentSchema
              : collectionName === FIRESTORE_COLLECTIONS.badges
                ? badgeDefinitionSchema
                : collectionName === FIRESTORE_COLLECTIONS.categories
                  ? categorySchema
                  : collectionName === FIRESTORE_COLLECTIONS.appConfig
                    ? appConfigSchema
                    : collectionName === FIRESTORE_COLLECTIONS.notificationTemplates
                      ? notificationTemplateSchema
                      : collectionName === FIRESTORE_COLLECTIONS.planTemplates
                        ? planTemplateSchema
                        : collectionName === FIRESTORE_COLLECTIONS.sources
                          ? sourceReferenceSchema
                      : null;

  if (!schema) {
    return { ok: true, message: null, fieldErrors: {} };
  }

  const result = schema.safeParse(payload);
  if (result.success) {
    if (collectionName === FIRESTORE_COLLECTIONS.events && String(payload.endDate) < String(payload.startDate)) {
      return {
        ok: false,
        message: "endDate: Bitiş tarihi başlangıç tarihinden önce olamaz.",
        fieldErrors: { endDate: "Bitiş tarihi başlangıç tarihinden önce olamaz." }
      };
    }

    if (collectionName === FIRESTORE_COLLECTIONS.appConfig && payload.maintenanceMode && !String(payload.maintenanceMessage ?? "").trim()) {
      return {
        ok: false,
        message: "maintenanceMessage: Bakım modu aktifken bakım mesajı girilmeli.",
        fieldErrors: { maintenanceMessage: "Bakım modu aktifken bakım mesajı girilmeli." }
      };
    }

    return { ok: true, message: null, fieldErrors: {} };
  }

  const fieldErrors = result.error.issues.reduce<Record<string, string>>((errors, issue) => {
    const key = issue.path.join(".") || "form";
    errors[key] = issue.message;
    return errors;
  }, {});

  return {
    ok: false,
    message: result.error.issues.map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`).join("; "),
    fieldErrors
  };
}
