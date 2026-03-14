import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GnbWrapper from "@/components/GnbWrapper";

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

const SITE_URL = "https://datamatica-homepage.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DataMatica",
    template: "%s | DataMatica",
  },
  description:
    "수집부터 분석, 시각화, 자동화까지 데이터를 가치로 전환하는 DataMatica. 자율주행, 공간정보, AI 데이터 전문 기업입니다.",
  keywords: [
    "DataMatica", "데이터메티카", "데이터 분석", "자율주행", "공간정보",
    "AI 데이터", "HD맵", "데이터 시각화", "데이터 자동화",
  ],
  authors: [{ name: "DataMatica", url: SITE_URL }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "DataMatica",
    title: "DataMatica",
    description:
      "수집부터 분석, 시각화, 자동화까지 데이터를 가치로 전환하는 DataMatica. 자율주행, 공간정보, AI 데이터 전문 기업입니다.",
    images: [
      {
        url: "/header/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "DataMatica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataMatica",
    description:
      "수집부터 분석, 시각화, 자동화까지 데이터를 가치로 전환하는 DataMatica.",
    images: ["/header/thumbnail.png"],
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/favicon_io/site.webmanifest" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#d94a52",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DataMatica",
  url: SITE_URL,
  logo: `${SITE_URL}/header/headerlogo.png`,
  image: `${SITE_URL}/header/thumbnail.png`,
  description:
    "수집부터 분석, 시각화, 자동화까지 데이터를 가치로 전환하는 DataMatica. 자율주행, 공간정보, AI 데이터 전문 기업입니다.",
  telephone: "+82-31-628-8360",
  email: "support@datamatica.kr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "판교로255번길 9-22, 우림W시티 809-1",
    addressLocality: "성남시 분당구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  foundingDate: "2020",
  sameAs: [SITE_URL],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${a2z.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <GnbWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
