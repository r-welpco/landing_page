import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const publicAppUrl = process.env.PUBLIC_APP_URL?.trim();
const metadataOrigin =
  publicAppUrl && publicAppUrl.length > 0
    ? publicAppUrl.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
const metadataBase = new URL(metadataOrigin);

const title = "Welpco — Coming Soon";
const description =
  "Connect with trusted service providers in your community. Get notified when we launch.";

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: "/og-img.jpg",
        alt: "WELPCO — trusted home services and community providers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-img.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${instrumentSerif.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased" style={{ fontFamily: "var(--prelaunch-font-body)" }}>
        {children}
      </body>
    </html>
  );
}
