import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { DiagramPage } from "./DiagramPage";

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// ── Dust motes — deterministic positions, drift upward slowly ───────────────
const DUST = Array.from({ length: 22 }, (_, i) => ({
  x0:     420 + (i * 91)  % 980,
  y0:     940 - (i * 67)  % 720,
  size:   1.1 + (i * 0.33) % 1.9,
  vy:     0.22 + (i * 0.08) % 0.36,
  vx:     ((i * 13) % 28) * 0.012 - 0.17,
  opacity: 0.11 + (i * 0.044) % 0.24,
  phase:  (i * 53) % 900,
}));

const BOOK_W  = 1320;
const BOOK_H  = 800;
const PAGE_W  = (BOOK_W - 22) / 2; // each page width (spine is 22px)

export const SchoolbookDiagram: React.FC = () => {
  const frame = useCurrentFrame();

  // Page flip: old right page rotates from 0° → -175° over frames 0-52
  const pageTurnAngle = interpolate(frame, [0, 52], [0, -175], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const bookLeft  = (1920 - BOOK_W) / 2;
  const bookTop   = (1080 - BOOK_H) / 2 + 18;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>

      {/* ── Desk surface ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(168deg, #180C02 0%, #2A1708 48%, #180C02 100%)",
      }} />

      {/* ── Warm desk-lamp glow from above-center ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 1180px 660px at 960px -80px, " +
          "rgba(255,200,65,0.32) 0%, rgba(240,155,35,0.11) 42%, transparent 68%)",
      }} />

      {/* ── Dust particles ── */}
      {DUST.map((d, i) => {
        const t   = (frame + d.phase) % 900;
        const x   = d.x0 + d.vx * t;
        const rawY = d.y0 - d.vy * t;
        const y   = ((rawY % 1080) + 1080) % 1080;
        return (
          <div key={i} style={{
            position:  "absolute",
            left:      x,
            top:       y,
            width:     d.size,
            height:    d.size * 0.55,
            borderRadius: "50%",
            backgroundColor: "#FFD060",
            opacity:   d.opacity,
            pointerEvents: "none",
          }} />
        );
      })}

      {/* ── Book ── */}
      <div style={{
        position: "absolute",
        left: bookLeft,
        top:  bookTop,
        width:  BOOK_W,
        height: BOOK_H,
        perspective: "2400px",
        perspectiveOrigin: "50% 22%",
      }}>

        {/* Drop shadow on desk */}
        <div style={{
          position: "absolute",
          bottom: -38, left: 70, right: 70, height: 55,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 72%)",
          filter: "blur(16px)",
        }} />

        {/* Leather cover — rendered behind pages */}
        <div style={{
          position: "absolute",
          inset: -14,
          borderRadius: 10,
          zIndex: 0,
          background:
            "linear-gradient(138deg, #270F00 0%, #4A2008 22%, #341602 50%, #4A2008 78%, #270F00 100%)",
          boxShadow:
            "0 12px 55px rgba(0,0,0,0.85), " +
            "inset 0 1px 4px rgba(255,175,70,0.07), " +
            "inset 0 -2px 6px rgba(0,0,0,0.6)",
        }} />

        {/* ── Open fresh spread (sits beneath the turning page) ── */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex",
          zIndex: 1,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 3px 20px rgba(0,0,0,0.45)",
        }}>
          {/* Left page — blank */}
          <div style={{
            width: PAGE_W,
            flexShrink: 0,
            backgroundColor: "#F2E2BC",
            position: "relative",
          }}>
            {/* Spine shadow */}
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 36,
              background: "linear-gradient(to right, transparent, rgba(0,0,0,0.08))",
            }} />
            {/* Lamp warm wash */}
            <div style={{
              position: "absolute", inset: 0,
              background:
                "radial-gradient(ellipse at 60% 20%, rgba(255,220,120,0.13) 0%, transparent 55%)",
            }} />
          </div>

          {/* Spine */}
          <div style={{
            width: 22, flexShrink: 0,
            background: "linear-gradient(90deg, #2C1404, #4E2A0A, #2C1404)",
          }} />

          {/* Right page — diagram lives here */}
          <div style={{
            flex: 1,
            backgroundColor: "#EDD8A5",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Spine shadow */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 36,
              background: "linear-gradient(to left, transparent, rgba(0,0,0,0.08))",
            }} />
            {/* Lamp warm wash on right page */}
            <div style={{
              position: "absolute", inset: 0,
              background:
                "radial-gradient(ellipse at 45% 20%, rgba(255,215,110,0.20) 0%, transparent 52%)",
            }} />
            {/* The diagram */}
            <DiagramPage />
          </div>
        </div>

        {/* ── Turning page (old right page flipping to the left) ── */}
        <div style={{
          position:      "absolute",
          right:         0,
          top:           0,
          width:         PAGE_W,
          height:        BOOK_H,
          transformOrigin: "left center",
          transform:     `rotateY(${pageTurnAngle}deg)`,
          transformStyle: "preserve-3d",
          zIndex:        2,
        }}>
          {/* Front face — old ruled page */}
          <div style={{
            position:         "absolute",
            inset:            0,
            backgroundColor:  "#F2E2BC",
            backfaceVisibility: "hidden",
            borderRadius:     "0 3px 3px 0",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 27px, " +
              "rgba(130,95,45,0.14) 27px, rgba(130,95,45,0.14) 28px)",
          }} />
          {/* Back face — smooth parchment (inner side of page) */}
          <div style={{
            position:         "absolute",
            inset:            0,
            backgroundColor:  "#E8D09C",
            backfaceVisibility: "hidden",
            transform:        "rotateY(180deg)",
            borderRadius:     "3px 0 0 3px",
          }} />
        </div>
      </div>

      {/* ── Vignette / framing ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 1050px 720px at 960px 560px, " +
          "transparent 38%, rgba(4,2,0,0.68) 100%)",
      }} />

    </AbsoluteFill>
  );
};
