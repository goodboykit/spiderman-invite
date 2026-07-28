import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Standard Open-Source Eases & Plugins included in `gsap`
import { CustomEase } from "gsap/CustomEase";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

// Register available open-source GSAP plugins & useGSAP hook
gsap.registerPlugin(
  useGSAP,
  Flip,
  Observer,
  MotionPathPlugin,
  ScrollTrigger,
  ScrollToPlugin,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  CustomEase
);

/**
  Note on Club GreenSock (Paid) Plugins:
  If you have a GSAP Club subscription (or bonus package zip), install your private token or place
  the bonus plugin files into your project, then uncomment the imports below:

  // import { CustomBounce } from "gsap/CustomBounce";
  // import { CustomWiggle } from "gsap/CustomWiggle";
  // import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
  // import { InertiaPlugin } from "gsap/InertiaPlugin";
  // import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
  // import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
  // import { ScrollSmoother } from "gsap/ScrollSmoother";
  // import { SplitText } from "gsap/SplitText";
  // import { GSDevTools } from "gsap/GSDevTools";
**/

export { gsap, useGSAP, ScrollTrigger, Flip, Observer, ScrollToPlugin, TextPlugin, CustomEase };
