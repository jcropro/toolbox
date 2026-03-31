import type { Metadata } from "next";
import { AspectRatioTool } from "./tool";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator - Free Online Ratio Tool",
  description:
    "Calculate and convert aspect ratios for images, video, and screens. Lock a ratio and resize proportionally. Common presets for 16:9, 4:3, 1:1, 21:9, and more.",
  keywords: [
    "aspect ratio calculator",
    "aspect ratio",
    "image ratio",
    "video ratio",
    "screen ratio",
    "16:9 calculator",
    "resize calculator",
    "proportion calculator",
  ],
};

export default function AspectRatioPage() {
  return <AspectRatioTool />;
}
