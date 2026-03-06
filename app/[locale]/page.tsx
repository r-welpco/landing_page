"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Box, Flex, Text, Button } from "@radix-ui/themes";
import { VideoHero, type VideoEffect } from "@/components/video-hero";
import { Celebration, type CelebrationStyle } from "@/components/celebration";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  PersonalizationModal,
  type LineHeightPreset,
  type LetterSpacingPreset,
  type BlockSpacingPreset,
  type LogoPreset,
  type PrimaryColorHex,
  PRIMARY_COLOR_OPTIONS,
  LINE_HEIGHT_MAP,
  LETTER_SPACING_MAP,
  BLOCK_SPACING_MAP,
  LOGO_SRC_MAP,
} from "@/components/personalization-modal";

const STORAGE_VERSION = "v1";
const STORAGE_PRIMARY = `prelaunch-primary-color:${STORAGE_VERSION}`;
const STORAGE_AUTO_COLOR = `prelaunch-auto-color:${STORAGE_VERSION}`;

function getRandomPrimaryColor(): PrimaryColorHex {
  const opt = PRIMARY_COLOR_OPTIONS[Math.floor(Math.random() * PRIMARY_COLOR_OPTIONS.length)];
  return opt.id;
}

export type ParagraphStyle =
  | "card"
  | "quote"
  | "editorial"
  | "frosted"
  | "minimal"
  | "leadBody"
  | "spotlight";

function splitLead(copy: string): { lead: string; body: string } {
  const exclamation = copy.indexOf("! ");
  const period = copy.indexOf(". ");
  const breakAfter =
    exclamation >= 0
      ? exclamation + 1
      : period >= 0
        ? period + 1
        : -1;
  if (breakAfter > 0) {
    return {
      lead: copy.slice(0, breakAfter).trim(),
      body: copy.slice(breakAfter).trim(),
    };
  }
  return { lead: copy, body: "" };
}

/** Escapes special regex chars; hoist pattern to avoid recreating in loops. */
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;
function escapeRegex(s: string): string {
  return s.replace(REGEX_SPECIAL, "\\$&");
}

function withEmphasis(
  text: string,
  words: string[]
): React.ReactNode[] {
  if (words.length === 0) return [text];
  const pattern = words.map(escapeRegex).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
      <strong key={i} style={{ color: "var(--prelaunch-accent)", fontWeight: 600, textTransform: "uppercase" }}>{part}</strong>
    ) : (
      part
    )
  );
}

type Segment = "customer" | "welper";

export default function PreLaunchPage() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [segment, setSegment] = useState<Segment>("customer");
  const [videoEffect, setVideoEffect] = useState<VideoEffect>("blurGrain");
  const [paragraphStyle, setParagraphStyle] = useState<ParagraphStyle>("quote");
  const [celebrationStyle, setCelebrationStyle] = useState<CelebrationStyle>("sparkles");
  const [celebrationVisible, setCelebrationVisible] = useState(true);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const [lineHeight, setLineHeight] = useState<LineHeightPreset>("relaxed");
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacingPreset>("wider");
  const [blockSpacing, setBlockSpacing] = useState<BlockSpacingPreset>("spacious");
  const [logo, setLogo] = useState<LogoPreset>("beige");
  const [showRoleDetails, setShowRoleDetails] = useState(true);
  const [primaryColor, setPrimaryColor] = useState<PrimaryColorHex>("79C000");
  const [autoSelectColor, setAutoSelectColor] = useState(true);
  const [email, setEmail] = useState("");
  const [interestedCustomer, setInterestedCustomer] = useState(false);
  const [interestedWelper, setInterestedWelper] = useState(false);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const submitIdRef = useRef(0);
  const isMountedRef = useRef(true);

  const ROLE_DETAILS = useMemo(
    () => ({
      customer: {
        title: t("role.customerTitle"),
        tagline: t("role.customerTagline"),
        bullets: [t("role.customerBullet1"), t("role.customerBullet2"), t("role.customerBullet3")],
      },
      welper: {
        title: t("role.welperTitle"),
        tagline: t("role.welperTagline"),
        bullets: [t("role.welperBullet1"), t("role.welperBullet2"), t("role.welperBullet3")],
      },
    }),
    [t]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    let storedAuto: string | null = null;
    let storedHex: string | null = null;
    try {
      storedAuto = localStorage.getItem(STORAGE_AUTO_COLOR);
      storedHex = localStorage.getItem(STORAGE_PRIMARY);
    } catch {
      return;
    }
    const auto = storedAuto === null ? true : storedAuto === "true";
    setAutoSelectColor(auto);
    if (auto) {
      setPrimaryColor(getRandomPrimaryColor());
    } else if (storedHex && PRIMARY_COLOR_OPTIONS.some((o) => o.id === storedHex)) {
      setPrimaryColor(storedHex as PrimaryColorHex);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const accentHex = `#${primaryColor}`;

  const copy = segment === "customer" ? t("copy.customer") : t("copy.welper");
  const { lead, body } = splitLead(copy);

  const quoteParagraphContent = useMemo(() => {
    const intro = segment === "customer" ? t("copy.customerIntro") : t("copy.welperIntro");
    const pleaseLeave = segment === "customer" ? t("copy.customerPleaseLeave") : t("copy.welperPleaseLeave");
    const introWords = segment === "customer" ? ["Welpco", "excited", "happy"] : ["Welpco", "excited", "schedule", "earning"];
    const pleaseWords = ["notify", "launch"];
    return (
      <Box
        style={{
          padding: "clamp(1.5rem, 3vw, 2.25rem)",
          borderLeft: "3px solid var(--prelaunch-accent)",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "0 12px 12px 0",
        }}
      >
        <div className="para-quote-mark" aria-hidden>"</div>
        <p
          className="para-quote-drop-cap"
          style={{
            color: "var(--prelaunch-text)",
            fontFamily: "var(--prelaunch-font-display)",
            fontStyle: "italic",
            marginTop: "-0.25rem",
            marginBottom: pleaseLeave ? "1.25rem" : 0,
            maxWidth: "65ch",
            fontSize: "1.125rem",
          }}
        >
          {withEmphasis(intro, introWords)}
        </p>
        {pleaseLeave ? (
          <Text
            as="p"
            size="3"
            style={{
              color: "var(--prelaunch-text)",
              fontFamily: "var(--prelaunch-font-body)",
              margin: 0,
              maxWidth: "65ch",
            }}
          >
            {withEmphasis(pleaseLeave, pleaseWords)}
          </Text>
        ) : null}
      </Box>
    );
  }, [segment, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    if (!interestedCustomer && !interestedWelper) {
      return;
    }
    setStatus("loading");
    submitIdRef.current += 1;
    const thisSubmitId = submitIdRef.current;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, interestedCustomer, interestedWelper, comment: comment.trim() || undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (thisSubmitId !== submitIdRef.current || !isMountedRef.current) return;
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? t("form.errorGeneric"));
        return;
      }
      setStatus("success");
      setEmail("");
      setComment("");
      setInterestedCustomer(false);
      setInterestedWelper(false);
      setCelebrationVisible(true);
    } catch {
      if (thisSubmitId !== submitIdRef.current || !isMountedRef.current) return;
      setStatus("error");
      setErrorMessage(t("form.errorNetwork"));
    }
  }

  function handlePrimaryColorChange(hex: PrimaryColorHex) {
    setPrimaryColor(hex);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_PRIMARY, hex);
    } catch {
      // Ignore: incognito, quota, or disabled storage
    }
  }

  function handleAutoSelectColorChange(auto: boolean) {
    setAutoSelectColor(auto);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_AUTO_COLOR, auto ? "true" : "false");
    } catch {
      // Ignore: incognito, quota, or disabled storage
    }
    if (auto) {
      setPrimaryColor(getRandomPrimaryColor());
    }
  }

  return (
    <div
      style={
        {
          ["--prelaunch-accent" as string]: accentHex,
          ["--prelaunch-accent-hover" as string]: accentHex,
        } as React.CSSProperties
      }
    >
      <VideoHero videoUrl="/hero-background.mp4" effect={videoEffect} />
      <LanguageSwitcher />
      <PersonalizationModal
        open={personalizationOpen}
        onClose={() => setPersonalizationOpen(false)}
        videoEffect={videoEffect}
        onVideoEffectChange={setVideoEffect}
        paragraphStyle={paragraphStyle}
        onParagraphStyleChange={setParagraphStyle}
        celebrationStyle={celebrationStyle}
        onCelebrationStyleChange={setCelebrationStyle}
        lineHeight={lineHeight}
        onLineHeightChange={setLineHeight}
        letterSpacing={letterSpacing}
        onLetterSpacingChange={setLetterSpacing}
        blockSpacing={blockSpacing}
        onBlockSpacingChange={setBlockSpacing}
        logo={logo}
        onLogoChange={setLogo}
        showRoleDetails={showRoleDetails}
        onShowRoleDetailsChange={setShowRoleDetails}
        primaryColor={primaryColor}
        onPrimaryColorChange={handlePrimaryColorChange}
        autoSelectColor={autoSelectColor}
        onAutoSelectColorChange={handleAutoSelectColorChange}
      />
      {/* Personalization button hidden for now
      <button
        type="button"
        onClick={() => setPersonalizationOpen(true)}
        aria-label={tCommon("openPersonalization")}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 100,
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "1px solid var(--prelaunch-border)",
          background: "var(--prelaunch-surface)",
          color: "var(--prelaunch-accent)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.35rem",
        }}
      >
        ⚙
      </button>
      */}
      <Box
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          backgroundColor: "transparent",
          color: "var(--prelaunch-text)",
        }}
      >
        <Box
          style={{
          padding: "clamp(1.5rem, 4vw, 3rem)",
          maxWidth: 720,
          margin: "0 auto",
          paddingTop: "clamp(3rem, 10vw, 6rem)",
          paddingBottom: "clamp(3rem, 8vw, 5rem)",
        }}
      >
        <Box
          style={{
            marginBottom: "0.5rem",
            animationDelay: "0.1s",
          }}
          className="animate-fade-in-up"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC_MAP[logo]}
            alt={tCommon("logoAlt")}
            style={{
              maxHeight: "clamp(2.5rem, 6vw, 3.5rem)",
              width: "auto",
              display: "block",
              opacity: 0.98,
            }}
          />
        </Box>
        <Text
          size="3"
          style={{
            color: "var(--prelaunch-text-muted)",
            marginBottom: "2.5rem",
            animationDelay: "0.2s",
          }}
          className="animate-fade-in-up"
        >
          {t("comingSoon")}
        </Text>

        {showRoleDetails ? (
          <Flex
            gap="1rem"
            wrap="wrap"
            style={{ marginTop: "1.5rem", marginBottom: "1.5rem", animationDelay: "0.25s" }}
            className="animate-fade-in-up"
          >
            {(["customer", "welper"] as const).map((id) => {
              const r = ROLE_DETAILS[id];
              const selected = segment === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSegment(id)}
                  style={{
                    flex: "1 1 240px",
                    textAlign: "left",
                    padding: "1rem 1.25rem",
                    borderRadius: 12,
                    border: selected ? "2px solid var(--prelaunch-accent)" : "1px solid var(--prelaunch-border)",
                    background: selected ? "rgba(212, 165, 116, 0.12)" : "var(--prelaunch-surface)",
                    cursor: "pointer",
                  }}
                >
                  <Text as="p" size="2" style={{ fontWeight: 600, color: selected ? "var(--prelaunch-accent)" : "var(--prelaunch-text)", marginBottom: "0.35rem", fontSize: "1rem" }}>
                    {r.title}
                  </Text>
                  <Text as="p" size="2" style={{ color: "var(--prelaunch-text-muted)", marginBottom: selected ? "0.5rem" : 0, lineHeight: 1.45, fontSize: "0.9375rem" }}>
                    {r.tagline}
                  </Text>
                  {selected && (
                    <>
                      <Text size="1" style={{ color: "var(--prelaunch-accent)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.35rem", fontSize: "0.75rem" }}>
                        {t("role.perfectFor")}
                      </Text>
                      <ul style={{ margin: "0.35rem 0 0 0", paddingLeft: 0, listStyle: "none" }}>
                        {r.bullets.map((b, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.35rem", lineHeight: 1.4 }}>
                            <span style={{ color: "var(--prelaunch-accent)", fontWeight: 600, flexShrink: 0 }} aria-hidden="true">—</span>
                            <span style={{ color: "var(--prelaunch-text)", fontSize: "0.9rem" }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </button>
              );
            })}
          </Flex>
        ) : (
          <Flex
            style={{
              marginTop: "1.5rem",
              gap: "1.25rem",
              marginBottom: "1.5rem",
              animationDelay: "0.25s",
            }}
            className="animate-fade-in-up"
          >
            {(
              [
                { id: "customer" as const, label: t("role.pillCustomer") },
                { id: "welper" as const, label: t("role.pillWelper") },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSegment(id)}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: 9999,
                  border:
                    segment === id
                      ? "1px solid var(--prelaunch-accent)"
                      : "1px solid var(--prelaunch-border)",
                  background:
                    segment === id
                      ? "var(--prelaunch-accent)"
                      : "var(--prelaunch-surface)",
                  color: segment === id ? "var(--prelaunch-bg)" : "var(--prelaunch-text)",
                  fontFamily: "var(--prelaunch-font-body)",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s, color 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </Flex>
        )}

        <Box
          style={{
            lineHeight: LINE_HEIGHT_MAP[lineHeight],
            letterSpacing: LETTER_SPACING_MAP[letterSpacing],
            marginBottom: BLOCK_SPACING_MAP[blockSpacing],
            animationDelay: "0.3s",
          }}
          className="animate-fade-in-up"
        >
          {paragraphStyle === "card" && (
            <Box
              style={{
                background: "var(--prelaunch-surface)",
                border: "1px solid var(--prelaunch-border)",
                borderRadius: 12,
                padding: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              <Text as="p" size="3" style={{ color: "var(--prelaunch-text)" }}>
                {copy}
              </Text>
            </Box>
          )}

          {paragraphStyle === "quote" ? quoteParagraphContent : null}

          {paragraphStyle === "editorial" && (
            <Box className="para-editorial-border" style={{ paddingRight: "1rem" }}>
              <Text as="p" size="3" style={{ color: "var(--prelaunch-text)" }}>
                {copy}
              </Text>
            </Box>
          )}

          {paragraphStyle === "frosted" && (
            <Box
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid var(--prelaunch-border)",
                borderRadius: 16,
                padding: "clamp(1.75rem, 4vw, 2.5rem)",
              }}
            >
              <Text as="p" size="3" style={{ color: "var(--prelaunch-text)" }}>
                {copy}
              </Text>
            </Box>
          )}

          {paragraphStyle === "minimal" && (
            <Box style={{ padding: "0.5rem 0" }}>
              <Text
                as="p"
                size="4"
                style={{
                  color: "var(--prelaunch-text)",
                  fontWeight: 300,
                }}
              >
                {copy}
              </Text>
            </Box>
          )}

          {paragraphStyle === "leadBody" && (
            <Box
              style={{
                background: "var(--prelaunch-surface)",
                border: "1px solid var(--prelaunch-border)",
                borderRadius: 12,
                padding: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              <Text
                as="p"
                size="5"
                style={{
                  fontFamily: "var(--prelaunch-font-display)",
                  fontWeight: 500,
                  color: "var(--prelaunch-accent)",
                  marginBottom: "1rem",
                }}
              >
                {lead}
              </Text>
              {body ? (
                <Text as="p" size="3" style={{ color: "var(--prelaunch-text)" }}>
                  {body}
                </Text>
              ) : null}
            </Box>
          )}

          {paragraphStyle === "spotlight" && (
            <Box
              className="para-spotlight"
              style={{
                padding: "clamp(1.75rem, 4vw, 2.5rem)",
                background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,165,116,0.08) 0%, transparent 70%)",
                borderRadius: 16,
              }}
            >
              <Text
                as="p"
                size="3"
                style={{
                  color: "var(--prelaunch-text)",
                  fontFamily: "var(--prelaunch-font-body)",
                }}
              >
                {copy}
              </Text>
            </Box>
          )}
        </Box>

        <form
          onSubmit={handleSubmit}
          style={{ animationDelay: "0.35s" }}
          className="animate-fade-in-up"
        >
          <Flex
            align="center"
            gap="0.75rem"
            style={{ marginBottom: "0.75rem" }}
          >
            <button
              id="interested-customer-switch"
              type="button"
              role="switch"
              aria-checked={interestedCustomer}
              aria-label={t("form.interestedCustomerAria")}
              onClick={() => setInterestedCustomer((v) => !v)}
              disabled={status === "loading"}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "1px solid var(--prelaunch-border)",
                background: interestedCustomer ? "var(--prelaunch-accent)" : "var(--prelaunch-surface)",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: interestedCustomer ? 22 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--prelaunch-bg)",
                  border: "1px solid var(--prelaunch-border)",
                  transition: "left 0.2s",
                }}
              />
            </button>
            <label
              htmlFor="interested-customer-switch"
              style={{
                fontSize: "0.9375rem",
                color: "var(--prelaunch-text)",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                userSelect: "none",
              }}
            >
              {t("form.interestedCustomer")}
            </label>
          </Flex>

          <Flex
            align="center"
            gap="0.75rem"
            style={{ marginBottom: "1rem" }}
          >
            <button
              id="interested-welper-switch"
              type="button"
              role="switch"
              aria-checked={interestedWelper}
              aria-label={t("form.interestedWelperAria")}
              onClick={() => setInterestedWelper((v) => !v)}
              disabled={status === "loading"}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "1px solid var(--prelaunch-border)",
                background: interestedWelper ? "var(--prelaunch-accent)" : "var(--prelaunch-surface)",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: interestedWelper ? 22 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--prelaunch-bg)",
                  border: "1px solid var(--prelaunch-border)",
                  transition: "left 0.2s",
                }}
              />
            </button>
            <label
              htmlFor="interested-welper-switch"
              style={{
                fontSize: "0.9375rem",
                color: "var(--prelaunch-text)",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                userSelect: "none",
              }}
            >
              {t("form.interestedWelper")}
            </label>
          </Flex>

          {!interestedCustomer && !interestedWelper ? (
            <Text size="2" style={{ color: "#f87171", marginBottom: "1rem", display: "block" }}>
              {t("form.errorNoSelection")}
            </Text>
          ) : null}

          <Flex
            wrap="wrap"
            style={{
              gap: "1.25rem",
              alignItems: "flex-end",
              marginBottom: "0.75rem",
            }}
          >
            <Box style={{ flex: "1 1 220px", minWidth: 0 }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  color: "var(--prelaunch-text-muted)",
                  marginBottom: "0.35rem",
                }}
              >
                {t("form.emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.emailPlaceholder")}
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  border: "1px solid var(--prelaunch-input-border)",
                  background: "var(--prelaunch-input-bg)",
                  color: "var(--prelaunch-text)",
                  fontFamily: "var(--prelaunch-font-body)",
                  fontSize: "1rem",
                }}
              />
            </Box>
            <Button
              type="submit"
              disabled={status === "loading"}
              style={{
                alignSelf: "flex-end",
                padding: "0.75rem 1.5rem",
                borderRadius: 8,
                background: "var(--prelaunch-accent)",
                color: "var(--prelaunch-bg)",
                border: "none",
                fontFamily: "var(--prelaunch-font-body)",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.8 : 1,
              }}
            >
              {status === "loading" ? t("form.submitting") : t("form.submit")}
            </Button>
          </Flex>

          <Box style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="comment"
              style={{
                display: "block",
                fontSize: "0.875rem",
                color: "var(--prelaunch-text-muted)",
                marginBottom: "0.35rem",
              }}
            >
              {t("form.commentLabel")} <span style={{ fontWeight: 400, opacity: 0.8 }}>{t("form.commentOptional")}</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("form.commentPlaceholder")}
              disabled={status === "loading"}
              rows={3}
              style={{
                width: "100%",
                maxWidth: 480,
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: "1px solid var(--prelaunch-input-border)",
                background: "var(--prelaunch-input-bg)",
                color: "var(--prelaunch-text)",
                fontFamily: "var(--prelaunch-font-body)",
                fontSize: "1rem",
                resize: "vertical",
                minHeight: 80,
              }}
            />
          </Box>

          {status === "success" && (celebrationStyle !== "modal" || celebrationVisible) ? (
            <Celebration
              style={celebrationStyle}
              onDismiss={() => setCelebrationVisible(false)}
              message={t("form.successMessage")}
              title={t("form.successTitle")}
              inlineTitle={t("form.successInline")}
              doneLabel={t("form.successDone")}
              dialogAriaLabel={t("form.successDialogAria")}
            />
          ) : null}
        </form>
        </Box>
      </Box>
    </div>
  );
}
