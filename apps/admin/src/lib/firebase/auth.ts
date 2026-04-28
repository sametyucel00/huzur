"use client";

import { getAuth, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { mapFirebaseError } from "./errors";
import { getFirebaseApp } from "./config";

export function getAdminAuth() {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export function getAllowedAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLocaleLowerCase("tr-TR"))
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return true;
  }

  return allowedEmails.includes(String(email ?? "").trim().toLocaleLowerCase("tr-TR"));
}

export async function signInAdmin(email: string, password: string): Promise<User> {
  const auth = getAdminAuth();
  if (!auth) {
    throw new Error("Firebase config eksik.");
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);

    if (!isAllowedAdminEmail(result.user.email)) {
      await signOut(auth);
      throw new Error("Bu e-posta admin panel için yetkili değil.");
    }

    return result.user;
  } catch (error) {
    throw new Error(mapFirebaseError(error, "Giriş başarısız."));
  }
}

export async function signOutAdmin(): Promise<void> {
  const auth = getAdminAuth();
  if (auth) {
    await signOut(auth);
  }
}
