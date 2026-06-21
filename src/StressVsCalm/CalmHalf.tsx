import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";

const { fontFamily: orbitron } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

const fade = (frame: number, inStart: number, inEnd: number) =>
  interpolate(frame, [inStart, inEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const PHONE_W = 320;
const PHONE_H = 580;

export const CalmHalf: React.FC = () => {
  const frame = useCurrentFrame();

  // Phone outline: fades in frames 0–25
  const phoneOpacity = fade(frame, 0, 25);

  // Card inside phone: fades in frames 35–60
  const cardOpacity = fade(frame, 35, 60);

  // Tagline below phone: fades in frames 90–120
  const taglineOpacity = fade(frame, 90, 120);

  // Gentle breathing glow on the phone
  const glowPulse = 0.15 + 0.05 * Math.sin((frame / 60) * Math.PI);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 52,
      }}
    >
      {/* Soft green glow behind phone */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(0,255,102,${glowPulse}) 0%, transparent 70%)`,
          opacity: phoneOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Phone frame */}
      <div style={{ opacity: phoneOpacity, position: "relative" }}>
        <div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            borderRadius: 36,
            border: "2px solid rgba(0,255,102,0.5)",
            backgroundColor: "#0F1117",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box" as const,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Phone notch */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(0,255,102,0.3)",
            }}
          />

          {/* Notification card */}
          <div
            style={{
              opacity: cardOpacity,
              width: "100%",
              backgroundColor: "#161920",
              borderRadius: 16,
              border: "1px solid rgba(0,255,102,0.25)",
              padding: "18px 16px",
              boxSizing: "border-box" as const,
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontFamily: orbitron, fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.12em" }}>
                STRATOS<span style={{ color: "#00FF66" }}>IQ</span>
              </div>
              {/* FORTIFIED badge */}
              <div
                style={{
                  fontFamily: orbitron,
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#00FF66",
                  border: "1px solid #00FF66",
                  borderRadius: 9999,
                  padding: "3px 10px",
                  letterSpacing: "0.1em",
                  backgroundColor: "rgba(0,255,102,0.1)",
                }}
              >
                FORTIFIED
              </div>
            </div>

            {/* Ticker and expiry */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: orbitron, fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em", marginBottom: 4 }}>
                AAPL $180P
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A8F9E" }}>
                Expires Jan 17 · 28 DTE
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 10 }} />

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: "#00FF66" }}>4.2%</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#8A8F9E", marginTop: 2 }}>Premium</div>
              </div>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>12.4%</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#8A8F9E", marginTop: 2 }}>OTM</div>
              </div>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: orbitron, fontSize: 14, fontWeight: 700, color: "#50A0E8" }}>0.18</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#8A8F9E", marginTop: 2 }}>Delta</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontFamily: orbitron,
          fontSize: 26,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          letterSpacing: "0.06em",
          lineHeight: 1.5,
        }}
      >
        One screen.{" "}
        <span style={{ color: "#00FF66" }}>One decision.</span>
        {" "}StratosIQ.
      </div>
    </AbsoluteFill>
  );
};
