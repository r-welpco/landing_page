"use client";

import { useState } from "react";
import { Box, Text } from "@radix-ui/themes";

export type CelebrationStyle = "simple" | "confetti" | "sparkles" | "modal";

const CONFETTI_COLORS = [
  "var(--prelaunch-accent)",
  "#e5b886",
  "#f5f5f4",
  "#a8a29e",
  "#d4a574",
];

function ConfettiPieces() {
  const [pieces] = useState(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {pieces.map((p) => (
        <Box
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: "confetti-fall linear forwards",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </Box>
  );
}

function Sparkles() {
  const positions = [
    { top: "20%", left: "15%" },
    { top: "25%", left: "85%" },
    { top: "50%", left: "10%" },
    { top: "55%", left: "90%" },
    { top: "75%", left: "20%" },
    { top: "70%", left: "80%" },
    { top: "35%", left: "50%" },
    { top: "60%", left: "45%" },
  ];

  return (
    <Box
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {positions.map((pos, i) => (
        <Box
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 12,
            height: 12,
            border: "2px solid var(--prelaunch-accent)",
            borderRadius: "50%",
            animation: "sparkle 1.2s ease-in-out forwards",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </Box>
  );
}

export function Celebration({
  style,
  onDismiss,
}: {
  style: CelebrationStyle;
  onDismiss?: () => void;
}) {
  // Success message and celebration stay visible (no auto-hide)

  const message = "Thanks! Check your inbox for a confirmation and more about Welpco.";

  if (style === "simple") {
    return (
      <Box style={{ marginTop: "0.5rem" }}>
        <Box
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            animation: "checkmark-pop 0.4s ease-out",
          }}
        >
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--prelaunch-accent)",
              color: "var(--prelaunch-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            ✓
          </Box>
            <Text size="2" style={{ color: "var(--prelaunch-accent)" }}>
              {message}
            </Text>
        </Box>
      </Box>
    );
  }

  if (style === "confetti") {
    return (
      <>
        <ConfettiPieces />
        <Box
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem 1rem",
            background: "rgba(212, 165, 116, 0.15)",
            borderRadius: 12,
            border: "1px solid var(--prelaunch-accent)",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🎉</span>
            <Text size="3" style={{ fontWeight: "bold", color: "var(--prelaunch-accent)" }}>
              You're on the list!
            </Text>
          </Box>
          <Text as="p" size="2" style={{ color: "var(--prelaunch-text)", margin: 0 }}>
            {message}
          </Text>
        </Box>
      </>
    );
  }

  if (style === "sparkles") {
    return (
      <Box style={{ position: "relative", marginTop: "0.75rem" }}>
        <Sparkles />
        <Box
          style={{
            position: "relative",
            zIndex: 1,
            padding: "1rem 1.25rem",
            background: "var(--prelaunch-surface)",
            borderRadius: 12,
            border: "1px solid var(--prelaunch-border)",
            animation: "fadeIn 0.4s ease-out",
          }}
        >
          <Text as="p" size="2" style={{ color: "var(--prelaunch-accent)", marginBottom: "0.25rem" }}>
            ✨ You're in! We'll be in touch.
          </Text>
          <Text as="p" size="2" style={{ color: "var(--prelaunch-text-muted)", margin: 0 }}>
            {message}
          </Text>
        </Box>
      </Box>
    );
  }

  if (style === "modal") {
    return (
      <Box
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "rgba(0,0,0,0.6)",
          animation: "fadeIn 0.3s ease-out",
        }}
        role="dialog"
        aria-live="polite"
        aria-label="Subscription successful"
      >
        <ConfettiPieces />
        <Box
          style={{
            position: "relative",
            zIndex: 101,
            background: "var(--prelaunch-bg)",
            border: "2px solid var(--prelaunch-accent)",
            borderRadius: 20,
            padding: "2.5rem",
            maxWidth: 380,
            textAlign: "center",
            animation: "celebrate-modal-in 0.4s ease-out",
          }}
        >
          <Box
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--prelaunch-accent)",
              color: "var(--prelaunch-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1.25rem",
              animation: "checkmark-pop 0.5s ease-out 0.2s both",
            }}
          >
            ✓
          </Box>
          <Text
            as="p"
            size="6"
            style={{
              fontFamily: "var(--prelaunch-font-display)",
              fontWeight: "bold",
              color: "var(--prelaunch-text)",
              marginBottom: "0.5rem",
            }}
          >
            You're on the list!
          </Text>
          <Text as="p" size="2" style={{ color: "var(--prelaunch-text-muted)", lineHeight: 1.6 }}>
            {message}
          </Text>
          <button
            type="button"
            onClick={() => onDismiss?.()}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.5rem",
              borderRadius: 8,
              border: "1px solid var(--prelaunch-accent)",
              background: "transparent",
              color: "var(--prelaunch-accent)",
              fontFamily: "var(--prelaunch-font-body)",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </Box>
      </Box>
    );
  }

  return null;
}
