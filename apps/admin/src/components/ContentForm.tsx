"use client";

import { useMemo, useState, type FormEvent } from "react";
import { collectMojibakeWarnings } from "@sukut/shared";
import type { AdminDocument } from "@/lib/firebase/firestore";
import type { AdminModuleConfig, AdminModuleField } from "@/utils/adminSchemas";
import { buildRelationOptions, type ReferenceDocuments } from "@/utils/referenceOptions";

interface ContentFormProps {
  module: AdminModuleConfig;
  editingItem: AdminDocument | null;
  referenceDocuments: ReferenceDocuments;
  onCancelEdit: () => void;
  onSave: (doc: AdminDocument) => Promise<void>;
}

const featureFlagKeys = [
  "premiumEnabled",
  "paywallEnabled",
  "weeklyReflectionEnabled",
  "advancedDailyPlanEnabled",
  "remoteContentEnabled",
  "localNotificationsEnabled",
  "optionalAuthPlaceholder",
  "premiumThemesEnabled"
] as const;

function stringifyFieldValue(value: unknown, field: AdminModuleField): string {
  if (field.type === "json") {
    return JSON.stringify(value ?? field.defaultValue ?? [], null, 2);
  }

  if (field.type === "number") {
    return String(value ?? field.defaultValue ?? 0);
  }

  if (field.type === "select") {
    return String(value ?? field.defaultValue ?? field.options?.[0]?.value ?? "");
  }

  if (field.type === "relation") {
    return String(value ?? field.defaultValue ?? "");
  }

  return String(value ?? field.defaultValue ?? "");
}

function stringifyMultiValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string" && value) {
    return [value];
  }

  return [];
}

function parseValue(field: AdminModuleField, formData: FormData) {
  const value = formData.get(field.key);
  const values = formData.getAll(field.key);

  if (field.type === "boolean") {
    return value === "on";
  }

  if (field.type === "number") {
    const numericValue = Number(value ?? 0);
    if (!Number.isFinite(numericValue)) {
      throw new Error(`${field.label} geçerli bir sayı olmalı.`);
    }
    return numericValue;
  }

  if (field.type === "json") {
    const rawValue = String(value || "").trim();
    return rawValue ? JSON.parse(rawValue) : [];
  }

  if (field.type === "relationMulti") {
    return values.map(String).filter(Boolean);
  }

  if (field.type === "featureFlags") {
    return Object.fromEntries(featureFlagKeys.map((key) => [key, formData.get(`${field.key}.${key}`) === "on"]));
  }

  return String(value || "");
}

function getFeatureFlags(value: unknown, defaultValue: unknown): Record<string, boolean> {
  const source = typeof value === "object" && value ? value : defaultValue;
  return Object.fromEntries(featureFlagKeys.map((key) => [key, Boolean((source as Record<string, unknown> | undefined)?.[key])]));
}

export function ContentForm({ module, editingItem, referenceDocuments, onCancelEdit, onSave }: ContentFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [warnings, setWarnings] = useState<Record<string, string[]>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const textFields = useMemo(() => module.fields.filter((field) => field.type !== "boolean"), [module.fields]);
  const formKey = editingItem?.id ?? `new-${module.collectionName}`;

  function validateFormDocument(doc: AdminDocument): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const field of module.fields) {
      const value = doc[field.key];
      if (field.required && typeof value === "string" && value.trim().length === 0) {
        errors[field.key] = `${field.label} zorunlu.`;
      }

      if (field.required && Array.isArray(value) && value.length === 0) {
        errors[field.key] = `${field.label} için en az bir seçim yapılmalı.`;
      }

      if (field.type === "number" && typeof value === "number" && value < 0) {
        errors[field.key] = `${field.label} negatif olamaz.`;
      }
    }

    if (module.collectionName === "events" && String(doc.startDate || "") && String(doc.endDate || "")) {
      if (String(doc.endDate) < String(doc.startDate)) {
        errors.endDate = "Bitiş tarihi başlangıç tarihinden önce olamaz.";
      }
    }

    if (module.collectionName === "appConfig" && Number(doc.contentVersion) < 1) {
      errors.contentVersion = "Content version en az 1 olmalı.";
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFieldErrors({});

    let doc: AdminDocument;
    try {
      doc = module.fields.reduce<AdminDocument>((acc, field) => {
        acc[field.key] = parseValue(field, formData);
        return acc;
      }, {} as AdminDocument);
    } catch (error) {
      setFieldErrors({ form: error instanceof Error ? error.message : "JSON alanlarından biri geçerli değil. Lütfen köşeli parantez, süslü parantez ve tırnakları kontrol et." });
      return;
    }

    if (editingItem?.id) {
      doc.id = editingItem.id;
      doc.createdAt = editingItem.createdAt;
    }

    const mojibakeWarnings = collectMojibakeWarnings(doc);
    setWarnings(mojibakeWarnings);
    if (Object.keys(mojibakeWarnings).length > 0) {
      return;
    }

    const nextFieldErrors = validateFormDocument(doc);
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(doc);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="rounded-panel border border-sand/60 bg-white/86 p-5 shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-night">{editingItem ? "İçeriği düzenle" : "Yeni içerik"}</p>
          <p className="text-xs text-ink/55">{editingItem ? `Belge ID: ${editingItem.id}` : "Kaydettiğinde Firestore belgesi oluşur."}</p>
        </div>
        {editingItem ? (
          <button type="button" onClick={onCancelEdit} className="rounded-full bg-sand/40 px-4 py-2 text-xs font-bold text-ink">
            Düzenlemeyi bırak
          </button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {module.fields.map((field) => {
          const value = editingItem ? editingItem[field.key] : field.defaultValue;
          const warning = warnings[field.key];
          const className = ["textarea", "json", "relationMulti", "featureFlags"].includes(field.type) ? "md:col-span-2" : "";
          const relationOptions = buildRelationOptions(field, referenceDocuments);

          return (
            <label key={field.key} className={className}>
              <span className="mb-1 block text-sm font-semibold text-ink">{field.label}</span>
              {field.type === "textarea" || field.type === "json" ? (
                <textarea
                  name={field.key}
                  required={field.required}
                  rows={field.type === "json" ? 5 : 3}
                  className="w-full rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
                  placeholder={field.type === "json" ? "[]" : undefined}
                  defaultValue={stringifyFieldValue(value, field)}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.key}
                  required={field.required}
                  defaultValue={stringifyFieldValue(value, field)}
                  className="w-full rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "relation" ? (
                <select
                  name={field.key}
                  required={field.required}
                  defaultValue={stringifyFieldValue(value, field)}
                  className="w-full rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
                >
                  <option value="">Seçim yok</option>
                  {relationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "relationMulti" ? (
                <select
                  name={field.key}
                  multiple
                  defaultValue={stringifyMultiValue(value ?? field.defaultValue)}
                  className="min-h-32 w-full rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
                >
                  {relationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "featureFlags" ? (
                <div className="grid gap-2 rounded-panel border border-sand bg-pearl p-3 md:grid-cols-2">
                  {featureFlagKeys.map((key) => {
                    const flags = getFeatureFlags(value, field.defaultValue);
                    return (
                      <label key={key} className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <input name={`${field.key}.${key}`} type="checkbox" defaultChecked={flags[key]} className="h-4 w-4 accent-amber" />
                        {key}
                      </label>
                    );
                  })}
                </div>
              ) : field.type === "boolean" ? (
                <input
                  name={field.key}
                  type="checkbox"
                  defaultChecked={Boolean(value ?? field.defaultValue ?? true)}
                  className="h-5 w-5 accent-amber"
                />
              ) : (
                <input
                  name={field.key}
                  required={field.required}
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                  min={field.type === "number" ? 0 : undefined}
                  defaultValue={stringifyFieldValue(value, field)}
                  className="w-full rounded-panel border border-sand bg-pearl px-3 py-2 text-sm outline-none focus:border-amber"
                />
              )}
              {warning ? (
                <span className="mt-1 block text-xs font-semibold text-red-700">
                  Bozuk karakter şüphesi: {warning.join(", ")}
                </span>
              ) : null}
              {fieldErrors[field.key] ? <span className="mt-1 block text-xs font-semibold text-red-700">{fieldErrors[field.key]}</span> : null}
              {field.helperText ? <span className="mt-1 block text-xs text-ink/50">{field.helperText}</span> : null}
            </label>
          );
        })}
      </div>
      {fieldErrors.form ? <p className="mt-4 rounded-panel bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{fieldErrors.form}</p> : null}
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs text-ink/55">
          Türkçe karakterler UTF-8 olarak saklanır. Kaydetmeden önce mojibake kontrolü yapılır.
        </p>
        <button
          type="submit"
          disabled={isSaving || textFields.length === 0}
          className="rounded-full bg-night px-5 py-2.5 text-sm font-bold text-pearl disabled:opacity-50"
        >
          {isSaving ? "Kaydediliyor" : editingItem ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
