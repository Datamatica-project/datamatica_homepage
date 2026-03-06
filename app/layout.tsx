import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const a2z = localFont({
  src: [
    { path: "../public/fonts/에이투지체-1Thin.otf", weight: "100" },
    { path: "../public/fonts/에이투지체-2ExtraLight.otf", weight: "200" },
    { path: "../public/fonts/에이투지체-3Light.otf", weight: "300" },
    { path: "../public/fonts/에이투지체-4Regular.otf", weight: "400" },
    { path: "../public/fonts/에이투지체-5Medium.otf", weight: "500" },
    { path: "../public/fonts/에이투지체-6SemiBold.otf", weight: "600" },
    { path: "../public/fonts/에이투지체-7Bold.otf", weight: "700" },
    { path: "../public/fonts/에이투지체-8ExtraBold.otf", weight: "800" },
    { path: "../public/fonts/에이투지체-9Black.otf", weight: "900" },
  ],
  variable: "--font-a2z",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataMatica",
  description: "DataMatica Home Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${a2z.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
