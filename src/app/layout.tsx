import "./globals.css";

import { AuthCheck } from "@/widgets/authCheck/authCheck";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png',
    shortcut: '/images/favicon.ico'
  },
  title: "BN Storage",
  description: "BN Storage is a cloud storage service that allows you to store and share files with your friends and family.",
  authors: [{ name: "biyrololo", url: "https://github.com/biyrololo" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bn-storage.ru",
    title: "BN Storage",
    description: "BN Storage is a cloud storage service that allows you to store and share files with your friends and family.",
    siteName: "BN Storage",
    images: [
      {
        url: "https://bn-storage.ru/storage.png",
        width: 1200,
        height: 630,
        alt: "BN Storage"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BN Storage",
    description: "BN Storage is a cloud storage service that allows you to store and share files with your friends and family.",
    images: ["https://bn-storage.ru/storage.png"],
    site: "https://bn-storage.ru",
    creator: "@biyrololo"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <Providers>
          <AuthCheck />
          {children}
        </Providers>
      </body>
    </html>
  );
}
