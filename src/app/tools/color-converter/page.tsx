import type { Metadata } from "next";
import { ColorConverterTool } from "./tool";

export const metadata: Metadata = {
  title: "Color Converter - Free HEX to RGB, HSL, CMYK Tool",
  description:
    "Convert colors between HEX, RGB, HSL, and CMYK formats instantly. Includes a visual color picker and one-click copy for each format.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hsl converter",
    "cmyk converter",
    "color picker",
    "color tool",
  ],
};

export default function ColorConverterPage() {
  return <ColorConverterTool />;
}
