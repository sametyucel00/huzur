import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sükût Admin",
  description: "Sükût içerik yönetim paneli"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
