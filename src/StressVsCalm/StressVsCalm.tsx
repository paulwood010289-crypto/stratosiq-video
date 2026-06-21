import { AbsoluteFill, Sequence } from "remotion";
import { ChaosHalf } from "./ChaosHalf";
import { CalmHalf } from "./CalmHalf";

// Total: 16s @ 30fps = 480 frames
// Chaos: 0–8s (frames 0–239)
// Calm:  8–16s (frames 240–479)

export const StressVsCalm: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={240}>
        <ChaosHalf />
      </Sequence>
      <Sequence from={240} durationInFrames={240}>
        <CalmHalf />
      </Sequence>
    </AbsoluteFill>
  );
};
