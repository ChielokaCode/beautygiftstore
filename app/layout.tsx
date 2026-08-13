import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Handcrafted Wrist Bead Stacks | Limited Promo",
  description:
    "Beautiful handcrafted wrist bead stacks with 4 free gifts and free Lagos delivery.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
