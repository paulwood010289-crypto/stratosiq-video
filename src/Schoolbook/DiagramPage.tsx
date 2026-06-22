import { useCurrentFrame, interpolate, Easing } from "remotion";

// ── Timing constants (composition frames @ 30fps) ────────────────────────────
const WAVE_START  = 75;
const WAVE_END    = 235;
const DASH_START  = 215;
const DASH_END    = 325;
const FILL_START  = 300;
const FILL_END    = 400;
const HG_START    = 370;   // hourglass
const FLAG_START  = 445;
const FLAG_END    = 535;
const COIN_START  = 515;
const COIN_END    = 655;
// Hold / settled: 625 → 900

const W = 520;
const H = 330;
const DASH_Y = 172; // fixed price level

const easeOut   = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const prog = (
  frame: number,
  start: number,
  end: number,
  ease: (t: number) => number = easeOut
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// Dynamic wave path — phase drifts slowly so the line keeps gently moving
const getWavePath = (frame: number): string => {
  const N = 32;
  const phase = frame * 0.021;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const x = 12 + (i / N) * (W - 24);
    const t = (i / N) * Math.PI * 4.6 + phase;
    const y =
      DASH_Y +
      40 * Math.sin(t) +
      17 * Math.sin(t * 1.85 + 0.9) +
      8 * Math.sin(t * 3.2 + 1.6);
    pts.push({ x, y });
  }
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const mx = ((p.x + c.x) / 2).toFixed(1);
    d += ` C ${mx},${p.y.toFixed(1)} ${mx},${c.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
  }
  return d;
};

export const DiagramPage: React.FC = () => {
  const frame = useCurrentFrame();

  const waveReveal   = prog(frame, WAVE_START, WAVE_END);
  const dashReveal   = prog(frame, DASH_START, DASH_END);
  const fillOpacity  = prog(frame, FILL_START, FILL_END) * 0.21;
  const hgFade       = prog(frame, HG_START, HG_START + 28);
  // Hourglass drains continuously from HG_START through end of composition
  const hgDrain      = prog(frame, HG_START, 900, easeInOut);
  const flagReveal   = prog(frame, FLAG_START, FLAG_END);
  const coinProg     = prog(frame, COIN_START, COIN_END, easeInOut);
  const handsFade    = prog(frame, COIN_START - 18, COIN_START + 35);

  const wavePath = getWavePath(frame);
  const coinX = interpolate(coinProg, [0, 1], [455, 62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coinY = 283;

  // Hourglass geometry
  const hgX = 432;
  const hgY = 240;
  const hgHW = 14; // half-width
  const hgHH = 21; // half-height
  const sandTop = Math.max(0, (1 - hgDrain) * (hgHH - 3));
  const sandBot = Math.min(hgHH - 3, hgDrain * (hgHH - 3));

  // Flag
  const fX = W - 16;
  const fY = 50;
  const poleH = flagReveal * 72;
  const flagBodyFade = interpolate(flagReveal, [0.55, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Reveal wave L→R */}
        <clipPath id="dp-wave-clip">
          <rect x={0} y={-20} width={waveReveal * W} height={H + 40} />
        </clipPath>
        {/* Reveal dash L→R */}
        <clipPath id="dp-dash-clip">
          <rect x={0} y={0} width={dashReveal * W} height={H} />
        </clipPath>
        {/* Fill region clips — same as dash so fills appear with the line */}
        <clipPath id="dp-fill-clip">
          <rect x={0} y={0} width={dashReveal * W} height={H} />
        </clipPath>
        {/* Subtle sketch displacement */}
        <filter id="dp-sketch" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04"
            numOctaves="2"
            result="noise"
            seed="7"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* Pencil texture on the wave */}
        <filter id="dp-pencil" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.065"
            numOctaves="3"
            result="noise"
            seed="3"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* ── Green wash above dash line ── */}
      <rect
        x={0} y={0} width={W} height={DASH_Y}
        fill="#226633"
        opacity={fillOpacity}
        clipPath="url(#dp-fill-clip)"
      />

      {/* ── Red wash below dash line ── */}
      <rect
        x={0} y={DASH_Y} width={W} height={H - DASH_Y}
        fill="#882211"
        opacity={fillOpacity}
        clipPath="url(#dp-fill-clip)"
      />

      {/* ── Dashed horizontal price level ── */}
      <line
        x1={0} y1={DASH_Y} x2={W} y2={DASH_Y}
        stroke="#9A7A50"
        strokeWidth={1.6}
        strokeDasharray="10 7"
        clipPath="url(#dp-dash-clip)"
        filter="url(#dp-sketch)"
      />

      {/* ── Wavy stock price line ── */}
      <path
        d={wavePath}
        fill="none"
        stroke="#2C1A08"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#dp-wave-clip)"
        filter="url(#dp-pencil)"
      />

      {/* ── Hourglass ── */}
      {hgFade > 0.01 && (
        <g opacity={hgFade}>
          {/* Outer shape */}
          <path
            d={`M ${hgX - hgHW},${hgY}
                L ${hgX + hgHW},${hgY}
                L ${hgX},${hgY + hgHH}
                L ${hgX + hgHW},${hgY + hgHH * 2}
                L ${hgX - hgHW},${hgY + hgHH * 2}
                L ${hgX},${hgY + hgHH}
                Z`}
            fill="none"
            stroke="#7A5828"
            strokeWidth={1.9}
            strokeLinejoin="round"
            filter="url(#dp-sketch)"
          />
          {/* Top sand (drains away) */}
          {sandTop > 0.4 && (
            <polygon
              points={`
                ${hgX - hgHW + 2},${hgY + 2}
                ${hgX + hgHW - 2},${hgY + 2}
                ${hgX},${hgY + sandTop + 2}
              `}
              fill="#C8942A"
              opacity={0.78}
            />
          )}
          {/* Bottom sand (accumulates) */}
          {sandBot > 0.4 && (
            <polygon
              points={`
                ${hgX - sandBot * 0.85},${hgY + hgHH * 2 - 2}
                ${hgX + sandBot * 0.85},${hgY + hgHH * 2 - 2}
                ${hgX},${hgY + hgHH * 2 - sandBot - 2}
              `}
              fill="#C8942A"
              opacity={0.78}
            />
          )}
        </g>
      )}

      {/* ── Flag at right edge ── */}
      {flagReveal > 0 && (
        <g filter="url(#dp-sketch)">
          <line
            x1={fX} y1={fY}
            x2={fX} y2={fY + poleH}
            stroke="#5A3820"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {flagReveal > 0.55 && (
            <polygon
              points={`${fX},${fY + 5} ${fX - 26},${fY + 17} ${fX},${fY + 29}`}
              fill="#A03822"
              opacity={flagBodyFade * 0.88}
            />
          )}
        </g>
      )}

      {/* ── Hands + sliding coin ── */}
      {handsFade > 0.01 && (
        <g opacity={handsFade}>
          {/* Left hand — receiving, open palm facing right */}
          <g filter="url(#dp-sketch)">
            <ellipse cx={45} cy={290} rx={11} ry={15}
              fill="none" stroke="#7A6040" strokeWidth={1.5} />
            <path d="M 50,280 Q 64,272 74,262"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 52,285 Q 67,278 79,270"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 52,291 Q 67,286 78,279"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 50,298 Q 63,295 72,290"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
          </g>
          {/* Right hand — giving, open palm facing left */}
          <g filter="url(#dp-sketch)">
            <ellipse cx={475} cy={290} rx={11} ry={15}
              fill="none" stroke="#7A6040" strokeWidth={1.5} />
            <path d="M 470,280 Q 456,272 446,262"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 468,285 Q 453,278 441,270"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 468,291 Q 453,286 442,279"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 470,298 Q 457,295 448,290"
              fill="none" stroke="#7A6040" strokeWidth={1.4} strokeLinecap="round" />
          </g>
          {/* Coin */}
          <circle cx={coinX} cy={coinY} r={15}
            fill="#D4A520" stroke="#8A6810" strokeWidth={1.8} />
          <circle cx={coinX} cy={coinY} r={10}
            fill="none" stroke="#9A780A" strokeWidth={0.9} opacity={0.55} />
        </g>
      )}
    </svg>
  );
};
