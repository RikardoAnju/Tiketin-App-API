import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiketin API",
  description: "Backend API for Tiketin Event Ticketing System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
