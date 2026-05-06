import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Autonova - Premium Car Accessories in Sri Lanka",
  description:
    "Shop premium automotive accessories including seat covers, floor mats, phone holders, and more. Quality products with island-wide delivery.",
  keywords: [
    "car accessories",
    "seat covers",
    "floor mats",
    "phone holders",
    "Sri Lanka",
    "automotive",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
