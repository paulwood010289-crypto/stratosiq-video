import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

// Deterministic pseudo-random from seed
const prng = (seed: number) => {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
};

// Seeded jitter per frame — small rapid displacement
const jitter = (frame: number, seed: number, amplitude: number) =>
  (prng(frame * 0.3 + seed) - 0.5) * 2 * amplitude;

// Zigzag SVG path for a chart panel
const ZigzagChart: React.FC<{ seed: number; width: number; height: number; frame: number }> = ({
  seed,
  width,
  height,
  frame,
}) => {
  const points = 14;
  // Shift the chart leftward each frame to simulate live updating
  const offset = (frame * 1.2) % (width / points);

  const pts = Array.from({ length: points + 2 }, (_, i) => {
    const x = i * (width / points) - offset;
    const y = height * 0.2 + prng(seed + i + Math.floor(frame / 4)) * height * 0.6;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
      <polyline
        points={pts}
        fill="none"
        stroke="#E85050"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* secondary white line slightly offset */}
      <polyline
        points={Array.from({ length: points + 2 }, (_, i) => {
          const x = i * (width / points) - offset;
          const y = height * 0.2 + prng(seed + 99 + i + Math.floor(frame / 4)) * height * 0.5;
          return `${x},${y}`;
        }).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Flickering ticker price
const PRICE_POOL = [
  "482.30", "481.95", "483.10", "480.77", "484.22",
  "479.88", "485.01", "478.54", "486.33", "477.20",
  "23.41", "22.98", "24.05", "21.87", "25.10",
  "1,204.55", "1,199.80", "1,211.30", "1,189.40", "1,215.00",
];
const TICKER_POOL = ["AAPL", "TSLA", "SPY", "QQQ", "NVDA", "AMD", "MSFT", "META"];

const TickerPanel: React.FC<{
  panelSeed: number;
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
  frame: number;
}> = ({ panelSeed, x, y, w, h, angle, frame }) => {
  const priceIdx = Math.floor(prng(panelSeed * 3 + Math.floor(frame / 3)) * PRICE_POOL.length);
  const price = PRICE_POOL[priceIdx];
  const tickerIdx = Math.floor(prng(panelSeed * 7) * TICKER_POOL.length);
  const ticker = TICKER_POOL[tickerIdx];
  const changePositive = prng(panelSeed + Math.floor(frame / 5)) > 0.5;
  const changePct = (prng(panelSeed * 2 + Math.floor(frame / 5)) * 4).toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${angle}deg)`,
        backgroundColor: "#161920",
        border: "1px solid rgba(232,80,80,0.4)",
        borderRadius: 8,
        overflow: "hidden",
        padding: "10px 12px",
        boxSizing: "border-box" as const,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily, fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.1em" }}>
          {ticker}
        </span>
        <span style={{ fontFamily, fontSize: 10, color: changePositive ? "#E85050" : "#E85050", letterSpacing: "0.06em" }}>
          {changePositive ? "▲" : "▼"} {changePct}%
        </span>
      </div>
      <div style={{ position: "relative", width: "100%", height: h - 52 }}>
        <ZigzagChart seed={panelSeed} width={w - 24} height={h - 52} frame={frame} />
      </div>
      <div style={{ fontFamily, fontSize: 13, fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
        ${price}
      </div>
    </div>
  );
};

const PANELS = [
  { seed: 1,  x: 80,   y: 90,   w: 260, h: 180, angle: -2.5 },
  { seed: 2,  x: 380,  y: 50,   w: 220, h: 160, angle: 1.8  },
  { seed: 3,  x: 650,  y: 120,  w: 280, h: 200, angle: -1.2 },
  { seed: 4,  x: 980,  y: 60,   w: 240, h: 170, angle: 2.1  },
  { seed: 5,  x: 1270, y: 100,  w: 260, h: 185, angle: -1.8 },
  { seed: 6,  x: 1580, y: 70,   w: 230, h: 165, angle: 1.4  },
  { seed: 7,  x: 200,  y: 420,  w: 270, h: 190, angle: 1.5  },
  { seed: 8,  x: 1400, y: 400,  w: 250, h: 180, angle: -2.0 },
];

const FLASH_WORDS = [
  { text: "BUY?",  x: 700,  y: 380, onFrames: [10, 11, 12, 13, 28, 29, 55, 56, 90, 91, 130, 131, 170, 171] },
  { text: "SELL?", x: 1100, y: 550, onFrames: [18, 19, 20, 35, 36, 63, 64, 100, 101, 140, 141, 180, 181] },
  { text: "WAIT—", x: 900,  y: 700, onFrames: [8, 9, 25, 26, 45, 46, 47, 78, 79, 115, 116, 155, 156, 200, 201] },
  { text: "BUY?",  x: 400,  y: 600, onFrames: [40, 41, 75, 76, 110, 111, 160, 161, 210, 211] },
  { text: "SELL?", x: 1400, y: 650, onFrames: [50, 51, 85, 86, 125, 126, 175, 176, 215, 216] },
];

export const ChaosHalf: React.FC = () => {
  const frame = useCurrentFrame();

  // Frame jitter — rapid, irregular displacement
  const jx = jitter(frame, 1, 6) + jitter(frame, 11, 3);
  const jy = jitter(frame, 2, 5) + jitter(frame, 12, 2.5);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0608", overflow: "hidden" }}>
      {/* Red vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(120,20,20,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Jittery container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${jx}px, ${jy}px)`,
        }}
      >
        {PANELS.map((p) => (
          <TickerPanel key={p.seed} panelSeed={p.seed} frame={frame} {...p} />
        ))}
      </div>

      {/* Flash words */}
      {FLASH_WORDS.map((w, i) => {
        const visible = w.onFrames.includes(frame);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: w.x,
              top: w.y,
              fontFamily,
              fontSize: 38,
              fontWeight: 700,
              color: "#E85050",
              opacity: visible ? 1 : 0,
              letterSpacing: "0.1em",
              textShadow: "0 0 20px rgba(232,80,80,0.8)",
              pointerEvents: "none",
              zIndex: 20,
              transform: `translate(${jx * 1.5}px, ${jy * 1.5}px)`,
            }}
          >
            {w.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
