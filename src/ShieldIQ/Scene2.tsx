import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

const BANDS = [
  {
    label: "FORTIFIED",
    color: "#00FF66",
    description: "Widest safety margin. Highest conviction.",
  },
  {
    label: "SECURE",
    color: "#50A0E8",
    description: "Solid safety margin. Standard opportunities.",
  },
  {
    label: "TIGHT",
    color: "#E8A030",
    description: "Minimal margin. Approach with caution.",
  },
  {
    label: "EXPOSED",
    color: "#E85050",
    description: "Filtered out. Never shown to you.",
  },
] as const;

// Each band animates in with a stagger of 18 frames
const STAGGER = 18;
const ENTER_DURATION = 22;

interface BandPillProps {
  label: string;
  color: string;
  description: string;
  startFrame: number;
  frame: number;
}

const BandPill: React.FC<BandPillProps> = ({
  label,
  color,
  description,
  startFrame,
  frame,
}) => {
  const localFrame = frame - startFrame;

  const opacity = interpolate(localFrame, [0, ENTER_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const translateY = interpolate(localFrame, [0, ENTER_DURATION], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        width: 340,
      }}
    >
      {/* Pill badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 36,
          paddingRight: 36,
          borderRadius: 9999,
          border: `2px solid ${color}`,
          backgroundColor: `${color}18`,
          fontFamily,
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "0.12em",
          whiteSpace: "nowrap" as const,
        }}
      >
        {label}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 17,
          fontWeight: 400,
          color: "#8A8F9E",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 280,
        }}
      >
        {description}
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Header fades in immediately
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 64,
      }}
    >
      {/* Section header */}
      <div
        style={{
          opacity: headerOpacity,
          fontFamily,
          fontSize: 18,
          fontWeight: 700,
          color: "#FF6A00",
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
        }}
      >
        SHIELDIQ SAFETY BANDS
      </div>

      {/* Bands row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 48,
        }}
      >
        {BANDS.map((band, i) => (
          <BandPill
            key={band.label}
            label={band.label}
            color={band.color}
            description={band.description}
            startFrame={15 + i * STAGGER}
            frame={frame}
          />
        ))}
      </div>

      {/* Divider line that draws in after all bands */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          height: 1,
          width: interpolate(
            frame,
            [15 + 3 * STAGGER + ENTER_DURATION, 15 + 3 * STAGGER + ENTER_DURATION + 30],
            [0, 1400],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }
          ),
          backgroundColor: "#FF6A00",
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
