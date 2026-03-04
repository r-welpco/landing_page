"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        zIndex: 100,
        display: "flex",
        gap: "0.25rem",
        alignItems: "center",
      }}
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          aria-label={code === "en" ? "English" : "Français"}
          style={{
            padding: "0.4rem 0.65rem",
            borderRadius: 6,
            border:
              locale === code
                ? "1px solid var(--prelaunch-accent)"
                : "1px solid var(--prelaunch-border)",
            background:
              locale === code
                ? "rgba(212, 165, 116, 0.15)"
                : "var(--prelaunch-surface)",
            color: locale === code ? "var(--prelaunch-accent)" : "var(--prelaunch-text-muted)",
            fontFamily: "var(--prelaunch-font-body)",
            fontSize: "0.875rem",
            fontWeight: locale === code ? 600 : 400,
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s, color 0.2s",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
