import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Roamie — AI Travel Planning",
  description:
    "Plan complete trips with AI. Find cheapest flights, trains and cruises. Meet travelers with your vibe.",
  keywords: ["travel", "AI", "flights", "budget"],
  authors: [{ name: "Roamie" }],
  openGraph: {
    title: "Roamie — AI Travel Planning",
    description: "Plan complete trips with AI. Find cheapest flights, trains and cruises. Meet travelers with your vibe.",
    url: "https://roamie.vercel.app",
    siteName: "Roamie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamie — AI Travel Planning",
    description: "Plan complete trips with AI. Find cheapest flights, trains and cruises. Meet travelers with your vibe.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
