import type { Metadata } from "next";
import "./globals.css";
import { AuthCheck } from "@/widgets/authCheck/authCheck";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BN Storage",
  description: "BN Storage is a cloud storage service that allows you to store and share files with your friends and family.",
  authors: [{ name: "biyrololo", url: "https://github.com/biyrololo" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://desktop.bn-storage.ru",
    title: "BN Storage",
    description: "BN Storage is a cloud storage service that allows you to store and share files with your friends and family.",
    siteName: "BN Storage"
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
