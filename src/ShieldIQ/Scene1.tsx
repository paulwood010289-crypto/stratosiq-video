import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Question fades in over first 20 frames, holds until frame 90, fades out by frame 110
  const questionOpacity = interpolate(
    frame,
    [0, 20, 90, 110],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  // Wordmark fades in starting at frame 120, fully in by frame 145
  const wordmarkOpacity = interpolate(
    frame,
    [120, 145],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Question */}
      <div
        style={{
          position: "absolute",
          opacity: questionOpacity,
          fontFamily,
          fontSize: 52,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          letterSpacing: "0.04em",
          maxWidth: 900,
          lineHeight: 1.3,
        }}
      >
        How safe is your next trade, really?
      </div>

      {/* ShieldIQ Wordmark */}
      <div
        style={{
          position: "absolute",
          opacity: wordmarkOpacity,
          fontFamily,
          fontSize: 80,
          fontWeight: 700,
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span style={{ color: "#FFFFFF" }}>SHIELD</span>
        <span style={{ color: "#FF6A00" }}>IQ</span>
      </div>
    </AbsoluteFill>
  );
};
