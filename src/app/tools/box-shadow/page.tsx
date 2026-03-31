import type { Metadata } from "next";
import { BoxShadowTool } from "./tool";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator - Free Online Shadow Tool",
  description:
    "Generate CSS box-shadow with visual controls for offset, blur, spread, color, and opacity. Support for multiple shadows and inset mode. Copy CSS instantly.",
  keywords: [
    "box shadow generator",
    "css box shadow",
    "shadow generator",
    "css shadow tool",
    "box shadow css",
    "multiple box shadows",
    "inset shadow",
  ],
};

export default function BoxShadowPage() {
  return <BoxShadowTool />;
}
