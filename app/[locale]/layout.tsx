import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Welpco — Coming Soon",
  description:
    "Connect with trusted service providers in your community. Get notified when we launch.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const effectiveLocale = routing.locales.includes(locale as "en" | "fr") ? locale : routing.defaultLocale;
  const messages = (await import(`@/messages/${effectiveLocale}.json`)).default;
  return (
    <NextIntlClientProvider locale={effectiveLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
