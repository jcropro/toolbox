import type { Metadata } from "next";
import { PxToRemTool } from "./tool";

export const metadata: Metadata = {
  title: "PX to REM Converter - Free CSS Unit Calculator",
  description:
    "Convert pixels to rem units and rem to pixels instantly. Configurable base font size, quick reference table, and bulk converter for CSS development.",
  keywords: [
    "px to rem",
    "rem to px",
    "css unit converter",
    "pixel to rem",
    "rem calculator",
    "css calculator",
    "font size converter",
    "responsive design",
  ],
};

export default function PxToRemPage() {
  return <PxToRemTool />;
}
