import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "CAD Earth | Team Operations",
  description: "CAD Earth amateur League of Legends team coaching dashboard."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable}`}>{children}</body>
    </html>
  );
}
