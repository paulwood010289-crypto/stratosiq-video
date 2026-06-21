import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

const DOT_COLS = 40;
const DOT_ROWS = 23;
const DOT_GAP_X = 1920 / DOT_COLS;
const DOT_GAP_Y = 1080 / DOT_ROWS;

const DotGrid: React.FC<{ frame: number }> = ({ frame }) => {
  // Gentle breathing opacity: oscillates between 0.04 and 0.10
  const breathe = 0.07 + 0.03 * Math.sin((frame / 90) * Math.PI);

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: DOT_ROWS }, (_, row) =>
        Array.from({ length: DOT_COLS }, (_, col) => {
          const cx = DOT_GAP_X * col + DOT_GAP_X / 2;
          const cy = DOT_GAP_Y * row + DOT_GAP_Y / 2;
          // Radial fade: dots near center are slightly brighter
          const dx = cx - 960;
          const dy = cy - 540;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radial = Math.max(0, 1 - dist / 900);
          return (
            <circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              r={1.5}
              fill="#50A0E8"
              opacity={breathe * (0.3 + 0.7 * radial)}
            />
          );
        })
      )}
    </svg>
  );
};

const CenterGlow: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      width: 900,
      height: 900,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,106,0,0.07) 0%, rgba(255,106,0,0.03) 40%, transparent 70%)",
      opacity,
      pointerEvents: "none",
    }}
  />
);

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const questionOpacity = interpolate(frame, [0, 20, 90, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const wordmarkOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Glow pulses gently, tied to question visibility then wordmark
  const glowOpacity =
    questionOpacity > 0
      ? questionOpacity * (0.7 + 0.3 * Math.sin((frame / 45) * Math.PI))
      : wordmarkOpacity * (0.8 + 0.2 * Math.sin((frame / 60) * Math.PI));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DotGrid frame={frame} />
      <CenterGlow opacity={glowOpacity} />

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
