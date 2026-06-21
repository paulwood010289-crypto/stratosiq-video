import { AbsoluteFill, Sequence } from "remotion";
import { Scene1 } from "./Scene1";

export const ShieldIQPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Scene 1: 0–6s (180 frames at 30fps) */}
      <Sequence from={0} durationInFrames={180}>
        <Scene1 />
      </Sequence>
    </AbsoluteFill>
  );
};
