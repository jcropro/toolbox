import type { Metadata } from "next";
import { StopwatchTool } from "./tool";

export const metadata: Metadata = {
  title: "Online Stopwatch - Free Lap Timer & Stopwatch",
  description:
    "Free online stopwatch with lap timer functionality. Start, stop, reset, and record split times. Precise timing displayed in hours, minutes, seconds, and milliseconds.",
  keywords: [
    "online stopwatch",
    "lap timer",
    "split timer",
    "free stopwatch",
    "stopwatch online",
    "timer with laps",
    "digital stopwatch",
  ],
};

export default function StopwatchPage() {
  return <StopwatchTool />;
}
