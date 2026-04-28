import { addDoc, collection, doc, getDocs, getFirestore, limit, orderBy, query, setDoc } from "firebase/firestore";
import { FIRESTORE_COLLECTIONS } from "@sukut/shared";
import { getFirebaseApp } from "./config";
import { mapFirebaseError } from "./errors";

export interface AdminDocument {
  id: string;
  [key: string]: unknown;
}

export function getAdminDb() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

const allowedCollections = new Set<string>(Object.values(FIRESTORE_COLLECTIONS));

function assertAllowedCollection(collectionName: string) {
  if (!allowedCollections.has(collectionName)) {
    throw new Error(`Tanımsız Firestore koleksiyonu: ${collectionName}`);
  }
}

export async function listDocuments(collectionName: string, maxItems = 100): Promise<AdminDocument[]> {
  assertAllowedCollection(collectionName);

  const db = getAdminDb();
  if (!db) {
    return [];
  }

  try {
    const snapshot = await getDocs(query(collection(db, collectionName), orderBy("updatedAt", "desc"), limit(maxItems)));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    throw new Error(mapFirebaseError(error, "İçerikler okunamadı."));
  }
}

export async function saveDocument(collectionName: string, data: AdminDocument): Promise<void> {
  assertAllowedCollection(collectionName);

  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase config eksik.");
  }

  const now = new Date().toISOString();
  const payload = {
    ...data,
    updatedAt: now,
    createdAt: data.createdAt ?? now
  };

  try {
    if (data.id) {
      await setDoc(doc(db, collectionName, data.id), payload, { merge: true });
      return;
    }

    await addDoc(collection(db, collectionName), payload);
  } catch (error) {
    throw new Error(mapFirebaseError(error, "İçerik kaydedilemedi."));
  }
}

export async function removeDocument(collectionName: string, id: string): Promise<void> {
  await setDocumentActiveState(collectionName, id, false, {
    archivedAt: new Date().toISOString()
  });
}

export async function setDocumentActiveState(
  collectionName: string,
  id: string,
  isActive: boolean,
  extraData: Record<string, unknown> = {}
): Promise<void> {
  assertAllowedCollection(collectionName);

  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase config eksik.");
  }

  try {
    await setDoc(
      doc(db, collectionName, id),
      {
        ...extraData,
        isActive,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Durum güncellenemedi."));
  }
}
