"use client";

import { useTranslations } from "next-intl";
import { Box, Flex, Text } from "@radix-ui/themes";
import type { VideoEffect } from "@/components/video-hero";
import type { CelebrationStyle } from "@/components/celebration";

export type ParagraphStyle =
  | "card"
  | "quote"
  | "editorial"
  | "frosted"
  | "minimal"
  | "leadBody"
  | "spotlight";

const VIDEO_EFFECT_KEYS: { id: VideoEffect; key: string }[] = [
  { id: "none", key: "effectNone" },
  { id: "blur", key: "effectBlur" },
  { id: "grain", key: "effectGrain" },
  { id: "blurGrain", key: "effectBlurGrain" },
  { id: "vignette", key: "effectVignette" },
  { id: "film", key: "effectFilm" },
  { id: "soft", key: "effectSoft" },
];

const PARAGRAPH_STYLE_KEYS: { id: ParagraphStyle; key: string }[] = [
  { id: "card", key: "styleCard" },
  { id: "quote", key: "styleQuote" },
  { id: "editorial", key: "styleEditorial" },
  { id: "frosted", key: "styleFrosted" },
  { id: "minimal", key: "styleMinimal" },
  { id: "leadBody", key: "styleLeadBody" },
  { id: "spotlight", key: "styleSpotlight" },
];

const CELEBRATION_STYLE_KEYS: { id: CelebrationStyle; key: string }[] = [
  { id: "simple", key: "celebrationSimple" },
  { id: "confetti", key: "celebrationConfetti" },
  { id: "sparkles", key: "celebrationSparkles" },
  { id: "modal", key: "celebrationModal" },
];

export type LogoPreset = "beige" | "green";

export const LOGO_SRC_MAP: Record<LogoPreset, string> = {
  beige: "/logos/logo-beige.png",
  green: "/logos/logo-green.png",
};

const LOGO_OPTIONS: { id: LogoPreset; key: string }[] = [
  { id: "beige", key: "logoLight" },
  { id: "green", key: "logoGreen" },
];

export type PrimaryColorHex =
  | "79C000"
  | "E1B0E8"
  | "F9E5B6"
  | "AFEADC"
  | "FAC9D1";

export const PRIMARY_COLOR_OPTIONS: { id: PrimaryColorHex; hex: string }[] = [
  { id: "79C000", hex: "79C000" },
  { id: "E1B0E8", hex: "E1B0E8" },
  { id: "F9E5B6", hex: "F9E5B6" },
  { id: "AFEADC", hex: "AFEADC" },
  { id: "FAC9D1", hex: "FAC9D1" },
];

export type LineHeightPreset = "tight" | "normal" | "relaxed" | "loose";
export type LetterSpacingPreset = "tight" | "normal" | "wide" | "wider";
export type BlockSpacingPreset = "compact" | "normal" | "spacious";

export const LINE_HEIGHT_MAP: Record<LineHeightPreset, number> = {
  tight: 1.5,
  normal: 1.7,
  relaxed: 1.85,
  loose: 2,
};

export const LETTER_SPACING_MAP: Record<LetterSpacingPreset, string> = {
  tight: "-0.01em",
  normal: "0",
  wide: "0.02em",
  wider: "0.04em",
};

export const BLOCK_SPACING_MAP: Record<BlockSpacingPreset, string> = {
  compact: "1rem",
  normal: "2rem",
  spacious: "3rem",
};

const LINE_HEIGHT_OPTIONS: { id: LineHeightPreset; key: string }[] = [
  { id: "tight", key: "tight" },
  { id: "normal", key: "normal" },
  { id: "relaxed", key: "relaxed" },
  { id: "loose", key: "loose" },
];

const LETTER_SPACING_OPTIONS: { id: LetterSpacingPreset; key: string }[] = [
  { id: "tight", key: "tight" },
  { id: "normal", key: "normal" },
  { id: "wide", key: "wide" },
  { id: "wider", key: "wider" },
];

const BLOCK_SPACING_OPTIONS: { id: BlockSpacingPreset; key: string }[] = [
  { id: "compact", key: "compact" },
  { id: "normal", key: "normal" },
  { id: "spacious", key: "spacious" },
];

const pillButtonStyle = (active: boolean) => ({
  padding: "0.35rem 0.65rem",
  borderRadius: 6,
  border: active ? "1px solid var(--prelaunch-accent)" : "1px solid var(--prelaunch-border)",
  background: active ? "rgba(212, 165, 116, 0.2)" : "transparent",
  color: "var(--prelaunch-text-muted)",
  fontFamily: "var(--prelaunch-font-body)",
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "border-color 0.2s, background 0.2s, color 0.2s",
});

export function PersonalizationModal({
  open,
  onClose,
  videoEffect,
  onVideoEffectChange,
  paragraphStyle,
  onParagraphStyleChange,
  celebrationStyle,
  onCelebrationStyleChange,
  lineHeight,
  onLineHeightChange,
  letterSpacing,
  onLetterSpacingChange,
  blockSpacing,
  onBlockSpacingChange,
  logo,
  onLogoChange,
  showRoleDetails,
  onShowRoleDetailsChange,
  primaryColor,
  onPrimaryColorChange,
  autoSelectColor,
  onAutoSelectColorChange,
}: {
  open: boolean;
  onClose: () => void;
  videoEffect: VideoEffect;
  onVideoEffectChange: (v: VideoEffect) => void;
  paragraphStyle: ParagraphStyle;
  onParagraphStyleChange: (p: ParagraphStyle) => void;
  celebrationStyle: CelebrationStyle;
  onCelebrationStyleChange: (c: CelebrationStyle) => void;
  lineHeight: LineHeightPreset;
  onLineHeightChange: (v: LineHeightPreset) => void;
  letterSpacing: LetterSpacingPreset;
  onLetterSpacingChange: (v: LetterSpacingPreset) => void;
  blockSpacing: BlockSpacingPreset;
  onBlockSpacingChange: (v: BlockSpacingPreset) => void;
  logo: LogoPreset;
  onLogoChange: (v: LogoPreset) => void;
  showRoleDetails: boolean;
  onShowRoleDetailsChange: (v: boolean) => void;
  primaryColor: PrimaryColorHex;
  onPrimaryColorChange: (v: PrimaryColorHex) => void;
  autoSelectColor: boolean;
  onAutoSelectColorChange: (v: boolean) => void;
}) {
  const t = useTranslations("modal");
  if (!open) return null;

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(0,0,0,0.6)",
        animation: "fadeIn 0.2s ease-out",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="personalization-title"
      onClick={onClose}
    >
      <Box
        style={{
          background: "var(--prelaunch-bg)",
          border: "1px solid var(--prelaunch-border)",
          borderRadius: 16,
          padding: "1.5rem 1.75rem",
          maxWidth: 420,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <Text id="personalization-title" size="4" style={{ fontWeight: 600, color: "var(--prelaunch-text)" }}>
            {t("title")}
          </Text>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--prelaunch-border)",
              background: "transparent",
              color: "var(--prelaunch-text-muted)",
              fontSize: "1.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </Flex>

        <Box style={{ marginBottom: "1.25rem" }}>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("logo")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center" }}>
            {LOGO_OPTIONS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onLogoChange(id)}
                style={pillButtonStyle(logo === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
        </Box>

        <Box style={{ marginBottom: "1.25rem" }}>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("videoEffect")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center" }}>
            {VIDEO_EFFECT_KEYS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onVideoEffectChange(id)}
                style={pillButtonStyle(videoEffect === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
        </Box>

        <Box style={{ marginBottom: "1.25rem" }}>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("paragraphStyle")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center" }}>
            {PARAGRAPH_STYLE_KEYS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onParagraphStyleChange(id)}
                style={pillButtonStyle(paragraphStyle === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
        </Box>

        <Box style={{ marginBottom: "1.25rem" }}>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("paragraphDisplay")}
          </Text>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", opacity: 0.8, marginBottom: "0.35rem", display: "block" }}>
            {t("lineHeight")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center", marginBottom: "0.5rem" }}>
            {LINE_HEIGHT_OPTIONS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onLineHeightChange(id)}
                style={pillButtonStyle(lineHeight === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", opacity: 0.8, marginBottom: "0.35rem", display: "block" }}>
            {t("letterSpacing")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center", marginBottom: "0.5rem" }}>
            {LETTER_SPACING_OPTIONS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onLetterSpacingChange(id)}
                style={pillButtonStyle(letterSpacing === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", opacity: 0.8, marginBottom: "0.35rem", display: "block" }}>
            {t("blockSpacing")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center" }}>
            {BLOCK_SPACING_OPTIONS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onBlockSpacingChange(id)}
                style={pillButtonStyle(blockSpacing === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
        </Box>

        <Box style={{ marginBottom: "1.25rem" }}>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("primaryColor")}
          </Text>
          <Flex gap="0.5rem" wrap="wrap" style={{ alignItems: "center", marginBottom: "0.75rem" }}>
            {PRIMARY_COLOR_OPTIONS.map(({ id, hex }) => (
              <button
                key={id}
                type="button"
                title={`#${hex}`}
                aria-label={`Color #${hex}`}
                aria-pressed={primaryColor === id}
                onClick={() => onPrimaryColorChange(id)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: primaryColor === id ? "2px solid var(--prelaunch-text)" : "1px solid var(--prelaunch-border)",
                  background: `#${hex}`,
                  cursor: "pointer",
                }}
              />
            ))}
          </Flex>
          <Flex style={{ alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              role="switch"
              aria-checked={autoSelectColor}
              aria-label={t("autoSelectColor")}
              id="auto-color-switch"
              onClick={() => onAutoSelectColorChange(!autoSelectColor)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                border: "1px solid var(--prelaunch-border)",
                background: autoSelectColor ? "var(--prelaunch-accent)" : "var(--prelaunch-surface)",
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: autoSelectColor ? 20 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--prelaunch-bg)",
                  transition: "left 0.2s",
                }}
              />
            </button>
            <label
              htmlFor="auto-color-switch"
              style={{
                fontSize: "0.9rem",
                color: "var(--prelaunch-text-muted)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {t("autoSelectColor")}
            </label>
          </Flex>
        </Box>

        <Box style={{ marginBottom: "1.25rem" }}>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("roleDetails")}
          </Text>
          <Flex style={{ alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <button
              type="button"
              role="switch"
              aria-checked={showRoleDetails}
              onClick={() => onShowRoleDetailsChange(!showRoleDetails)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                border: "1px solid var(--prelaunch-border)",
                background: showRoleDetails ? "var(--prelaunch-accent)" : "var(--prelaunch-surface)",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: showRoleDetails ? 20 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--prelaunch-bg)",
                  transition: "left 0.2s",
                }}
              />
            </button>
            <Text size="2" style={{ color: "var(--prelaunch-text-muted)" }}>
              {t("showRoleDetails")}
            </Text>
          </Flex>
        </Box>

        <Box>
          <Text size="1" style={{ color: "var(--prelaunch-text-muted)", marginBottom: "0.5rem", display: "block" }}>
            {t("celebration")}
          </Text>
          <Flex gap="1" wrap="wrap" style={{ alignItems: "center" }}>
            {CELEBRATION_STYLE_KEYS.map(({ id, key }) => (
              <button
                key={id}
                type="button"
                onClick={() => onCelebrationStyleChange(id)}
                style={pillButtonStyle(celebrationStyle === id)}
              >
                {t(key)}
              </button>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
