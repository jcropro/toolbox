import type { Metadata } from "next";
import { ColorPaletteTool } from "./tool";

export const metadata: Metadata = {
  title: "Color Palette Generator - Free Random Color Scheme Maker",
  description:
    "Generate beautiful random color palettes instantly. Lock colors, copy HEX/RGB values, and create complementary, analogous, triadic, and split-complementary schemes. Free online tool.",
  keywords: [
    "color palette generator",
    "random color scheme",
    "color scheme maker",
    "complementary colors",
    "analogous colors",
    "triadic colors",
    "color picker",
    "css color variables",
  ],
};

export default function ColorPalettePage() {
  return <ColorPaletteTool />;
}
