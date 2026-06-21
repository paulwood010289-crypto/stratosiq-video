import { AbsoluteFill, Sequence } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";

export const ShieldIQPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1117" }}>
      {/* Scene 1: 0–6s (frames 0–179) */}
      <Sequence from={0} durationInFrames={180}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: 6–16s (frames 180–479) */}
      <Sequence from={180} durationInFrames={300}>
        <Scene2 />
      </Sequence>
    </AbsoluteFill>
  );
};
