import type { Metadata } from "next";
import { ScreenInfoTool } from "./tool";

export const metadata: Metadata = {
  title: "Screen Resolution Checker - Free Display Info Tool",
  description:
    "Instantly see your screen resolution, viewport size, pixel ratio, color depth, orientation, touch support, and user agent. Updates live on resize.",
  keywords: [
    "screen resolution",
    "screen size checker",
    "display info",
    "viewport size",
    "device pixel ratio",
    "browser resolution",
    "screen detector",
  ],
};

export default function ScreenInfoPage() {
  return <ScreenInfoTool />;
}
