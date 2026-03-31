import type { Metadata } from "next";
import { GradientGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "CSS Gradient Generator - Free Online Color Gradient Maker",
  description:
    "Create beautiful CSS gradients with multiple color stops, direction controls, and live preview. Copy the CSS code instantly. No signup required.",
  keywords: [
    "css gradient generator",
    "gradient maker",
    "linear gradient",
    "radial gradient",
    "css gradient",
    "color gradient tool",
    "gradient css code",
  ],
};

export default function GradientGeneratorPage() {
  return <GradientGeneratorTool />;
}
