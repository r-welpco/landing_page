"use client";

import { useEffect, useRef } from "react";
import { Box } from "@radix-ui/themes";

export type VideoEffect =
  | "none"
  | "blur"
  | "grain"
  | "blurGrain"
  | "vignette"
  | "film"
  | "soft";

export function VideoHero({
  videoUrl,
  effect = "none",
}: {
  videoUrl: string;
  effect?: VideoEffect;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video?.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      play();
    } else {
      video.addEventListener("loadeddata", play, { once: true });
      video.addEventListener("canplay", play, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
    };
  }, [videoUrl]);

  const useBlur =
    effect === "blur" || effect === "blurGrain" || effect === "soft";
  const blurStrength = effect === "soft" ? 4 : 10;
  const useGrain =
    effect === "grain" || effect === "blurGrain" || effect === "film" || effect === "soft";
  const useVignette = effect === "vignette";
  const useDesaturate = effect === "film";

  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <Box
        style={{
          position: "absolute",
          inset: 0,
          filter: useDesaturate ? "saturate(0.75)" : undefined,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </Box>

      {useBlur && (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${blurStrength}px)`,
            WebkitBackdropFilter: `blur(${blurStrength}px)`,
            background: "rgba(0,0,0,0.08)",
          }}
        />
      )}

      {useGrain && (
        <Box
          className="video-effect-grain"
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      )}

      {useVignette && (
        <Box
          className="video-effect-vignette"
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      )}

      <Box
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </Box>
  );
}
