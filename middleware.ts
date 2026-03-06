import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

/** Quebec: French. Other Canadian regions (ON, etc.): English. */
const QUEBEC_REGION = "QC";

/** Countries where we default to French (excluding Canada, handled by region). */
const FRANCOPHONE_COUNTRIES = new Set([
  "FR", "BE", "CH", "LU", "MC",
  "SN", "CI", "ML", "BF", "NE", "TD", "GN",
  "CG", "CD", "CM", "GA", "MG", "HT", "DJ",
  "KM", "TG", "BJ", "CF", "RW", "BI", "VU",
]);

function getLocaleFromGeo(country: string | undefined, region: string | undefined): "fr" | "en" | null {
  if (!country) return null;
  const c = country.toUpperCase();
  const r = region?.toUpperCase();

  if (c === "CA") {
    return r === QUEBEC_REGION ? "fr" : "en";
  }
  return FRANCOPHONE_COUNTRIES.has(c) ? "fr" : "en";
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (!hasLocalePrefix) {
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      undefined;
    const region =
      request.headers.get("x-vercel-ip-country-region") ??
      undefined;

    const locale = getLocaleFromGeo(country ?? undefined, region);

    if (locale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", locale);
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
