import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ATCP | Anointed Trinity Creche & Pre School | Quality Early Childhood Education",
  description:
    "Welcome to ATCP. Nurturing young minds with love, care, and quality education in South Africa.",
  keywords:
    "preschool, daycare, early childhood education, South Africa, Johannesburg, Cape Town",
  authors: [{ name: "Anointed Trinity Creche & Pre School" }],
  creator: "ATCP",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://anointedtrinity.co.za",
    siteName: "Anointed Trinity Creche & Pre School",
    images: [
      {
        url: "https://anointedtrinity.co.za/og-image.png",
        width: 1200,
        height: 630,
        alt: "ATCP - Anointed Trinity Creche & Pre School",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
