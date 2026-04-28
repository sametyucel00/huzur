import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createTurkishSlug } from "@sukut/shared";
import { getFirebaseApp } from "./config";
import { mapFirebaseError } from "./errors";

const allowedMimePrefixes = ["image/", "audio/"];
const maxFileSizeBytes = 8 * 1024 * 1024;

export async function uploadAdminAsset(params: { file: File; folder: string }): Promise<string> {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase config eksik.");
  }

  if (!allowedMimePrefixes.some((prefix) => params.file.type.startsWith(prefix))) {
    throw new Error("Sadece görsel veya ses dosyası yüklenebilir.");
  }

  if (params.file.size > maxFileSizeBytes) {
    throw new Error("Dosya boyutu en fazla 8 MB olmalı.");
  }

  const storage = getStorage(app);
  const extension = params.file.name.includes(".") ? params.file.name.split(".").pop() : "";
  const baseName = params.file.name.replace(/\.[^.]+$/, "");
  const safeName = `${createTurkishSlug(baseName)}${extension ? `.${extension.toLocaleLowerCase("tr-TR")}` : ""}`;
  const fileRef = ref(storage, `${params.folder}/${Date.now()}-${safeName}`);

  try {
    await uploadBytes(fileRef, params.file, {
      contentType: params.file.type,
      customMetadata: {
        originalName: params.file.name
      }
    });
    return await getDownloadURL(fileRef);
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Dosya yüklenemedi."));
  }
}
