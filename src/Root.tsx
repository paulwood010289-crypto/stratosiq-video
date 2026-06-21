import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ShieldIQPromo } from "./ShieldIQ/ShieldIQPromo";
import { StressVsCalm } from "./StressVsCalm/StressVsCalm";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ShieldIQPromo"
        component={ShieldIQPromo}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StressVsCalm"
        component={StressVsCalm}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
